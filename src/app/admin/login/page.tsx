"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginAdmin } from "@/lib/actions";
import { loginSchema, type LoginFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wordmark } from "@/components/wordmark";
import { Mail, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    try {
      const result = await loginAdmin(data);
      if (result.success) {
        toast.success("Bun venit înapoi!");
        router.push("/admin");
      } else {
        setError(result.error || "Email sau parolă incorecte");
      }
    } catch {
      setError("A apărut o eroare. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-carbone p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Wordmark variant="light" className="text-4xl md:text-5xl" />
<p className="text-rosso text-sm font-bold uppercase tracking-wider mt-2">
            panou de administrare
            </p>
        </div>

        <div className="border-3 border-black bg-white p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@saresipiper.md"
              error={errors.email?.message}
              icon={<Mail size={16} />}
              {...register("email")}
            />

            <Input
              label="Parolă"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              icon={<Lock size={16} />}
              {...register("password")}
            />

            {error && (
              <div className="border-3 border-rosso bg-rosso/10 px-4 py-3 text-sm text-rosso">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              {loading ? "Se autentifică..." : "Autentificare"}
            </Button>
          </form>
        </div>

        <p className="text-center text-bianco/30 text-xs mt-6">
          Sare și Piper · Calea Orheiului 21, Porumbeni
        </p>
      </div>
    </div>
  );
}
