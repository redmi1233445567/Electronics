"use client";
import Image from "next/image";
import React, { useRef } from "react";
import img from "../../image/pngwing.com.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import Nav from "../component/Nav";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function page() {
  const name = useRef();
  const pass = useRef();
  const router = useRouter();

  const handellRegister = () => {
    const userName = name.current.value;
    const password = pass.current.value;
    const url =
      "https://electronics-backend-production.up.railway.app/api/auth/register";
    if (userName == "" || password == "") {
      toast.error("Enter your username and password.");
    } else if (password.length < 6) {
      toast.error("The password must be at least six characters long.");
    } else {
      axios
        .post(url, {
          username: userName,
          password: password,
        })
        .then((res) => {
          Cookies.set("authToken", res.data.token);
          router.push("/");
        })
        .catch(() => {
          toast.error("The name already exists.");
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
            Create a new account
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

          {/*Sign Up Buttons */}
          <button
            type="button"
            onClick={handellRegister}
            className="w-[50%] font-bold text-green-600 py-2 px-4 mt-4 cursor-pointer rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border-[1px] border-green-600"
          >
            Register
          </button>
          <p className="text-gray-500 my-4">I already have an account</p>
          <Link href={"../loginPage"} className="w-[50%]">
            <button
              type="submit"
              className="w-full font-bold text-blue-600 py-2 px-4 cursor-pointer rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-[1px] border-blue-600"
            >
              Login
            </button>
          </Link>
        </div>
        <div className="w-[50%] h-full flex justify-center items-center max-md:hidden rounded-md  bg-white">
          <Image
            src={img}
            alt="Picture of the author"
            className="w-[500px] h-[500px]"
          />
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
