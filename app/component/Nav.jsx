"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LogOut from "./LogOut";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function Nav() {
  const token = Cookies.get("authToken");
  const router = useRouter();
  const [out, setOut] = useState(false);

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
      } else {
        router.push("/technician");
      }
    } else {
      toast.error("Please Add Your Acount");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-blue-600 shadow-2xl text-white p-4 rounded-lg absolute top-[30px] w-[90%] left-[50%] translate-x-[-50%]">
        <nav>
          <ul className="flex justify-around">
            <li
              onClick={() => handellGo(0)}
              className="hover:text-gray-200 cursor-pointer"
            >
              Home
            </li>
            <li
              onClick={() => handellGo(1)}
              className="hover:text-gray-200 cursor-pointer"
            >
              Accessories
            </li>
            <li
              onClick={() => handellGo(2)}
              className="hover:text-gray-200 cursor-pointer"
            >
              Parts
            </li>
            <li
              onClick={() => handellGo(3)}
              className="hover:text-gray-200 cursor-pointer"
            >
              Technician
            </li>
          </ul>
        </nav>
      </header>
      {out ? <LogOut /> : console.log("no")}
      <ToastContainer />
    </div>
  );
}
