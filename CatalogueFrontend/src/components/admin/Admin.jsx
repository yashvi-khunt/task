import React, { useState } from "react";
import { NavListComponent } from "./index";
import { Outlet } from "react-router-dom";
import { IoPersonCircleOutline, IoMenuOutline } from "react-icons/io5";
import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const navItems = [
  {
    name: "Product",
    slug: "/admin/product",
  },
  {
    name: "Tag",
    slug: "/admin/tag",
  },
];

const toastMixin = Swal.mixin({
  toast: true,
  icon: "success",
  title: "General Title",
  animation: false,
  position: "top-right",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function Admin() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    toastMixin.fire({
      animation: false,
      title: "Logged out Successfully",
    });
  };

  return (
    <>
      <div className=" flex border-b flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
        <div className="hidden lg:flex flex-col  w-64 bg-white  border-r">
          <div className="flex items-center justify-center h-14 border-b">
            <div>Product Catalogue</div>
          </div>
          <div className="overflow-y-auto overflow-x-hidden flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              {navItems.map((item) => (
                <NavListComponent
                  key={item.name}
                  name={item.name}
                  to={item.slug}
                />
              ))}
              <li>
                <button
                  className="relative w-full flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6"
                  onClick={handleLogout}
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <IoPersonCircleOutline />
                  </span>

                  <span className="ml-2 text-sm tracking-wide truncate">
                    Logout
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Admin;
