import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Checkout } from "../checkout/Checkout";
import { BackToTop } from "./overlays/BackToTop";
import { BagDrawer } from "./overlays/BagDrawer";
import { QuickView } from "./overlays/QuickView";
import { SearchOverlay } from "./overlays/SearchOverlay";
import { Toast } from "./overlays/Toast";
import { AnnouncementBar } from "./sections/AnnouncementBar";
import { Collections } from "./sections/Collections";
import { Craft } from "./sections/Craft";
import { Editorial } from "./sections/Editorial";
import { FadeGuide } from "./sections/FadeGuide";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Journal } from "./sections/Journal";
import { Lookbook } from "./sections/Lookbook";
import { MobileNav } from "./sections/MobileNav";
import { Navbar } from "./sections/Navbar";
import { Newsletter } from "./sections/Newsletter";
import { Reviews } from "./sections/Reviews";
import { Shop } from "./sections/Shop";
import { Ticker } from "./sections/Ticker";
import { API, getJSON } from "../../lib/api";
import { ANNOUNCEMENTS, INS, LOGO_SRC } from "../../lib/constants";
import { garment } from "../../lib/garments";
import { DEFAULT_COLOR, normalizeProduct, store } from "../../lib/helpers";
import { CSS } from "../../styles/index";

export function StoreApp() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);

  const [annIdx, setAnnIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("feat");
  const [sel, setSel] = useState({});
  const [wish, setWish] = useState(() => store.get("rf_wish", []));
  const [cart, setCart] = useState(() => store.get("rf_cart", []));
  const [promo, setPromo] = useState(() => store.get("rf_promo", ""));
  const [promoInput, setPromoInput] = useState("");
  const [bagOpen, setBagOpen] = useState(false);
  const [qv, setQv] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toastState, setToastState] = useState({ msg: "", showBtn: false, on: false });
  const [showTop, setShowTop] = useState(false);
  const [fadeMonths, setFadeMonths] = useState(0);
  const [revIdx, setRevIdx] = useState(0);
  const [logoOk, setLogoOk] = useState(true);
  const [email, setEmail] = useState("");
  const [newsMsg, setNewsMsg] = useState("");

  const toastTimer = useRef(null);
  const railRef = useRef(null);
  const heroArtRef = useRef(null);
  const hangRotRef = useRef(null);
  const qvBoxRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, r, j] = await Promise.all([
        getJSON(API.products, []),
        getJSON(API.reviews, []),
        getJSON(API.journal, []),
      ]);
      if (!alive) return;
      setProducts(p.map(normalizeProduct));
      setReviews(r);
      setPosts(j);
      setProductsLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!products.length) return;
    setSel((prev) => {
      const next = { ...prev };
      products.forEach((p) => {
        if (next[p.id] == null || next[p.id] >= p.colors.length) next[p.id] = 0;
      });
      return next;
    });
  }, [products]);

  useEffect(() => { store.set("rf_wish", wish); }, [wish]);
  useEffect(() => { store.set("rf_cart", cart); }, [cart]);
  useEffect(() => { store.set("rf_promo", promo); }, [promo]);

  useEffect(() => {
    const lock = bagOpen || !!qv || searchOpen || checkoutOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [bagOpen, qv, searchOpen, checkoutOpen]);

  const toast = useCallback((msg, showBtn = false) => {
    setToastState({ msg, showBtn, on: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState((t) => ({ ...t, on: false })), 3200);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setAnnIdx((i) => (i + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      setShowTop(window.scrollY > 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".rv:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [products, reviews, posts]);

  useEffect(() => {
    const art = heroArtRef.current;
    if (!art) return;
    const layers = Array.from(art.querySelectorAll(".layer"));
    const onMove = (e) => {
      const r = art.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach((l) => {
        const d = +l.dataset.d;
        l.style.transform = `translate(${-x * d}px,${-y * d * 0.5}px)`;
      });
      if (hangRotRef.current) {
        hangRotRef.current.style.setProperty("--ry", x * 28 + "deg");
        hangRotRef.current.style.setProperty("--rx", -y * 8 + "deg");
      }
    };
    const onLeave = () => {
      layers.forEach((l) => { l.style.transform = ""; });
      if (hangRotRef.current) {
        hangRotRef.current.style.setProperty("--ry", "0deg");
        hangRotRef.current.style.setProperty("--rx", "0deg");
      }
    };
    art.addEventListener("mousemove", onMove);
    art.addEventListener("mouseleave", onLeave);
    return () => {
      art.removeEventListener("mousemove", onMove);
      art.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const onQvMove = (e) => {
    const box = qvBoxRef.current;
    if (!box) return;
    const m = e.target.closest && e.target.closest(".m-media");
    if (!m) return;
    const r = m.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    m.style.setProperty("--qy", x * 46 + "deg");
    m.style.setProperty("--qx", -y * 14 + "deg");
  };
  const onQvLeave = () => {
    const m = qvBoxRef.current && qvBoxRef.current.querySelector(".m-media");
    if (m) { m.style.setProperty("--qy", "0deg"); m.style.setProperty("--qx", "0deg"); }
  };

  const closeAll = useCallback(() => {
    setBagOpen(false);
    setQv(null);
    setSearchOpen(false);
    setCheckoutOpen(false);
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
      const tag = document.activeElement && document.activeElement.tagName;
      if (((e.key === "/") || (e.key === "k" && (e.metaKey || e.ctrlKey))) && !/INPUT|TEXTAREA/.test(tag)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeAll]);

  const visible = useMemo(() => {
    let list = products.slice();
    if (cat === "saved") list = list.filter((p) => wish.includes(p.id));
    else if (cat !== "all") list = list.filter((p) => p.cat === cat);
    if (sort === "lo") list.sort((a, b) => a.price - b.price);
    if (sort === "hi") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, cat, sort, wish]);

  const totals = useMemo(() => {
    const sub = cart.reduce((a, l) => a + l.price * l.qty, 0);
    const disc = String(promo).toUpperCase() === "WEST10" ? sub * 0.1 : 0;
    return { sub, disc, tot: sub - disc };
  }, [cart, promo]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 4);
    return products.filter((p) =>
      (p.name + " " + p.cat + " " + p.type + " " + p.colors.map((c) => c.name).join(" "))
        .toLowerCase()
        .includes(q)
    );
  }, [products, query]);

  const lineKey = (l) => [l.productId, l.color.name, l.size, l.ins || "", l.note || ""].join("|");

  const addToCart = useCallback((product, colorIndex, size, qty = 1, opts = {}) => {
    const color = product.colors[colorIndex] || DEFAULT_COLOR;
    const ins = product.type === "jeans" ? (opts.ins || INS[0]) : "";
    const note = (opts.note || "").trim();
    const line = {
      productId: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      color: { name: color.name, b: color.b, s: color.s },
      size, ins, note, qty,
    };
    line.key = lineKey(line);
    setCart((prev) => {
      const i = prev.findIndex((l) => l.key === line.key);
      if (i > -1) {
        const next = prev.slice();
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, line];
    });
    if (opts.openBag) setBagOpen(true);
    else toast(product.name + " added to bag", true);
  }, [toast]);

  const updateQty = (idx, delta) =>
    setCart((prev) => {
      const next = prev.slice();
      next[idx] = { ...next[idx], qty: next[idx].qty + delta };
      if (next[idx].qty < 1) next.splice(idx, 1);
      return next;
    });

  const removeLine = (idx) => setCart((prev) => prev.filter((_, i) => i !== idx));
  const setLineNote = (idx, note) =>
    setCart((prev) => {
      const next = prev.slice();
      next[idx] = { ...next[idx], note };
      next[idx].key = lineKey(next[idx]);
      return next;
    });

  const toggleWish = (id) => {
    setWish((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    toast(wish.includes(id) ? "Removed from saved" : "Saved — find it under “Saved ♥”");
  };

  const goTo = (hash, category) => {
    if (category) setCat(category);
    setMenuOpen(false);
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openQV = (product) =>
    setQv({ product, ci: sel[product.id] ?? 0, size: "", qty: 1, ins: INS[0], note: "", sizeError: false });

  const openBag = () => { closeAll(); setBagOpen(true); };
  const openCheckout = () => {
    if (!cart.length) { toast("Your bag is empty"); return; }
    setBagOpen(false);
    setCheckoutOpen(true);
  };

  const fadeStages = useMemo(() => [
    [0, "Loomstate", "Inky, saturated, crisp as cardboard. Deep indigo with no memory yet. Wear them daily and resist the washing machine."],
    [6, "First memory", "Creases begin to set at the knees and lap. Honeycombs appear behind the legs as the dye starts to break."],
    [18, "Stories in the cloth", "Whiskers deepen and the first white core shows at the pockets. The fabric softens and starts to move with you."],
    [36, "High contrast", "Stark pale ridges against midnight valleys. Every habit you have is now written into the denim."],
    [60, "Relic", "Sky-blue, sun-bleached and glove-soft. Patched, darned and entirely yours."],
  ], []);

  const fadeIndex = useMemo(() => {
    let k = 0;
    fadeStages.forEach((s, i) => { if (fadeMonths >= s[0]) k = i; });
    return k;
  }, [fadeMonths, fadeStages]);

  const fadeSvg = useMemo(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const mix = (a, b, t) =>
      "#" + hex(a).map((v, i) => Math.round(lerp(v, hex(b)[i], t)).toString(16).padStart(2, "0")).join("");
    const t = fadeMonths / 60;
    const e = Math.pow(t, 0.8);
    const body = mix("#1f2937", "#aab1b9", e);
    const st = mix("#d29a58", "#f1ddb8", e * 0.6);
    const w = Math.min(1, e * 1.4);
    const hn = Math.min(1, Math.max(0, (e - 0.1) * 1.5));
    const fx =
      `<g stroke="#eef4fa" stroke-linecap="round" fill="none" opacity="${w * 0.8}" stroke-width="1.2"><path d="M48 44Q72 56 80 74M47 54Q70 64 79 80M48 64Q70 72 78 86"/><path d="M152 44Q128 56 120 74M153 54Q130 64 121 80M152 64Q130 72 122 86"/><path d="M52 188Q74 198 90 186M48 198Q72 210 90 196M54 176Q74 184 90 174"/><path d="M148 188Q126 198 110 186M152 198Q128 210 110 196M146 176Q126 184 110 174"/></g>` +
      `<g fill="#eef4fa" opacity="${hn * 0.5}"><ellipse cx="68" cy="132" rx="22" ry="11"/><ellipse cx="132" cy="132" rx="22" ry="11"/><ellipse cx="64" cy="238" rx="18" ry="5"/><ellipse cx="136" cy="238" rx="18" ry="5"/></g>` +
      `<g fill="#f8fcff" opacity="${Math.max(0, t - 0.45) * 1.1}"><rect x="108" y="44" width="30" height="36" rx="3" opacity=".5"/></g>`;
    return garment("jeans", { b: body, s: st }, fx);
  }, [fadeMonths]);

  useEffect(() => {
    if (reviews.length < 2) return;
    const id = setInterval(() => setRevIdx((i) => (i + 1) % reviews.length), 6000);
    return () => clearInterval(id);
  }, [reviews]);

  const railBy = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.querySelector(".lk");
    const step = first ? first.getBoundingClientRect().width + 24 : 320;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let down = false, sx = 0, sl = 0;
    const onDown = (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; sx = e.clientX; sl = rail.scrollLeft;
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 4) rail.classList.add("drag");
      rail.scrollLeft = sl - dx;
    };
    const onUp = () => { down = false; rail.classList.remove("drag"); };
    rail.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      rail.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setNewsMsg("Please enter a valid email address.");
      return;
    }
    setNewsMsg("Welcome to the Dispatch. Use code WEST10 for 10% off your first order.");
    setEmail("");
    setPromo("WEST10");
  };

  const applyPromo = () => {
    const v = promoInput.trim().toUpperCase();
    if (!v) { toast("Enter a code"); return; }
    if (v === "WEST10") { setPromo(v); toast("Promo applied — 10% off"); }
    else toast("That code isn’t valid");
  };

  const logoNode = logoOk
    ? <img className="f-logo" src={LOGO_SRC} alt="Rookford" onError={() => setLogoOk(false)} />
    : <div className="f-wordmark">ROOKFORD</div>;

  return (
    <div className="rf">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <AnnouncementBar annIdx={annIdx} />
      <Navbar cart={cart} goTo={goTo} openBag={openBag} scrolled={scrolled} setCat={setCat} setMenuOpen={setMenuOpen} setSearchOpen={setSearchOpen} wish={wish} />
      <MobileNav goTo={goTo} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main id="top">
        <Hero goTo={goTo} hangRotRef={hangRotRef} heroArtRef={heroArtRef} />
        <Ticker />
        <Collections goTo={goTo} />
        <Shop addToCart={addToCart} cat={cat} openQV={openQV} productsLoading={productsLoading} sel={sel} setCat={setCat} setSel={setSel} setSort={setSort} sort={sort} toggleWish={toggleWish} visible={visible} wish={wish} />
        <Editorial goTo={goTo} />
        <FadeGuide fadeIndex={fadeIndex} fadeMonths={fadeMonths} fadeStages={fadeStages} fadeSvg={fadeSvg} goTo={goTo} setFadeMonths={setFadeMonths} />
        <Lookbook railBy={railBy} railRef={railRef} />
        <Craft />
        <Journal posts={posts} />
        <Reviews revIdx={revIdx} reviews={reviews} setRevIdx={setRevIdx} />
        <Newsletter email={email} newsMsg={newsMsg} onSubscribe={onSubscribe} setEmail={setEmail} />
      </main>

      <Footer goTo={goTo} logoNode={logoNode} />
      <div className="rope" aria-hidden="true" />

      <div className={`scrim${bagOpen || qv || searchOpen || checkoutOpen ? " on" : ""}`} onClick={closeAll} />

      <BagDrawer applyPromo={applyPromo} bagOpen={bagOpen} cart={cart} goTo={goTo} openCheckout={openCheckout} promoInput={promoInput} removeLine={removeLine} setBagOpen={setBagOpen} setLineNote={setLineNote} setPromoInput={setPromoInput} totals={totals} updateQty={updateQty} />
      <QuickView addToCart={addToCart} onQvLeave={onQvLeave} onQvMove={onQvMove} qv={qv} qvBoxRef={qvBoxRef} setBagOpen={setBagOpen} setQv={setQv} setSel={setSel} toast={toast} toggleWish={toggleWish} wish={wish} />
      <SearchOverlay openQV={openQV} query={query} searchOpen={searchOpen} searchResults={searchResults} setQuery={setQuery} setSearchOpen={setSearchOpen} />

      <Checkout
        open={checkoutOpen}
        cart={cart}
        totals={totals}
        onClose={() => { setCheckoutOpen(false); goTo("#shop"); }}
        onEditBag={() => { setCheckoutOpen(false); setBagOpen(true); }}
      />

      <Toast openBag={openBag} toastState={toastState} />
      <BackToTop showTop={showTop} />
    </div>
  );
}
