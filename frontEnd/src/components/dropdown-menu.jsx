import React, { useState, useRef } from "react";

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block">
      <div onClick={toggleDropdown} className="cursor-pointer">
        {children[0]} {/* Trigger element */}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-50"
        >
          {children.slice(1)} {/* Dropdown items */}
        </div>
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({ children }) => <>{children}</>;

const DropdownMenuContent = ({ children }) => <>{children}</>;

const DropdownMenuItem = ({ children, onClick }) => (
  <div
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={onClick}
  >
    {children}
  </div>
);

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
