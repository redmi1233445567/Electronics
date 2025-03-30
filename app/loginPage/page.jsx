"use client";
import Image from "next/image";
import React, { useRef } from "react";
import img from "../../image/pngwing.com.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import Nav from "../component/Nav";
import { useRouter } from "next/navigation";

export default function page() {
  const name = useRef();
  const pass = useRef();
  const router = useRouter();

  const handellLogin = () => {
    const userName = name.current.value;
    const password = pass.current.value;
    const url =
      "https://electronics-backend-production.up.railway.app/api/auth/login";
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
          router.push("/");
          console.log(res);
        })
        .catch(() => {
          toast.error("Password or User Name is Wrong");
        });
    }
  };

  return (
    <div className=" h-full relative w-full">
      <Nav />

      {/* Login Section */}
      <section className="w-full flex h-full items-center">
        <div className="bg-white p-6 w-[50%] max-md:w-full h-full flex flex-col justify-center items-center">
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
            className="w-full bg-blue-600 text-white py-2 px-4 cursor-pointer rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md shadow-black"
          >
            Login
          </button>
          <p className="text-gray-500 mt-4">I don't have an account</p>
          <Link href={"../register"} className="w-full">
            <button
              type="button"
              className="w-full bg-green-500 text-white py-2 px-4 mt-4 cursor-pointer rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md shadow-black"
            >
              Register
            </button>
          </Link>
        </div>
        <div className=" w-[50%] h-full flex justify-center items-center max-md:hidden">
          <Image
            src={img}
            alt="Picture of the author"
            className="w-[500px] h-[500px]"
          />
        </div>
        <ToastContainer />
      </section>
    </div>
  );
}
