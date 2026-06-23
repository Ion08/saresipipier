"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  CalendarCheck,
  Image,
  MessageSquareText,
  Home,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/wordmark";
import { logoutAdmin } from "@/lib/actions";

const sidebarItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Produse", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categorii", icon: FolderTree },
  { href: "/admin/reservations", label: "Rezervări", icon: CalendarCheck },
  { href: "/admin/gallery", label: "Galerie", icon: Image },
  { href: "/admin/testimonials", label: "Testimoniale", icon: MessageSquareText },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/settings", label: "Setări", icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  const isActive = (item: (typeof sidebarItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <DesktopSidebar
        open={sidebarOpen}
        items={sidebarItems}
        isActive={isActive}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <AnimatePresence>
        {mobileSidebarOpen && (
          <MobileSidebar
            items={sidebarItems}
            isActive={isActive}
            onClose={() => setMobileSidebarOpen(false)}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", sidebarOpen ? "lg:ml-64" : "lg:ml-20")}>
        <TopBar
          onMenuClick={() => setMobileSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function DesktopSidebar({
  open,
  items,
  isActive,
  onToggle,
}: {
  open: boolean;
  items: typeof sidebarItems;
  isActive: (item: (typeof sidebarItems)[0]) => boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 bg-carbone transition-all duration-300",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-bianco/10">
        <div className={cn("flex items-center gap-3 overflow-hidden", open ? "w-auto" : "w-0")}>
          <Wordmark variant="light" className="text-lg whitespace-nowrap" />
        </div>
        <div className={cn("flex items-center", !open && "mx-auto")}>
          <span className="font-display text-lg text-rosso whitespace-nowrap lg:hidden">
            S&amp;P
          </span>
        </div>
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-center w-8 h-8  text-white/50 hover:text-white hover:bg-white/10 ",
            open ? "ml-auto" : "hidden"
          )}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5  text-sm font-medium  group",
                active
                  ? "bg-rosso/20 text-rosso"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
              title={open ? undefined : item.label}
            >
              <Icon size={20} className={cn("shrink-0", active && "text-rosso")} />
              <span className={cn("transition-opacity duration-200", open ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-bianco/10">
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5  text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 ",
            open ? "" : "justify-center"
          )}
          title="Collapse"
        >
          <ChevronLeft size={20} className={cn("shrink-0 transition-transform", !open && "rotate-180")} />
          <span className={cn("transition-opacity duration-200", open ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
            Restrânge
          </span>
        </button>
      </div>
    </aside>
  );
}

function MobileSidebar({
  items,
  isActive,
  onClose,
  onLogout,
}: {
  items: typeof sidebarItems;
  isActive: (item: (typeof sidebarItems)[0]) => boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black " onClick={onClose} />
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute left-0 top-0 bottom-0 w-72 bg-carbone shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-bianco/10">
          <Wordmark variant="light" className="text-lg" />
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8  text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5  text-sm font-medium ",
                  active
                    ? "bg-rosso/20 text-rosso"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={20} className={cn("shrink-0", active && "text-rosso")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-bianco/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5  text-sm font-medium text-rosso/70 hover:text-rosso hover:bg-white/5 "
          >
            <LogOut size={20} />
            Ieșire
          </button>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function TopBar({
  onMenuClick,
  sidebarOpen,
  onSidebarToggle,
  onLogout,
}: {
  onMenuClick: () => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-6 bg-white  border-b border-black/20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 text-black/50 hover:text-black hover:bg-black/10"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <button
          onClick={onSidebarToggle}
          className="hidden lg:flex items-center justify-center w-9 h-9  text-cenere hover:text-carbone hover:bg-bordo/40 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-xs text-cenere hover:text-rosso transition-colors px-3 py-1.5  hover:bg-rosso/5"
        >
          Vezi site
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-rosso hover:text-rosso-dark hover:bg-rosso/5  transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Ieșire</span>
        </button>
      </div>
    </header>
  );
}
