"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  CalendarCheck,
  Search,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Trash2,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import {
  getReservations,
  updateReservationStatus,
  deleteReservation,
} from "@/lib/actions";
import type { Reservation } from "@/lib/types";

const statusConfig: Record<
  string,
  { variant: "accent" | "success" | "error" | "neutral"; label: string; color: string }
> = {
  pending: { variant: "accent", label: "În așteptare", color: "text-rosso" },
  confirmed: { variant: "success", label: "Confirmată", color: "text-verde" },
  cancelled: { variant: "error", label: "Anulată", color: "text-rosso" },
  completed: { variant: "neutral", label: "Finalizată", color: "text-cenere" },
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      await fetchReservations();
      setLoading(false);
    };
    init();
  }, []);

  const fetchReservations = async () => {
    const data = await getReservations();
    setReservations(data as unknown as Reservation[]);
  };

  const filtered = useMemo(() => {
    let result = reservations;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date + " " + a.time).getTime();
      const dateB = new Date(b.date + " " + b.time).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });
    return result;
  }, [reservations, search, sortAsc]);

  const handleStatusChange = async (
    id: string,
    status: "confirmed" | "cancelled" | "completed"
  ) => {
    setStatusLoading(id);
    try {
      const res = await updateReservationStatus(id, status);
      if (res.success) {
        toast.success("Statusul rezervării a fost actualizat");
        await fetchReservations();
      } else {
        toast.error(res.error || "Eroare la actualizare");
      }
    } catch {
      toast.error("A apărut o eroare");
    } finally {
      setStatusLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await deleteReservation(deletingId);
      if (res.success) {
        toast.success("Rezervarea a fost ștearsă");
        await fetchReservations();
      } else {
        toast.error(res.error || "Eroare la ștergere");
      }
    } catch {
      toast.error("A apărut o eroare");
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full " />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl text-carbone">
            Rezervări
          </h1>
<p className="text-rosso text-sm font-bold uppercase tracking-wider mt-2">
            gestionează cererile
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cenere"
            />
            <input
              type="text"
              placeholder="Caută după nume, telefon, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full  border border-bordo bg-bianco-card pl-9 pr-3.5 py-2.5 text-sm text-carbone placeholder:text-cenere/60 focus:border-rosso focus:outline-none focus:ring-2 focus:ring-rosso/20 transition-colors"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<ArrowUpDown size={14} />}
            onClick={() => setSortAsc(!sortAsc)}
          >
            {sortAsc ? "Cele mai vechi" : "Cele mai recente"}
          </Button>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon={<CalendarCheck size={32} />}
              title="Nicio rezervare găsită"
              description={
                search
                  ? "Încearcă să cauți cu alți termeni"
                  : "Nu există rezervări încă"
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((res) => {
              const config = statusConfig[res.status] || statusConfig.pending;
              return (
                <Card key={res.$id}>
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-2 h-2  mt-2 shrink-0",
                              res.status === "pending" && "bg-warning",
                              res.status === "confirmed" && "bg-success",
                              res.status === "cancelled" && "bg-error",
                              res.status === "completed" && "bg-text-light"
                            )}
                          />
                          <div>
                            <h3 className="font-semibold text-carbone">
                              {res.name}
                            </h3>
                            <p className="text-sm text-cenere mt-0.5 flex flex-wrap items-center gap-3">
                              <span className="flex items-center gap-1">
                                <CalendarCheck size={13} />
                                {formatDate(res.date)} la {res.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={13} />
                                {res.guests} invitați
                              </span>
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <a
                                href={`tel:${res.phone}`}
                                className="flex items-center gap-1 text-xs text-cenere hover:text-rosso transition-colors"
                              >
                                <Phone size={12} />
                                {res.phone}
                              </a>
                              <a
                                href={`mailto:${res.email}`}
                                className="flex items-center gap-1 text-xs text-cenere hover:text-rosso transition-colors"
                              >
                                <Mail size={12} />
                                {res.email}
                              </a>
                            </div>
                            {res.specialRequests && (
                              <p className="text-sm text-cenere mt-2 italic border-l-2 border-rosso/30 pl-3">
                                {res.specialRequests}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2">
                        <Badge variant={config.variant} size="md">
                          {config.label}
                        </Badge>

                        <div className="flex items-center gap-1">
                          {res.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={statusLoading === res.$id}
                                onClick={() =>
                                  handleStatusChange(res.$id, "confirmed")
                                }
                                title="Confirmă"
                              >
                                <CheckCircle
                                  size={16}
                                  className="text-verde"
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={statusLoading === res.$id}
                                onClick={() =>
                                  handleStatusChange(res.$id, "cancelled")
                                }
                                title="Anulează"
                              >
                                <XCircle size={16} className="text-rosso" />
                              </Button>
                            </>
                          )}
                          {res.status === "confirmed" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={statusLoading === res.$id}
                                onClick={() =>
                                  handleStatusChange(res.$id, "completed")
                                }
                                title="Marchează ca finalizată"
                              >
                                <CheckCircle
                                  size={16}
                                  className="text-verde"
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={statusLoading === res.$id}
                                onClick={() =>
                                  handleStatusChange(res.$id, "cancelled")
                                }
                                title="Anulează"
                              >
                                <XCircle size={16} className="text-rosso" />
                              </Button>
                            </>
                          )}
                          {res.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={statusLoading === res.$id}
                              title="Redeschide"
                            >
                              <CalendarCheck
                                size={16}
                                className="text-rosso"
                              />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingId(res.$id);
                              setDeleteConfirmOpen(true);
                            }}
                            title="Șterge"
                          >
                            <Trash2 size={16} className="text-rosso" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <ConfirmDialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Șterge rezervarea"
          description="Ești sigur că vrei să ștergi această rezervare? Acțiunea este ireversibilă."
          confirmLabel="Șterge"
          confirmVariant="danger"
          loading={deleting}
        />
      </div>
    </>
  );
}
