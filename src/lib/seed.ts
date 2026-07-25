import { pool } from "./db.server";
import { PRODUCTS } from "../data/catalog";

async function main() {
  console.log("Connecting to database and setting up schema...");
  
  // 1. Create Tables
  const client = await pool.connect();
  try {
    console.log("Creating products table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price INT NOT NULL,
        img TEXT NOT NULL,
        hr VARCHAR(50) DEFAULT '12 HR',
        description TEXT,
        base VARCHAR(100),
        is_custom BOOLEAN DEFAULT FALSE,
        pricing JSONB,
        badge VARCHAR(100),
        featured_on_homepage BOOLEAN DEFAULT FALSE,
        hero_title VARCHAR(255),
        hero_description TEXT,
        hover_img TEXT,
        gallery JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating orders table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        delivery_house TEXT NOT NULL,
        delivery_area TEXT NOT NULL,
        delivery_district VARCHAR(100) NOT NULL,
        delivery_state VARCHAR(100) NOT NULL,
        delivery_pin VARCHAR(20) NOT NULL,
        payment_id VARCHAR(255),
        items JSONB NOT NULL,
        subtotal INT NOT NULL,
        shipping INT NOT NULL,
        total INT NOT NULL,
        status VARCHAR(50) DEFAULT 'WAITING',
        date_string VARCHAR(255),
        status_history JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Creating hero_settings table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_settings (
        mode VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        featured_slug VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Seed default products
    console.log("Seeding default products...");
    for (const p of PRODUCTS) {
      // Upsert based on slug
      await client.query(`
        INSERT INTO products (
          slug, name, category, price, img, hr, description, base, 
          pricing, badge, featured_on_homepage, hero_title, hero_description, hover_img, gallery
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          price = EXCLUDED.price,
          img = EXCLUDED.img,
          hr = EXCLUDED.hr,
          description = EXCLUDED.description,
          base = EXCLUDED.base,
          pricing = EXCLUDED.pricing,
          badge = EXCLUDED.badge,
          featured_on_homepage = EXCLUDED.featured_on_homepage,
          hero_title = EXCLUDED.hero_title,
          hero_description = EXCLUDED.hero_description,
          hover_img = EXCLUDED.hover_img,
          gallery = EXCLUDED.gallery
      `, [
        p.slug,
        p.name,
        p.category,
        p.price,
        p.img,
        p.hr,
        p.description,
        p.base,
        p.pricing ? JSON.stringify(p.pricing) : null,
        p.badge || null,
        p.featuredOnHomepage || false,
        p.heroTitle || null,
        p.heroDescription || null,
        p.hoverImg || null,
        JSON.stringify(p.gallery || [])
      ]);
    }
    
    // 3. Seed default hero settings
    console.log("Seeding default hero settings...");
    const defaultHeroSettings = [
      {
        mode: "OUD_BASE",
        title: "Our Exclusive\nPerfume Divorce",
        description: "Elevate your glow with beauty essentials, shop the latest must-haves in one chic storefront.",
        featured_slug: "divorce-perfume"
      },
      {
        mode: "FLORAL_BASE",
        title: "Our Exclusive\nRose Chiffon",
        description: "Elegant blooming roses, sweet pink peony, and a touch of warm white musk absolute.",
        featured_slug: "rose-chiffon"
      },
      {
        mode: "FRUITY_BASE",
        title: "Our Exclusive\nPeach Nectar",
        description: "Sweet sun-ripened peach, juicy apricot nectar, and sparkling mandarin zest.",
        featured_slug: "peach-nectar"
      },
      {
        mode: "FRESH_BASE",
        title: "Our Exclusive\nOcean Breeze",
        description: "Crisp sea salt, cool marine accords, and sun-bleached driftwood absolute.",
        featured_slug: "ocean-breeze"
      }
    ];

    for (const h of defaultHeroSettings) {
      await client.query(`
        INSERT INTO hero_settings (mode, title, description, featured_slug)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (mode) DO NOTHING
      `, [h.mode, h.title, h.description, h.featured_slug]);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
