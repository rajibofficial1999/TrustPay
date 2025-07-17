import { AppSidebar } from "@/components/app-sidebar";
import CustomSidebarButton from "@/components/custom-sidebar-button";
import AdminNavbarDropdown from "@/components/admin-navbar-dropdown";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-x-hidden">
        <nav className="flex items-center justify-between w-full border-b h-[60px] px-2">
          <div>
            <CustomSidebarButton />
          </div>
          <div>
            <AdminNavbarDropdown user={session?.user || null} />
          </div>
        </nav>
        <div className="p-[20px]">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default layout;
