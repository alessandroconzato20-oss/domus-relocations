/**
 * DOMUS Meridian — Activate Corporate Account (/corporate/activate)
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Compass } from "lucide-react";

export default function CorporateActivate() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState<{ companyName: string } | null>(null);

  const activate = trpc.corporate.activateCode.useMutation({
    onSuccess: (data) => {
      setSuccess({ companyName: data.companyName });
      setTimeout(() => navigate("/corporate/dashboard"), 2000);
    },
    onError: (e) => toast.error(e.message || "Invalid or expired code."),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-[#E8DFD0] bg-white px-8 py-4 flex items-center justify-between">
        <Link href="/corporate">
          <span className="font-cormorant text-xl text-stone-800 tracking-wide cursor-pointer">
            DOMUS <span className="text-[#B8963E]">Meridian</span>
          </span>
        </Link>
        <Link href="/" className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 transition-colors">
          Private Clients →
        </Link>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="w-14 h-14 border border-[#D4AF6A] flex items-center justify-center mx-auto mb-6">
              <Compass size={24} className="text-[#B8963E]" />
            </div>
            <h1 className="font-cormorant text-3xl text-stone-800 mb-2">Activate Your Account</h1>
            <p className="text-stone-500 text-sm leading-relaxed">
              Enter the 6-character access code provided by the DOMUS team to activate your DOMUS Meridian corporate account.
            </p>
          </div>

          {success ? (
            <div className="border border-emerald-200 bg-emerald-50 p-6 text-center">
              <p className="text-emerald-700 font-medium mb-1">Account activated for {success.companyName}</p>
              <p className="text-emerald-600 text-sm">Redirecting to your dashboard…</p>
            </div>
          ) : !user ? (
            <div className="border border-[#E8DFD0] bg-white p-8 text-center">
              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                You need to be signed in to activate your corporate account. Please log in or create a free account first.
              </p>
              <a href={getLoginUrl()}>
                <Button className="w-full bg-[#B8963E] hover:bg-[#9A7D33] text-white text-xs uppercase tracking-widest h-11 rounded-none">
                  Sign In / Create Account
                </Button>
              </a>
            </div>
          ) : (
            <div className="border border-[#E8DFD0] bg-white p-8">
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">Access Code</label>
                <Input
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
                  placeholder="XXXXXX"
                  maxLength={6}
                  className="border-[#D4C5B0] focus:border-[#B8963E] bg-white text-center text-2xl font-mono tracking-[0.5em] h-14 rounded-none uppercase"
                />
              </div>
              <Button
                onClick={() => { if (code.length === 6) activate.mutate({ code }); }}
                disabled={code.length !== 6 || activate.isPending}
                className="w-full bg-[#B8963E] hover:bg-[#9A7D33] text-white text-xs uppercase tracking-widest h-11 rounded-none transition-colors"
              >
                {activate.isPending ? "Activating…" : "Activate Account →"}
              </Button>
              <p className="text-xs text-stone-400 text-center mt-4">
                Don't have a code?{" "}
                <Link href="/corporate" className="text-[#B8963E] hover:underline">Request access here.</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
