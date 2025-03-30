import React from "react";
import { Menu, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <UserCircle className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
