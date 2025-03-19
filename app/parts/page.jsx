"use client";
import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import img from "../../image/pngwing.com.png";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function page() {
  const token = Cookies.get("authToken");
  const [isOpen, setIsOpen] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [nameS, setnameS] = useState("");
  const [id, setId] = useState(0);
  const [update, setUpdate] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    showData();
  }, []);

  const togglePopup = () => {
    setUpdate(false);
    setIsOpen(!isOpen);
  };

  const togellUpdate = (nameE, id) => {
    console.log(nameE);
    setUpdate(!update);
    setIsOpen(!isOpen);
    setId(id);
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const urlS = `https://electronics-backend-production.up.railway.app/api/parts/filter?name=${nameE}`;

    axios
      .get(urlS, config)
      .then((res) => {
        console.log(res.data);
        setInput1(res.data[0].name);
        setInput2(res.data[0].quantity);
        setInput3(res.data[0].purchasePrice);
        setInput4(res.data[0].sellingPrice);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (!update) {
      const url =
        "https://electronics-backend-production.up.railway.app/api/parts";

      axios
        .post(
          url,
          {
            name: input1,
            quantity: input2,
            purchasePrice: input3,
            sellingPrice: input4,
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
    } else {
      console.log("up");
      const url = `https://electronics-backend-production.up.railway.app/api/parts/${id}`;

      axios
        .put(
          url,
          {
            name: input1,
            quantity: input2,
            purchasePrice: input3,
            sellingPrice: input4,
          },
          config
        )
        .then(() => {
          showData();
          togglePopup();
        })
        .catch((error) => {
          console.log(error);
          toast.error(error);
        });
    }
  };

  const handellDelete = (id) => {
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url = `https://electronics-backend-production.up.railway.app/api/parts/${id}`;

    axios
      .delete(url, config)
      .then((res) => {
        showData();
        toast(res);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  };

  const showData = () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url = `https://electronics-backend-production.up.railway.app/api/parts/filter`;

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

  const handleSubmitSearch = () => {
    if (nameS == "") {
      toast.error("enter name");
    } else {
      const token = Cookies.get("authToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const urlS = `https://electronics-backend-production.up.railway.app/api/parts/filter?name=${nameS}`;

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
  };

  const handellHover = (id) => {
    const test = document.querySelector(`.${id}`);
    if (test.style.display == "flex") {
      test.style.display = "none";
    } else {
      test.style.display = "flex";
    }
  };

  return (
    <div className=" w-full pt-[150px] pb-[50px]">
      <Nav />
      <h1 className="text-[32px] text-center mb-5 font-bold text-blue-600 w-fit px-[20px] py-[10px] border-[1px] border-blue-600  mx-auto bg-white rounded-md">
        Parts
      </h1>
      <div className="flex px-[308px] mb-[30px] gap-2 justify-center items-center text-[20px] max-sm:flex-wrap max-lg:px-[30px]">
        <div className="flex gap-[10px]">
          <input
            type="text"
            value={nameS}
            onChange={(e) => setnameS(e.target.value)}
            className=" block w-[200px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div
            onClick={handleSubmitSearch}
            className="p-1 bg-blue-600 text-white font-bold cursor-pointer rounded-md hover:bg-blue-700 transition-all"
          >
            Search
          </div>
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
                <div
                  className={`hidden group-hover:flex ${ser.name} justify-center flex-col items-center absolute bg-blue-600/95 top-0 left-0 w-full h-full`}
                >
                  <div className="flex justify-around font-bold w-full mb-[20px]">
                    <div
                      onClick={() => togellUpdate(ser.name, ser._id)}
                      className="bg-orange-600 text-white cursor-pointer hover:bg-orange-700 py-[8px] px-[10px] transition-all rounded-md"
                    >
                      Update
                    </div>
                    <div
                      onClick={() => handellDelete(ser._id)}
                      className="bg-red-600 text-white cursor-pointer hover:bg-red-700 py-[8px] px-[10px] transition-all rounded-md"
                    >
                      Delete
                    </div>
                  </div>
                  <div className="flex justify-around font-bold w-full">
                    <div className="text-center">
                      <p className="text-white font-bold">purch</p>
                      <p className="text-red-600 text-[24px]">
                        {ser.purchasePrice}$
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold">sell</p>
                      <p className="text-green-900 text-[24px]">
                        {ser.sellingPrice}$
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" ">
                  <Image src={img} alt="Picture of the author" />
                </div>
                <div className="px-[10px] pt-[10px]">
                  <p className="text-[24px] text-blue-600 text-center font-bold">
                    {ser.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-green-600">{ser.quantity}/Q</p>
                    <p
                      onClick={() => handellHover(ser.name)}
                      className="w-[30px] relative h-[30px] hidden max-sm:flex -translate-y-1 bg-blue-400 rounded-full text-white justify-center items-center font-bold"
                    >
                      +
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-[24px] text-blue-600 text-center">No Parts...</p>
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
                {update ? (
                  <h2 className="text-xl font-bold mb-4">Update</h2>
                ) : (
                  <h2 className="text-xl font-bold mb-4">
                    Add a new accessory
                  </h2>
                )}
                <div className="space-y-4">
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
                    <span className="text-gray-700">purchasePrice:</span>
                    <input
                      type="number"
                      value={input3}
                      onChange={(e) => setInput3(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-gray-700">sellingPrice:</span>
                    <input
                      type="number"
                      value={input4}
                      onChange={(e) => setInput4(e.target.value)}
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
                      type="button"
                      onClick={handleSubmit}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
