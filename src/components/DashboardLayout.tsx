import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 md:w-16"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between border-b">
            <h1
              className={`font-bold text-xl text-primary ${
                sidebarOpen ? "block" : "hidden md:block"
              }`}
            >
              {sidebarOpen ? "Department Flow" : "DF"}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:flex hidden"
            >
              <Menu size={18} />
            </Button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <a
                  href="/dashboard"
                  className="block p-2 rounded-md hover:bg-secondary text-foreground"
                >
                  {sidebarOpen ? "Departments" : ""}
                </a>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={`w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 ${
                !sidebarOpen && "justify-center"
              }`}
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" />
              {sidebarOpen && "Logout"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-background">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
          <h1 className="font-bold text-lg text-primary">Department Flow</h1>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={18} />
            </Button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-64 h-full bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center justify-between border-b">
                <h1 className="font-bold text-xl text-primary">
                  Department Flow
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Menu size={18} />
                </Button>
              </div>

              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/dashboard"
                      className="block p-2 rounded-md hover:bg-secondary text-foreground"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Departments
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
