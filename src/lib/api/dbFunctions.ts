import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders, getRequestIP } from "@tanstack/react-start/server";
import { pool } from "../db.server";
import { sendMetaCapiEvent } from "../metaCapi.server";
import { Product, getMergedProducts, PRODUCTS } from "@/data/catalog";
import { z } from "zod";
import path from "path";
import fs from "fs/promises";

function mapDbProduct(row: any): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    priceLabel: `₹${row.price.toLocaleString("en-IN")}`,
    img: row.img,
    hr: row.hr || "12 HR",
    description: row.description,
    base: row.base,
    isCustom: row.is_custom,
    pricing: row.pricing || undefined,
    badge: row.badge || undefined,
    featuredOnHomepage: row.featured_on_homepage,
    heroTitle: row.hero_title || undefined,
    heroDescription: row.hero_description || undefined,
    hoverImg: row.hover_img || undefined,
    gallery: row.gallery || [],
  };
}

export const getProductsDb = createServerFn({ method: "GET" })
  .handler(async () => {
    const filePath = path.resolve(process.cwd(), "src/data/custom_products.json");
    let custom: any[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      custom = JSON.parse(raw);
    } catch (e) {
      custom = [];
    }

    const mapped = custom.map((c) => ({
      slug: c.slug,
      name: c.name,
      category: c.category,
      price: c.price,
      priceLabel: `₹${c.price.toLocaleString("en-IN")}`,
      img: c.img,
      hr: c.hr || "12 HR",
      description: c.description,
      base: c.base,
      isCustom: true,
      pricing: c.pricing,
      badge: c.badge,
      featuredOnHomepage: c.featuredOnHomepage || false,
      heroTitle: c.heroTitle,
      heroDescription: c.heroDescription,
      hoverImg: c.hoverImg,
      gallery: c.gallery || [],
    }));

    const customSlugs = mapped.map((p) => p.slug);
    const baseProducts = PRODUCTS.filter((p) => !customSlugs.includes(p.slug));

    return [...baseProducts, ...mapped];
  });

export const createOrUpdateProductDb = createServerFn({ method: "POST" })
  .validator(
    z.object({
      slug: z.string(),
      name: z.string(),
      category: z.string(),
      price: z.number(),
      img: z.string(),
      hr: z.string().optional(),
      description: z.string().optional(),
      base: z.string().optional(),
      isCustom: z.boolean().optional(),
      pricing: z.any().optional(),
      badge: z.string().optional(),
      featuredOnHomepage: z.boolean().optional(),
      heroTitle: z.string().optional(),
      heroDescription: z.string().optional(),
      hoverImg: z.string().optional(),
      gallery: z.array(z.string()).optional(),
    })
  )
  .handler(async ({ data }) => {
    const filePath = path.resolve(process.cwd(), "src/data/custom_products.json");
    let list: any[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      list = JSON.parse(raw);
    } catch (e) {
      list = [];
    }

    const index = list.findIndex((p) => p.slug === data.slug);
    const mappedProduct = {
      slug: data.slug,
      name: data.name,
      category: data.category,
      price: data.price,
      img: data.img,
      hr: data.hr || "12 HR",
      description: data.description || "",
      base: data.base,
      isCustom: true,
      pricing: data.pricing || undefined,
      badge: data.badge || undefined,
      featuredOnHomepage: data.featuredOnHomepage || false,
      heroTitle: data.heroTitle || undefined,
      heroDescription: data.heroDescription || undefined,
      hoverImg: data.hoverImg || undefined,
      gallery: data.gallery || [],
    };

    if (index >= 0) {
      list[index] = mappedProduct;
    } else {
      list.push(mappedProduct);
    }

    await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf-8");
    return mappedProduct;
  });

export const deleteProductDb = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const filePath = path.resolve(process.cwd(), "src/data/custom_products.json");
    let list: any[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      list = JSON.parse(raw);
    } catch (e) {
      list = [];
    }

    const filtered = list.filter((p) => p.slug !== data.slug);
    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    return { success: true };
  });

export const createOrderDb = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
      customerName: z.string(),
      customerPhone: z.string(),
      deliveryAddress: z.object({
        house: z.string(),
        area: z.string(),
        district: z.string(),
        state: z.string(),
        pin: z.string(),
      }),
      paymentId: z.string().optional().nullable(),
      items: z.array(z.any()),
      subtotal: z.number(),
      shipping: z.number(),
      total: z.number(),
      status: z.string().optional(),
      dateString: z.string().optional().nullable(),
      fbp: z.string().optional().nullable(),
      fbc: z.string().optional().nullable(),
    })
  )
  .handler(async ({ data }) => {
    const input = data;
    await pool.query(
      `
      INSERT INTO orders (
        id, customer_name, customer_phone, delivery_house, delivery_area, 
        delivery_district, delivery_state, delivery_pin, payment_id, 
        items, subtotal, shipping, total, status, date_string
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `,
      [
        input.id,
        input.customerName,
        input.customerPhone,
        input.deliveryAddress.house,
        input.deliveryAddress.area,
        input.deliveryAddress.district,
        input.deliveryAddress.state,
        input.deliveryAddress.pin,
        input.paymentId || null,
        JSON.stringify(input.items),
        input.subtotal,
        input.shipping,
        input.total,
        input.status || "WAITING",
        input.dateString || null,
      ]
    );

    // Conversions API tracking
    try {
      const headers = getRequestHeaders();
      const userAgent = headers["user-agent"] || undefined;
      const clientIp = getRequestIP({ xForwardedFor: true }) || undefined;

      const nameParts = input.customerName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      sendMetaCapiEvent({
        eventName: "Purchase",
        eventId: input.id,
        eventSourceUrl: "https://voguishmoments.com/cart",
        userData: {
          phone: input.customerPhone,
          firstName,
          lastName,
          clientIpAddress: clientIp,
          clientUserAgent: userAgent,
          fbp: input.fbp || undefined,
          fbc: input.fbc || undefined,
        },
        customData: {
          value: input.total,
          currency: "INR",
          contents: input.items.map((item: any) => ({
            id: item.slug,
            quantity: item.qty,
            price: item.price,
          })),
          content_type: "product",
        },
      }).catch((err) => {
        console.error("[Meta CAPI] Event transmission failed asynchronously:", err);
      });
    } catch (capiError) {
      console.error("[Meta CAPI] Error preparing or sending CAPI event:", capiError);
    }

    return { success: true };
  });

export const getOrdersDb = createServerFn({ method: "GET" })
  .handler(async () => {
    const res = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    return res.rows.map((row) => ({
      id: row.id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      deliveryAddress: {
        house: row.delivery_house,
        area: row.delivery_area,
        district: row.delivery_district,
        state: row.delivery_state,
        pin: row.delivery_pin,
      },
      paymentId: row.payment_id || undefined,
      items: row.items,
      subtotal: row.subtotal,
      shipping: row.shipping,
      total: row.total,
      status: row.status,
      date: row.date_string,
    }));
  });

export const updateOrderStatusDb = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), status: z.string() }))
  .handler(async ({ data }) => {
    const input = data;
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [input.status, input.id]);
    return { success: true };
  });

export const deleteOrderDb = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const input = data;
    await pool.query("DELETE FROM orders WHERE id = $1", [input.id]);
    return { success: true };
  });


