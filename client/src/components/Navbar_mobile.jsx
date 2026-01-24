import React from "react";
import SearchBar from "./navbar_sidepanel/SearchBar";
import LoginButton from "./navbar/LoginButton";
import { useAuth } from "../contexts/AuthContext";
import Cart from "./navbar/Cart";

const NavbarMobile = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="px-5 py-2">
      <div className="flex flex-col gap-3 text-[#2C2C2C]">
        <SearchBar />
        {isAuthenticated && (
          <div className="flex items-center justify-between p-2">
            <Cart />
          </div>
        )}
        {!isAuthenticated && <LoginButton />}
      </div>
    </div>
  );
};

export default NavbarMobile;
