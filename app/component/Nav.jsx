"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LogOut from "./LogOut";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMobileScreen,
  faPerson,
  faScrewdriver,
  faScrewdriverWrench,
  faBars,
  faAngleDoubleRight,
  faAngleDoubleLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
  const token = Cookies.get("authToken");
  const router = useRouter();
  const [out, setOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    setOut(!!token);
  }, [token]);

  const handellGo = (index) => {
    if (!token) return toast.error("Please Add Your Account");
    const routes = [
      "/home",
      "/accessories",
      "/parts",
      "/technician",
      "/repair",
    ];
    router.push(routes[index]);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsSmall(!isSmall);
  };

  const icons = [
    faHouse,
    faMobileScreen,
    faScrewdriver,
    faPerson,
    faScrewdriverWrench,
  ];
  const labels = ["Home", "Accessories", "Parts", "Technician", "Repair"];

  return (
    <>
      {/* Sidebar Toggle Button */}
      <div className=" fixed top-4 left-4 z-50">
        <button
          onClick={toggleMenu}
          className="bg-blue-600 text-white p-2 rounded-md shadow hover:bg-blue-700"
        >
          <FontAwesomeIcon
            icon={isOpen ? faAngleDoubleLeft : faAngleDoubleRight}
          />
        </button>
      </div>

      {/* Mini Sidebar */}
      <aside
        className={`
          top-0 left-0 h-full bg-white shadow-lg z-40 flex flex-col 
          transition-all duration-[3000s] ease-in-out
          ${isOpen ? "w-60" : "w-[72px]"}
          ${isSmall ? "fixed" : " hidden"} 
        `}
      >
        <div className="flex items-center justify-center h-[72px] border-b border-gray-200">
          <span
            className={`text-blue-600 font-bold text-lg transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Electronice
          </span>
        </div>

        <nav className="flex-1 p-2 space-y-2">
          {icons.map((icon, idx) => (
            <div
              key={idx}
              onClick={() => handellGo(idx)}
              className="group flex items-center gap-3 cursor-pointer hover:bg-blue-100 p-2 rounded-md transition-all text-blue-600 relative"
            >
              <FontAwesomeIcon icon={icon} className="text-lg" />
              <span
                className={`text-sm font-medium transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0 hidden"
                }`}
              >
                {labels[idx]}
              </span>
              {!isOpen && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {labels[idx]}
                </span>
              )}
            </div>
          ))}
        </nav>

        {out && (
          <div className={`mt-auto p-2 ${isOpen ? "" : "flex justify-center"}`}>
            <LogOut open={isOpen} />
          </div>
        )}
      </aside>

      <ToastContainer />
    </>
  );
}
