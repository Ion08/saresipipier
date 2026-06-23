"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Phone, Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { cn, formatPrice, getOptimizedImageUrl } from "@/lib/utils";
import { getFoodImage } from "@/lib/food-images";
import { useCart } from "@/lib/cart-context";
import toast from "react-hot-toast";
import type { Product, Category } from "@/lib/types";

interface MenuClientProps {
  categories: Category[];
  products: Product[];
}

function getProductImage(p: Product, categoryName: string): string {
  if (p.image && p.image.trim()) {
    return getOptimizedImageUrl(p.image, 400);
  }
  return getFoodImage(p.name, categoryName || "");
}

export default function MenuClient({ categories, products }: MenuClientProps) {
  const { addItem, setCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<{ product: Product; categoryName: string } | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [imgLoaded, setImgLoaded] = useState<Record<string, boolean>>({});
  const [headerHidden, setHeaderHidden] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.order - b.order);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.ingredients || "").toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const groupedProducts = useMemo(() => {
    return sortedCategories
      .map((cat) => ({
        category: cat,
        items: filteredProducts.filter((p) => p.category === cat.$id),
      }))
      .filter((g) => g.items.length > 0);
  }, [filteredProducts, sortedCategories]);

  useEffect(() => {
    const hash = window.location.hash.replace("#cat-", "");
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(`cat-${hash}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const ref = { current: false };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        let nextHidden = false;
        if (currentScrollY > 80) {
          nextHidden = currentScrollY > lastScrollY;
        }
        if (nextHidden !== ref.current) {
          ref.current = nextHidden;
          setHeaderHidden(nextHidden);
        }
        lastScrollY = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("cat-", "");
            setActiveSection(id);
          }
        });
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
    );

    groupedProducts.forEach(({ category }) => {
      const el = document.getElementById(`cat-${category.slug}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [groupedProducts]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedProduct]);

  const scrollToCategory = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <>
      <section className="bg-piper text-sare pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden">
        <div className="container-custom px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-rosso text-xs font-bold uppercase tracking-widest mb-5">Poftă bună</p>
            <h1 className="text-6xl md:text-8xl text-sare leading-[0.9]">
              Ce gătim noi
            </h1>
            <p className="text-sare/60 text-sm font-bold uppercase tracking-wider mt-4">
              Alege și savurează
            </p>
          </motion.div>
        </div>
      </section>

      <section className={cn("sticky z-30 bg-sare border-b-3 border-piper", headerHidden ? "top-0" : "top-16 md:top-20")}>
        <div className="container-custom px-4 md:px-6 py-2 md:py-3">
          {searchOpen ? (
            <div className="relative max-w-md mx-auto">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-cenere pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută preparat..."
                autoFocus
                className="w-full border-[2px] border-piper bg-sare pl-11 pr-10 py-2 text-sm text-piper placeholder:text-cenere/60 focus:outline-none focus:border-rosso"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cenere hover:text-piper">
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {sortedCategories.map((cat) => (
                <button
                  key={cat.$id}
                  onClick={() => scrollToCategory(cat.slug)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-[2px]",
                    activeSection === cat.slug
                      ? "bg-rosso text-sare border-rosso"
                      : "border-piper text-piper/60 hover:text-piper hover:bg-piper/5"
                  )}
                >
                  {cat.name}
                </button>
              ))}
              <button
                onClick={() => setSearchOpen(true)}
                className="ml-auto flex items-center justify-center w-8 h-8 border-[2px] border-piper text-piper hover:bg-piper hover:text-sare"
                aria-label="Caută preparat"
              >
                <Search size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-sare py-16 md:py-24">
        <div className="container-custom px-4 md:px-6">
          {groupedProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-piper-muted text-sm font-bold uppercase tracking-wider">Hmm, nu am găsit nimic</p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-6 py-2.5 text-sm mt-4 border-3 border-piper text-piper font-bold uppercase tracking-wider hover:bg-piper hover:text-sare"
              >
                Resetează
              </button>
            </div>
          ) : (
            <div className="space-y-32 md:space-y-40">
              {groupedProducts.map(({ category, items }) => (
                <div
                  key={category.$id}
                  id={`cat-${category.slug}`}
                  ref={(el) => { sectionRefs.current[category.slug] = el; }}
                  className={cn("scroll-mt-32 md:scroll-mt-40", headerHidden && "scroll-mt-16 md:scroll-mt-20")}
                >
                  <div className="mb-10 md:mb-14">
                    <h2 className="text-4xl md:text-6xl text-piper">{category.name}</h2>
                    {category.description && (
                      <p className="text-piper-muted text-sm mt-2 font-bold uppercase tracking-wider">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {items.map((p) => (
                      <div key={p.$id} className="group border-3 border-piper image-zoom">
                        <div className="relative aspect-square w-full overflow-hidden bg-sare-muted cursor-pointer"
                          onClick={() => setSelectedProduct({ product: p, categoryName: category.name })}
                        >
                          {!imgLoaded[p.$id] && (
                            <div className="absolute inset-0 z-0 animate-pulse bg-sare-muted" />
                          )}
                          <Image
                            src={imgErrors[p.$id] ? getFoodImage(p.name, category.name) : getProductImage(p, category.name)}
                            alt={p.name}
                            fill
                            className={cn("object-cover transition-opacity duration-500", imgLoaded[p.$id] ? "opacity-100" : "opacity-0")}
                            sizes="(max-width: 640px) 50vw, 33vw"
                            loading="lazy"
                            onLoad={() => setImgLoaded((prev) => ({ ...prev, [p.$id]: true }))}
                            onError={() => handleImgError(p.$id)}
                          />
                          {p.new && (
                            <span className="absolute top-3 left-3 z-10 border-[2px] border-verde text-verde font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 bg-sare">Nou</span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const img = imgErrors[p.$id] ? getFoodImage(p.name, category.name) : getProductImage(p, category.name);
                              addItem({
                                id: p.$id,
                                name: p.name,
                                price: p.price,
                                weight: p.weight || "",
                                image: img,
                              }, 1);
                              toast.success(`${p.name} adăugat în coș`, { duration: 2000 });
                            }}
                            className="absolute bottom-3 right-3 w-9 h-9 border-[2px] border-piper bg-sare flex items-center justify-center group-hover:bg-piper"
                            aria-label={`Adaugă ${p.name} în coș`}
                          >
                            <Plus size={16} className="text-piper group-hover:text-sare" />
                          </button>
                        </div>
                        <div
                          className="cursor-pointer p-3"
                          onClick={() => setSelectedProduct({ product: p, categoryName: category.name })}
                        >
                          <h3 className="font-display text-sm md:text-lg text-piper uppercase tracking-wide leading-tight">
                            {p.name}
                          </h3>
                          <div className="mt-2 flex items-center justify-between">
                            {p.weight && (
                              <span className="text-verde text-xs uppercase tracking-wide font-bold">{p.weight}</span>
                            )}
                            <span className="font-display text-lg md:text-xl text-rosso ml-auto">{formatPrice(p.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct.product}
            categoryName={selectedProduct.categoryName}
            onClose={() => setSelectedProduct(null)}
            onImgError={handleImgError}
            imgError={!!imgErrors[selectedProduct.product.$id]}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ProductModal({
  product,
  categoryName,
  onClose,
  onImgError,
  imgError,
}: {
  product: Product;
  categoryName: string;
  onClose: () => void;
  onImgError: (id: string) => void;
  imgError: boolean;
}) {
  const { addItem, setCartOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [modalImgLoaded, setModalImgLoaded] = useState(false);

  const imgSrc = imgError
    ? getFoodImage(product.name, categoryName)
    : product.image
      ? getOptimizedImageUrl(product.image, 800)
      : getFoodImage(product.name, categoryName);

  const handleAddToCart = () => {
    addItem({ id: product.$id, name: product.name, price: product.price, weight: product.weight, image: imgSrc }, qty);
    onClose();
    setCartOpen(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-piper/80" />

      <motion.div
        className="relative bg-sare border-3 border-piper overflow-y-auto max-w-2xl w-full max-h-[90vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 border-3 border-piper bg-sare text-piper hover:bg-piper hover:text-sare"
          aria-label="Închide"
        >
          <X size={20} />
        </button>

        <div className="relative w-full aspect-[4/3] overflow-hidden bg-sare-muted image-zoom">
          {!modalImgLoaded && (
            <div className="absolute inset-0 z-0 animate-pulse bg-sare-muted" />
          )}
          <Image src={imgSrc} alt={product.name} fill className={cn("object-cover transition-opacity duration-500", modalImgLoaded ? "opacity-100" : "opacity-0")} sizes="(max-width: 768px) 100vw, 672px" loading="lazy" onLoad={() => setModalImgLoaded(true)} onError={() => onImgError(product.$id)} />
          {product.new && <span className="absolute top-4 left-4 z-10 border-[2px] border-verde text-verde font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 bg-sare">Nou</span>}
        </div>

        <div className="p-6 md:p-8">
          <p className="text-verde text-xs font-bold uppercase tracking-widest mb-2">{categoryName}</p>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-2xl md:text-3xl text-piper">{product.name}</h2>
            <span className="font-display text-2xl md:text-3xl text-rosso shrink-0">{formatPrice(product.price)}</span>
          </div>

          {product.description && <p className="text-piper-muted text-base leading-relaxed mb-5">{product.description}</p>}

          {product.ingredients && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-cenere mb-2">Ingrediente</p>
              <p className="text-piper-muted text-sm leading-relaxed">{product.ingredients}</p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t-3 border-piper mb-5">
            {product.weight && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cenere">Porție</p>
                <p className="font-display text-lg text-piper">{product.weight}</p>
              </div>
            )}
            {product.available === false && <span className="ml-auto text-cenere text-sm font-bold uppercase tracking-wider">Indisponibil</span>}
          </div>

          {product.available !== false && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 border-[2px] border-piper flex items-center justify-center text-piper hover:bg-piper hover:text-sare">
                  <Minus size={16} />
                </button>
                <span className="font-display text-xl text-piper w-8 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 border-[2px] border-piper flex items-center justify-center text-piper hover:bg-piper hover:text-sare">
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 py-3 text-sm font-bold uppercase tracking-wider bg-rosso text-sare border-3 border-rosso hover:bg-piper hover:border-piper flex items-center justify-center gap-2">
                <ShoppingBag size={17} />
                Adaugă · {formatPrice(product.price * qty)}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
