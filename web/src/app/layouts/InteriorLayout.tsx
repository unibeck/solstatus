import { Header } from "../components/Header";
import { Toaster } from "@/app/components/ui/sonner";

const InteriorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page-wrapper">
      <main className="page bg-white">
        <Header />
        {children}
        <Toaster position="top-right" richColors />
      </main>
    </div>
  );
};

export { InteriorLayout };
