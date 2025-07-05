"use client";
import Image from "next/image";
import React, { useRef } from "react";
import img from "../image/pngwing.com.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mainUrl } from "./api";

export default function page() {
  const name = useRef();
  const pass = useRef();
  const router = useRouter();

  const handellLogin = () => {
    const userName = name.current.value;
    const password = pass.current.value;
    const url = `${mainUrl}/auth/login`;
    if (userName == "" || password == "") {
      toast.error("Enter your username and password.");
    } else {
      axios
        .post(url, {
          username: userName,
          password: password,
        })
        .then((res) => {
          Cookies.set("authToken", res.data.token);
          router.push("/home");
          console.log(res);
        })
        .catch(() => {
          toast.error("Password or User Name is Wrong");
        });
    }
  };

  return (
    <div className=" h-full relative w-full">
      {/* Login Section */}
      <section className="w-full flex h-full items-center p-[30px]">
        <div className="w-[50%] max-md:w-full md:pr-[20px] h-full flex flex-col justify-center items-center">
          <div className="flex  items-center flex-col text-[30px] font-serif font-extrabold text-blue-600 w-full mt-[-50px] mb-[50px]">
            <p className="mb-[-15px]">{"{>>}"}</p>
            <p>Electronice</p>
          </div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Welcome back! Please Add Your Acount
          </h2>

          {/* Email Input */}
          <div className="mb-4 w-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              User Name
            </label>
            <input
              type="text"
              id="name"
              ref={name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 focus:bg-blue-500/10"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4 w-full">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              ref={pass}
              placeholder="Your Password..."
              className="mt-1 block w-full text-gray-700 focus:bg-blue-500/10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Login & Sign Up Buttons */}
          <button
            type="submit"
            onClick={handellLogin}
            className="w-[50%] font-bold text-blue-600 py-2 px-4 cursor-pointer rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-[1px] border-blue-600"
          >
            Login
          </button>
          <p className="text-gray-500 mt-4">I don't have an account</p>
          <Link href={"../register"} className="w-[50%]">
            <button
              type="button"
              className="w-full font-bold text-green-600 py-2 px-4 mt-4 cursor-pointer rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border-[1px] border-green-600"
            >
              Register
            </button>
          </Link>
        </div>
        <div className=" w-[50%] h-full flex justify-center items-center max-md:hidden rounded-md  bg-white">
          <Image
            src={img}
            alt="Picture of the author"
            className="w-[500px] h-[500px]"
          />
        </div>4
        <ToastContainer />
      </section>
    </div>
  );
}
