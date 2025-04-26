"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function LogOut({ open }) {
  const router = useRouter();

  const handellLogOut = () => {
    Cookies.remove("authToken");
    router.push("../loginPage");
  };

  return (
    <div
      onClick={handellLogOut}
      className="hover:text-red-700 p-[10px] rounded-md cursor-pointer hover:scale-[108%] md:absolute bottom-0  transition-all flex items-center  gap-[20px]"
    >
      <FontAwesomeIcon
        icon={faRightFromBracket}
        className="max-md:translate-y-[5px]"
      />
      <p className={`${open ? "block" : "hidden"} text-red-600`}>Log out</p>
    </div>
  );
}
