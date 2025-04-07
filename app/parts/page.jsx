"use client";
import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import img from "../../image/pngwing.com.png";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkTokenExpiration } from "../fun/tokenAccess";

export default function page() {
  const token = Cookies.get("authToken");
  const [isOpen, setIsOpen] = useState(false);
  const [isName, setisName] = useState(false);
  const [isQ, setIsQ] = useState(false);
  const [isPrice, setisPrice] = useState(false);
  const [minQ, setMinQ] = useState(0);
  const [maxQ, setMaxQ] = useState("");
  const [minP, setMinP] = useState(0);
  const [maxP, setMaxP] = useState("");
  const [nameS, setnameS] = useState("");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [id, setId] = useState(0);
  const [update, setUpdate] = useState(false);
  const [list, setList] = useState([]);
  const [listFilter, setListFilter] = useState([]);

  useEffect(() => {
    checkTokenExpiration();
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
    const urlS = `https://electronics-backend-production.up.railway.app/api/parts`;

    axios
      .get(urlS, config)
      .then((res) => {
        console.log(res.data);
        let test = res.data.data.filter((item) => item.name == nameE);
        console.log(test)
        setInput1(test[0].name);
        setInput2(test[0].quantity);
        setInput3(test[0].purchasePrice);
        setInput4(test[0].sellingPrice);
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
    const url = `https://electronics-backend-production.up.railway.app/api/parts`;

    axios
      .get(url, config)
      .then((res) => {
        setList(res.data);
        console.log(res.data.data);
        setListFilter(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handellHover = (id) => {
    const test = document.querySelector(`.${id}`);
    if (test.style.display == "flex") {
      test.style.display = "none";
    } else {
      test.style.display = "flex";
    }
  };

  const handleSubmitSearch = (e, text) => {
    if (e == 0 && isName == true) {
      setListFilter([]);
      let array = [];
      for (let i = 0; i < list.data.length; i++) {
        if (list.data[i].name.toLowerCase().includes(text)) {
          array = [...array, list.data[i]];
        }
      }
      setListFilter(array);
    } else if (e == 1 && isQ == true) {
      setListFilter([]);
      let array = [];

      for (let i = 0; i < list.data.length; i++) {
        if (list.data[i].quantity <= text && list.data[i].quantity >= minQ) {
          array = [...array, list.data[i]];
        }
      }
      setListFilter(array);
    } else if (e == 2 && isPrice == true) {
      setListFilter([]);
      let array = [];

      for (let i = 0; i < list.data.length; i++) {
        if (
          list.data[i].purchasePrice <= text &&
          list.data[i].purchasePrice >= minP
        ) {
          array = [...array, list.data[i]];
        }
      }
      setListFilter(array);
    }
  };

  const showInput = (e) => {
    if (e == 0) {
      setisName(!isName);
      setIsQ(false);
      setisPrice(false);
    } else if (e == 1) {
      setIsQ(!isQ);
      setisName(false);
      setisPrice(false);
    } else {
      setisName(false);
      setIsQ(false);
      setisPrice(!isPrice);
    }
    setListFilter(list.data);
  };

  return (
    <div className=" w-full pt-[150px] pb-[50px]">
      <Nav />
      <h1 className="text-[32px] text-center mb-5 font-bold text-blue-600 w-fit px-[20px] py-[10px] border-[1px] border-blue-600  mx-auto bg-white rounded-md">
        Parts
      </h1>
      <div className="flex px-[308px] mb-[30px] gap-1 items-center justify-center text-[20px] max-sm:flex-wrap max-lg:px-[30px]">
        <div className="py-[6px] flex gap-3 px-[8px] bg-green-600 hover:bg-green-500 transition-all cursor-pointer w-fit text-white rounded-md">
          <p onClick={() => showInput(0)}>F name</p>
          {isName ? (
            <input
              type="text"
              value={nameS}
              onChange={(e) => {
                setnameS(e.target.value);
                handleSubmitSearch(0, e.target.value);
              }}
              className=" block w-[200px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          ) : (
            console.log()
          )}
        </div>

        <div className="py-[6px] flex gap-3 px-[8px] bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer w-fit text-white rounded-md">
          <p onClick={() => showInput(1)}>F quantity</p>
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
                onChange={(e) => {
                  setMaxQ(e.target.value);
                  handleSubmitSearch(1, e.target.value);
                }}
                className=" block w-[100px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : (
            console.log()
          )}
        </div>

        <div className="py-[6px] flex gap-3 px-[8px] bg-red-600 hover:bg-red-500 transition-all cursor-pointer w-fit text-white rounded-md">
          <p onClick={() => showInput(2)}>F price</p>
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
                onChange={(e) => {
                  setMaxP(e.target.value);
                  handleSubmitSearch(2, e.target.value);
                }}
                className=" block w-[100px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : (
            console.log()
          )}
        </div>
      </div>
      <div className="w-full lg:px-[300px]  flex justify-center items-center flex-wrap gap-5 font-sans h-full">
        {listFilter.length > 0 ? (
          listFilter.map((ser) => {
            return (
              <div
                key={ser._id}
                className="w-[350px] h-[90px] relative bg-white flex items-center  rounded-md hover:shadow-2xl transition-all shadow overflow-hidden group cursor-pointer"
              >
                <div
                  className={`hidden group-hover:!flex ${`go${ser._id}`} justify-center flex-col items-center absolute bg-blue-600/60 top-0 left-0 w-full h-full`}
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
                </div>
                <Image
                  src={img}
                  alt="Picture of the author"
                  className="w-[50px] h-[50px]"
                />
                <div className="px-[10px] pt-[10px] flex text-[12px] justify-between w-full items-center">
                  <p className="text-[20px] text-blue-600 text-center font-bold w-[40%]">
                    {ser.name}
                  </p>
                  <p className="text-blue-600">{ser.quantity}/Q</p>
                  <p className="text-red-600">{ser.purchasePrice}$</p>
                  <p className="text-green-600">{ser.sellingPrice}$</p>
                  <p
                    onClick={() => handellHover(`go${ser._id}`)}
                    className="w-[30px] relative h-[30px] hidden max-sm:flex -translate-y-1 bg-blue-400 rounded-full text-white justify-center items-center font-bold"
                  >
                    +
                  </p>
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
