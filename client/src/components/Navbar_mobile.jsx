import React from "react";
import SearchBar from "./navbar_sidepanel/SearchBar";
import LoginButton from "./navbar/LoginButton";
import { useAuth } from "../contexts/AuthContext";
import Cart from "./navbar/Cart";

const NavbarMobile = () => {
  // 1. Get the loading state
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="px-5 py-2">
      <div className="flex flex-col gap-3 text-[#2C2C2C]">
        <SearchBar />

        {/* 2. Loading State: Show a skeleton/placeholder while checking token */}
        {loading ? (
          <div className="w-full h-10 bg-gray-100 rounded-md animate-pulse"></div>
        ) : (
          // 3. Actual Content (Only renders after loading finishes)
          <>
            {isAuthenticated && (
              <div className="flex items-center justify-between p-2">
                <Cart />
              </div>
            )}
            
            {!isAuthenticated && (
              <div className="mt-2">
                <LoginButton />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NavbarMobile;