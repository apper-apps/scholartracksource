import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onMobileClose={handleMobileMenuClose}
      />
      
      <div className="lg:ml-64">
        <Header onMobileMenuClick={handleMobileMenuToggle} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;