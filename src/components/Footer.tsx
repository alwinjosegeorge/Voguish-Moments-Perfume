import { Link } from "@tanstack/react-router";
import { Instagram, Phone, MessageSquare } from "lucide-react";
import { VoguishMomentsLogo } from "./Header";

export function Footer() {
  return (
    <footer className="bg-cream/70 mt-16">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 py-14">
        <div className="grid md:grid-cols-2 gap-10 pb-10 border-b border-border">
          <div>
            <div className="mb-4"><VoguishMomentsLogo /></div>
            <p className="text-muted-foreground max-w-xs">
              We Sell Emotions &amp; Moments
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-center gap-3 text-sm">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Phone:</span>
              <a href="tel:9061516361" className="font-semibold hover:text-accent">9061516361</a>
            </div>
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">WhatsApp:</span>
              <a href="https://wa.me/919061516361" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent">9061516361</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Instagram className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Instagram:</span>
              <a href="https://www.instagram.com/voguishmoments?igsh=MWJiMnUyb3UxejFobw==" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent">@voguishmoments</a>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <nav className="flex flex-wrap gap-7 text-sm">
            <Link to="/" className="hover:text-accent">Home</Link>
            <Link to="/articles" className="hover:text-accent">Articles</Link>
            <Link to="/about" className="hover:text-accent">About Us</Link>
            <Link to="/contact" className="hover:text-accent">Contact Us</Link>
          </nav>
          <div className="flex flex-col md:items-end gap-1.5 text-xs text-muted-foreground text-center md:text-right">
            <p>© 2026 — Voguish Moments. All rights reserved.</p>
            <p>
              Designed & Developed by{" "}
              <a
                href="https://codexorastudio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-foreground hover:text-accent transition-colors"
              >
                Codexora Studio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
