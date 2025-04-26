"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LogOut from "./LogOut";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMobileScreen,
  faPerson,
  faScrewdriver,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
  const token = Cookies.get("authToken");
  const router = useRouter();
  const [out, setOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setOut(token ? true : false);
  });

  const handellGo = (e) => {
    if (token) {
      if (e == 0) {
        router.push("/");
      } else if (e == 1) {
        router.push("/accessories");
      } else if (e == 2) {
        router.push("/parts");
      } else if (e == 3) {
        router.push("/technician");
      } else {
        router.push("/repair");
      }
    } else {
      toast.error("Please Add Your Acount");
    }
  };

  const open = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Header */}
      <header className="md:p-4 rounded-lg absolute justify-between max-md:flex items-center max-md:left-1/2 max-md:translate-x-[-50%] max-md:w-[90%] top-[30px] left-[30px] max-md:h-[80px] h-[93vh] bg-gray-50 z-100 ">
        <div
          onClick={open}
          className="flex max-md:hidden cursor-pointer items-center gap-[10px] text-[18px] font-serif font-extrabold text-blue-600 w-full pl-[10px]"
        >
          <p>{"{>>}"}</p>
          <p className={`${isOpen ? "block" : "hidden"}`}>Electronice</p>
        </div>
        <nav>
          <ul className="flex md:flex-col">
            <li
              onClick={() => handellGo(0)}
              className="hover:bg-gray-200 p-[10px] rounded-md cursor-pointer hover:scale-[108%] transition-all flex items-center mt-[10px] gap-[20px]"
            >
              <FontAwesomeIcon icon={faHouse} className="w-[40px] " />
              <p className={`${isOpen ? "block" : "hidden"}`}>Home</p>
            </li>
            <li
              onClick={() => handellGo(1)}
              className="hover:bg-gray-200 p-[10px] rounded-md cursor-pointer hover:scale-[108%] transition-all flex items-center mt-[10px] gap-[20px]"
            >
              <FontAwesomeIcon icon={faMobileScreen} className="w-[40px] " />
              <p className={`${isOpen ? "block" : "hidden"}`}>Accessories</p>
            </li>
            <li
              onClick={() => handellGo(2)}
              className="hover:bg-gray-200 p-[10px] rounded-md cursor-pointer hover:scale-[108%] transition-all flex items-center mt-[10px] gap-[20px]"
            >
              <FontAwesomeIcon icon={faScrewdriver} className="w-[40px] " />
              <p className={`${isOpen ? "block" : "hidden"}`}>Parts</p>
            </li>
            <li
              onClick={() => handellGo(3)}
              className="hover:bg-gray-200 p-[10px] rounded-md cursor-pointer hover:scale-[108%] transition-all flex items-center mt-[10px] gap-[20px]"
            >
              <FontAwesomeIcon icon={faPerson} className="w-[40px] " />
              <p className={`${isOpen ? "block" : "hidden"}`}>Technician</p>
            </li>
            <li
              onClick={() => handellGo(4)}
              className="hover:bg-gray-200 p-[10px] rounded-md cursor-pointer hover:scale-[108%] transition-all flex items-center mt-[10px] gap-[20px]"
            >
              <FontAwesomeIcon
                icon={faScrewdriverWrench}
                className="w-[40px] "
              />
              <p className={`${isOpen ? "block" : "hidden"}`}>Repair</p>
            </li>
          </ul>
        </nav>
        {out ? <LogOut open={isOpen} /> : console.log("no")}
      </header>
      <ToastContainer />
    </div>
  );
}
