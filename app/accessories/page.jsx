"use client";
import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import img from "../../image/pngwing.com.png";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { checkTokenExpiration } from "../fun/tokenAccess";

export default function page() {
  const token = Cookies.get("authToken");
  const [isOpen, setIsOpen] = useState(false);
  const [isName, setisName] = useState(true);
  const [isQ, setIsQ] = useState(false);
  const [isPrice, setisPrice] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [minQ, setMinQ] = useState("");
  const [maxQ, setMaxQ] = useState("");
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [nameS, setnameS] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    showData();
    checkTokenExpiration();
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url =
      "https://electronics-backend-production.up.railway.app/api/accessories";

    axios
      .post(
        url,
        {
          name: input1,
          quantity: input2,
          price: input3,
        },
        config
      )
      .then(() => {
        showData();
        togglePopup();
        scroll({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Added Error");
      });
  };

  const showData = () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url = `https://electronics-backend-production.up.railway.app/api/accessories/filter/name`;

    axios
      .get(url, config)
      .then((res) => {
        console.log(res.data);
        setList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handellFilter = (e) => {
    if (e == "name") {
      setisName(true);
      setIsQ(false);
      setisPrice(false);
    } else if (e == "quantity") {
      setisName(false);
      setIsQ(true);
      setisPrice(false);
    } else if (e == "price") {
      setisName(false);
      setIsQ(false);
      setisPrice(true);
    }
  };

  const handleSubmitSearch = (e) => {
    if (e == 0) {
      console.log(nameS);
      if (nameS == "") {
        toast.error("enter name");
      } else {
        const token = Cookies.get("authToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const urlS = `https://electronics-backend-production.up.railway.app/api/accessories/filter/name?name=${nameS}`;

        axios
          .get(urlS, config)
          .then((res) => {
            console.log(res.data);
            setList(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else if (e == 1) {
      console.log(minQ, maxQ);
      if (maxQ == "" || minQ > maxQ || minQ < 0 || maxQ == 0) {
        toast.error("Out of ring");
      } else {
        const token = Cookies.get("authToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const urlS = `https://electronics-backend-production.up.railway.app/api/accessories/filter/quantity?minQuantity=${minQ}&maxQuantity=${maxQ}`;

        axios
          .get(urlS, config)
          .then((res) => {
            console.log(res.data);
            setList(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      console.log(minP, maxP);
      if (maxP == "" || minP > maxP || minP < 0 || maxP == 0) {
        toast.error("Out of ring");
      } else {
        const token = Cookies.get("authToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const urlS = `https://electronics-backend-production.up.railway.app/api/accessories/filter/price?minPrice=${minP}&maxPrice=${maxP}`;

        axios
          .get(urlS, config)
          .then((res) => {
            console.log(res.data);
            setList(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  return (
    <div className=" w-full pt-[150px] pb-[50px]">
      <Nav />
      <h1 className="text-[32px] text-center mb-5 font-bold text-blue-600 w-fit px-[20px] py-[10px] border-[1px] border-blue-600  mx-auto bg-white rounded-md">
        Accessories
      </h1>
      <div className="flex px-[308px] mb-[30px] gap-1 items-center justify-center text-[20px] max-sm:flex-wrap max-lg:px-[30px]">
        <p>Filter:</p>
        <select
          name="name"
          id="name-select"
          className="bg-blue-600 rounded-md text-white focus:outline-none py-1"
          onClick={(e) => handellFilter(e.target.value)}
        >
          <option value="name">name</option>
          <option value="quantity">quantity</option>
          <option value="price">price</option>
        </select>
        <div>
          {isName ? (
            <div className="flex gap-[10px]">
              <input
                type="text"
                value={nameS}
                onChange={(e) => setnameS(e.target.value)}
                className=" block w-[200px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div
                onClick={() => handleSubmitSearch(0)}
                className="p-1 bg-blue-600 text-white font-bold cursor-pointer rounded-md hover:bg-blue-700 transition-all"
              >
                Search
              </div>
            </div>
          ) : (
            console.log()
          )}
          {isQ ? (
            <div className="flex gap-[10px]">
              <input
                type="number"
                placeholder="Min"
                value={minQ}
                onChange={(e) => setMinQ(e.target.value)}
                className=" block w-[100px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxQ}
                onChange={(e) => setMaxQ(e.target.value)}
                className=" block w-[100px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div
                onClick={() => handleSubmitSearch(1)}
                className="p-1 bg-blue-600 text-white font-bold cursor-pointer rounded-md hover:bg-blue-700 transition-all"
              >
                Search
              </div>
            </div>
          ) : (
            console.log()
          )}
          {isPrice ? (
            <div className="flex gap-[8px]">
              <input
                type="number"
                placeholder="MinP"
                value={minP}
                onChange={(e) => setMinP(e.target.value)}
                className=" block w-[100px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="MaxP"
                value={maxP}
                onChange={(e) => setMaxP(e.target.value)}
                className=" block w-[100px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div
                onClick={() => handleSubmitSearch(2)}
                className="p-1 bg-blue-600 text-white font-bold cursor-pointer rounded-md hover:bg-blue-700 transition-all"
              >
                Search
              </div>
            </div>
          ) : (
            console.log()
          )}
        </div>
        <div
          onClick={showData}
          className="px-1 bg-red-600 text-white font-bold cursor-pointer rounded-md hover:bg-red-700 transition-all"
        >
          X
        </div>
      </div>
      <div className="w-full lg:px-[300px]  flex justify-center items-center flex-wrap gap-5 font-sans h-full">
        {list.length > 0 ? (
          list.map((ser) => {
            return (
              <div
                key={ser._id}
                className="w-[200px] relative bg-white hover:-translate-y-1  rounded-md hover:shadow-2xl transition-all shadow overflow-hidden group cursor-pointer"
              >
                <div className=" hidden group-active:flex justify-center items-center absolute bg-blue-600/50 top-0 left-0 w-full h-full"></div>
                <div className=" relative">
                  <Image src={img} alt="Picture of the author" />
                </div>
                <div className="px-[10px] pt-[10px]">
                  <p className="text-[24px] text-blue-600 text-center font-bold">
                    {ser.name}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-green-600">{ser.quantity}/Q</p>
                    <p className="text-red-600">{ser.price}$</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-[24px] text-blue-600 text-center">
            No accessories...
          </p>
        )}
      </div>
      <div
        onClick={togglePopup}
        className="font-bold max-md:right-[30px] max-md:bottom-[30px] max-md:w-[50px] max-md:h-[50px] max-md:text-[50px] shadow-blue-600 shadow-2xl hover:scale-[110%] transition-all text-[70px] text-white bg-blue-600 w-[80px] h-[80px] rounded-full flex justify-center items-center fixed cursor-pointer right-[100px] bottom-[100px]"
      >
        +
      </div>
      <div>
        <div>
          {/* البوب أب */}
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-sm:w-[300px]">
                <h2 className="text-xl font-bold mb-4">Add a new accessory</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/*الاسم*/}
                  <label className="block">
                    <span className="text-gray-700">Name:</span>
                    <input
                      type="text"
                      value={input1}
                      onChange={(e) => setInput1(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>

                  {/* الكمية */}
                  <label className="block">
                    <span className="text-gray-700">quantity:</span>
                    <input
                      type="number"
                      value={input2}
                      onChange={(e) => setInput2(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>

                  {/* السعر */}
                  <label className="block">
                    <span className="text-gray-700">price:</span>
                    <input
                      type="number"
                      value={input3}
                      onChange={(e) => setInput3(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>

                  {/* أزرار الإرسال والإغلاق */}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={togglePopup}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
