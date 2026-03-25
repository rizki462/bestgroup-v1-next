import { constructMetadata } from "@/components/common/metadata";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "404 - Page not found",
  description: "Halaman yang Anda cari tidak ditemukan.",
});

export default async function NotFound() {
  // Ambil cookie store
  const cookieStore = await cookies();

  // Cek cookie 'user_profile' di cookie store
  const userProfile = cookieStore.get("user_profile");

  // Jika TIDAK ADA cookie user_profile, redirect ke login
  if (!userProfile) {
    redirect("/login");
  }

  // Jika ADA, tampilkan UI 404
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="animate-in fade-in zoom-in duration-700">
        <Image
          src="/images/404.png"
          alt="404 Not Found"
          width={320}
          height={320}
          className="mx-auto drop-shadow-xl"
        />
      </div>

      <div className="mt-10 space-y-4">
        <div className="inline-block rounded-full bg-teal-50 px-4 py-1 text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] border border-teal-100">
          System Error: 404
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-500 md:text-base">
          Halaman yang kamu cari tidak ditemukan. Silahkan coba lagi.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="inline-flex items-center mt-5 justify-center rounded-xl bg-teal-500 px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition-all hover:bg-teal-600 hover:scale-105 active:scale-95"
      >
        KEMBALI KE DASHBOARD
      </Link>

      {/* Branding Kecil di Bawah */}
      <div className="mt-16 flex items-center gap-2 opacity-30">
        <div className="h-px w-8 bg-slate-400"></div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Best Group IT Support
        </span>
        <div className="h-px w-8 bg-slate-400"></div>
      </div>
    </div>
  );
}
