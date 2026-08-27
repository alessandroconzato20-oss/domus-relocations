/*
 * DOMUS Relocations — Navigation Component
 * Design: Milanese Atelier — appears on scroll-up, disappears on scroll-down
 * Logo left, links right, gold accent on hover
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/DomusRelocationsLogo_506fe4bc.png";

interface NavigationProps {
  onQuizOpen?: () => void;
}

export default function Navigation({ onQuizOpen: _onQuizOpen }: NavigationProps) {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 60);
      if (currentY < lastScrollY || currentY < 100) {
        setVisible(true);
      } else {
        setVisible(false);
        setMenuOpen(false);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.4s ease",
        background: atTop ? "transparent" : "rgba(245, 240, 232, 0.96)",
        backdropFilter: atTop ? "none" : "blur(12px)",
        borderBottom: atTop ? "none" : "1px solid rgba(201, 168, 76, 0.15)",
      }}
    >
      <div className="container">
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "1.25rem 0" }}>
          {/* Desktop Links */}
          <div style={{ alignItems: "center", justifyContent: "space-between", width: "100%" }} className="domus-desktop-links hidden md:flex">
            <button onClick={() => scrollTo("about")} className="nav-link" style={{ background: "none", border: "none" }}>
              Our Approach
            </button>
            <button onClick={() => scrollTo("partners")} className="nav-link" style={{ background: "none", border: "none" }}>
              The DOMUS Network
            </button>
            <button onClick={() => scrollTo("services")} className="nav-link" style={{ background: "none", border: "none" }}>
              Private Services
            </button>
            <button onClick={() => scrollTo("students")} className="nav-link" style={{ background: "none", border: "none" }}>
              International Students
            </button>
            <button onClick={() => scrollTo("milan")} className="nav-link" style={{ background: "none", border: "none" }}>
              Living In Milano
            </button>
            <a
              href="/login"
              className="nav-link"
              style={{ textDecoration: "none" }}
            >
              Client Login
            </a>
          </div>

          {/* Mobile menu control */}
          <button
            className="domus-mobile-menu-toggle md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", padding: "0.5rem", cursor: "pointer" }}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ display: "block", width: "22px", height: "1px", background: menuOpen ? "transparent" : "var(--domus-charcoal)", transition: "all 0.3s" }} />
              <span style={{ display: "block", width: "22px", height: "1px", background: "var(--domus-charcoal)", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none", transition: "all 0.3s" }} />
              <span style={{ display: "block", width: "22px", height: "1px", background: "var(--domus-charcoal)", transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none", transition: "all 0.3s" }} />
            </div>
          </button>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="domus-mobile-menu">
            <div className="domus-mobile-category-grid">
              <button onClick={() => scrollTo("about")} className="domus-mobile-category">Our Approach</button>
              <button onClick={() => scrollTo("partners")} className="domus-mobile-category">The DOMUS Network</button>
              <button onClick={() => scrollTo("services")} className="domus-mobile-category">Private Services</button>
              <button onClick={() => scrollTo("students")} className="domus-mobile-category">International Students</button>
              <button onClick={() => scrollTo("milan")} className="domus-mobile-category domus-mobile-category-wide">Living In Milano</button>
            </div>
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="domus-mobile-login"
            >
              Client Login
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
