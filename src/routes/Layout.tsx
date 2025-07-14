import Header from "@/components/custom/layout/Header";
import { Toaster } from "sonner";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col bg-[#fffdfb]">
        <Outlet />
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}
