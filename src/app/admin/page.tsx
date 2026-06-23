"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  FolderTree,
  CalendarCheck,
  Image,
  Settings,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getProducts,
  getCategories,
  getReservations,
  getGalleryItems,
} from "@/lib/actions";
import { formatDate, cn } from "@/lib/utils";
import type { Product, Category, Reservation, GalleryItem } from "@/lib/types";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, c, r, g] = await Promise.all([
          getProducts(),
          getCategories(),
          getReservations(),
          getGalleryItems(),
        ]);
        setProducts(p as unknown as Product[]);
        setCategories(c as unknown as Category[]);
        setReservations(r as unknown as Reservation[]);
        setGalleryItems(g as unknown as GalleryItem[]);
      } catch (e) {
        console.error("Failed to fetch dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 " />
          ))}
        </div>
        <Skeleton className="h-64 " />
      </div>
    );
  }

  const pendingReservations = reservations.filter((r) => r.status === "pending");
  const recentReservations = reservations.slice(0, 5);

  const stats = [
    {
      label: "Produse",
      value: products.length,
      icon: UtensilsCrossed,
      href: "/admin/products",
      color: "text-rosso",
      bg: "bg-rosso/10",
    },
    {
      label: "Categorii",
      value: categories.length,
      icon: FolderTree,
      href: "/admin/categories",
      color: "text-verde",
      bg: "bg-verde/10",
    },
    {
      label: "Rezervări în așteptare",
      value: pendingReservations.length,
      icon: CalendarCheck,
      href: "/admin/reservations",
      color: "text-rosso",
      bg: "bg-warning/10",
    },
    {
      label: "Galerie",
      value: galleryItems.length,
      icon: Image,
      href: "/admin/gallery",
      color: "text-verde",
      bg: "bg-bordo",
    },
  ];

  const quickActions = [
    { label: "Adaugă produs", href: "/admin/products", icon: Plus },
    { label: "Vezi rezervări", href: "/admin/reservations", icon: Eye },
    { label: "Galerie", href: "/admin/gallery", icon: Image },
    { label: "Setări", href: "/admin/settings", icon: Settings },
  ];

  const statusColors: Record<string, "accent" | "success" | "error" | "neutral"> = {
    pending: "warning",
    confirmed: "success",
    cancelled: "error",
    completed: "neutral",
  } as any;

  const statusLabels: Record<string, string> = {
    pending: "În așteptare",
    confirmed: "Confirmată",
    cancelled: "Anulată",
    completed: "Finalizată",
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl text-carbone">Dashboard</h1>
<p className="text-rosso text-sm font-bold uppercase tracking-wider mt-2">
            bine ai revenit
            </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href}>
                <Card hover className="h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-cenere uppercase tracking-wide">{stat.label}</p>
                        <p className="text-3xl font-display text-carbone mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex items-center justify-center w-11 h-11 ",
                          stat.color,
                          stat.bg
                        )}
                      >
                        <Icon size={22} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-5 md:p-6 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg text-carbone">
                    Rezervări recente
                  </h2>
                  <Link
                    href="/admin/reservations"
                    className="text-sm text-rosso hover:text-rosso-dark transition-colors flex items-center gap-1"
                  >
                    Vezi toate <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <CardContent>
                {recentReservations.length === 0 ? (
                  <p className="text-sm text-cenere py-8 text-center">
                    Nu există rezervări recente.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-bordo">
                          <th className="text-left py-3 px-2 font-medium text-cenere text-xs uppercase tracking-wide">
                            Nume
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-cenere text-xs uppercase tracking-wide hidden sm:table-cell">
                            Telefon
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-cenere text-xs uppercase tracking-wide hidden md:table-cell">
                            Data
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-cenere text-xs uppercase tracking-wide hidden md:table-cell">
                            Ora
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-cenere text-xs uppercase tracking-wide">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReservations.map((res) => (
                          <tr
                            key={res.$id}
                            className="border-b border-bordo/50 hover:bg-background-warm/50 transition-colors"
                          >
                            <td className="py-3 px-2 font-medium text-carbone">
                              {res.name}
                            </td>
                            <td className="py-3 px-2 text-cenere hidden sm:table-cell">
                              {res.phone}
                            </td>
                            <td className="py-3 px-2 text-cenere hidden md:table-cell">
                              {formatDate(res.date)}
                            </td>
                            <td className="py-3 px-2 text-cenere hidden md:table-cell">
                              {res.time}
                            </td>
                            <td className="py-3 px-2">
                              <Badge
                                variant={statusColors[res.status] || "neutral"}
                                size="sm"
                              >
                                {statusLabels[res.status] || res.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="p-5 md:p-6 pb-0">
                <h2 className="font-display text-lg text-carbone">
                  Acțiuni rapide
                </h2>
              </div>
              <CardContent className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.label} href={action.href}>
                      <Button
                        variant="ghost"
                        size="md"
                        className="w-full justify-start"
                        iconLeft={<Icon size={16} />}
                      >
                        {action.label}
                      </Button>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <div className="p-5 md:p-6 pb-0">
                <h2 className="font-display text-lg text-carbone">
                  Status rezervări
                </h2>
              </div>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-verde" />
                      <span className="text-sm text-cenere">Confirmate</span>
                    </div>
                    <span className="font-semibold text-carbone">
                      {reservations.filter((r) => r.status === "confirmed").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarCheck size={16} className="text-rosso" />
                      <span className="text-sm text-cenere">În așteptare</span>
                    </div>
                    <span className="font-semibold text-carbone">
                      {pendingReservations.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle size={16} className="text-rosso" />
                      <span className="text-sm text-cenere">Anulate</span>
                    </div>
                    <span className="font-semibold text-carbone">
                      {reservations.filter((r) => r.status === "cancelled").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
