import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-muted flex justify-center items-center h-screen flex-col space-y-3">
      <h1 className="text-3xl font-semibold">Selamat Datang Rizki Kurnia</h1>
      <Link href="/dashboard">
        <Button className="bg-teal-500 text-white cursor-pointer">
          Access Dashboard
        </Button>
      </Link>
    </div>
  );
}
