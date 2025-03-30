"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LogOut() {
  const router = useRouter();

  const handellLogOut = () => {
    Cookies.remove("authToken");
    router.push("../loginPage");
  };

  return (
    <div
      onClick={handellLogOut}
      className="p-2 bg-white w-[100px] border-1 border-white rounded-sm text-black outline-1 hover:text-white hover:font-bold hover:rounded-none outline-red-600 hover:bg-red-600 transition-all cursor-pointer absolute top-[100px] right-[7%] text-center shadow-md shadow-gray-500"
    >
      Log out
    </div>
  );
}
