import { DarkModeToggle } from "@/components/common/darkmode-toogle";
import { Computer } from "lucide-react";
import Image from "next/image";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex items-center self-center font-medium">
          <div className="flex items-center justify-center">
            <Image
              src="/images/bg.png"
              alt="logo"
              width={70}
              height={70}
            />
          </div>
          <span className="text-2xl font-semibold">Best Group</span>
        </div>
        {children}
      </div>
    </div>
  );
};
