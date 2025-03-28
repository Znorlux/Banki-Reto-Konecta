import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function ActionButton() {
  return (
    <div className="text-center mt-16">
      <Link
        to="/login"
        className="px-10 py-4 rounded-full text-xl font-bold 
                       bg-gradient-to-r from-blue-600 to-blue-800 
                       text-white shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-1 transition-all 
                       inline-flex items-center group"
      >
        Comienza ahora
        <ChevronRight
          className="ml-2 group-hover:translate-x-1 transition-transform"
          size={24}
        />
      </Link>
    </div>
  );
}

export default ActionButton;
