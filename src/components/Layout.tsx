
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CalendarDays, BarChart3, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: <CheckCircle className="h-6 w-6" />, label: "Today" },
    { path: "/calendar", icon: <CalendarDays className="h-6 w-6" />, label: "Calendar" },
    { path: "/insights", icon: <BarChart3 className="h-6 w-6" />, label: "Insights" },
    { path: "/achievements", icon: <Award className="h-6 w-6" />, label: "Badges" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-1.5">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Streak Spark
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 pb-24">
        {children}
      </main>

      <nav className="bg-white fixed bottom-0 left-0 right-0 border-t z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-3 px-5 text-sm",
                  location.pathname === item.path
                    ? "text-primary font-medium"
                    : "text-gray-500"
                )}
              >
                <div className={cn(
                  "p-1 rounded-full transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10"
                    : "bg-transparent"
                )}>
                  {item.icon}
                </div>
                <span className="mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
