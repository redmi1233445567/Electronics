"use client";
import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkTokenExpiration } from "../fun/tokenAccess";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { mainUrl } from "../api";

export default function page() {
  const token = Cookies.get("authToken");
  const [isOpen, setIsOpen] = useState(false);
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

  const showData = () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url = `${mainUrl}/repairs`;

    axios
      .get(url, config)
      .then((res) => {
        setList(res.data.data);
        console.log(res.data.data);
        setListFilter(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const togellUpdate = (id) => {
    setUpdate(!update);
    setIsOpen(!isOpen);
    setId(id);
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const urlS = `${mainUrl}/repairs`;

    axios
      .get(urlS, config)
      .then((res) => {
        console.log(res.data);
        let test = res.data.data.filter((item) => item._id == id);
        console.log(test);
        setInput1(test[0].customerName);
        setInput2(test[0].mobile);
        setInput3(test[0].issue);
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
      const url = `${mainUrl}/repairs`;
      axios
        .post(
          url,
          {
            customerName: input1,
            mobile: input2,
            issue: input3,
            deliveryDate: input4,
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
      const url = `${mainUrl}/repairs/${id}`;
      axios
        .put(
          url,
          {
            customerName: input1,
            mobile: input2,
            issue: input3,
            deliveryDate: input4,
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
    const url = `${mainUrl}/repairs/${id}`;
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

  const search = (e) => {
    setListFilter([]);
    let array = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].customerName.toLowerCase().includes(e.toLowerCase())) {
        array = [...array, list[i]];
      }
    }
    setListFilter(array);
  };

  return (
    <div className=" w-full pt-[150px] pb-[50px]">
      <Nav />
      <h1 className="text-[32px] text-center mb-5 font-bold text-blue-600 w-fit px-[20px] py-[10px] border-[1px] border-blue-600  mx-auto bg-white rounded-md">
        Repair
      </h1>
      <div className="px-[100px] mx-auto mb-[30px] w-[60%] text-[20px] max-lg:px-[30px]">
        <input
          type="text"
          value={nameS}
          onChange={(e) => {
            setnameS(e.target.value);
            search(e.target.value);
          }}
          className=" block w-full px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
      <div className="w-full lg:px-[300px] px-[10px]  flex justify-center items-center flex-wrap gap-5 font-sans h-full">
        <div className="flex text-[14px] max-sm:text-[11px] justify-between w-full">
          <p className="w-[20%] text-center">Name</p>
          <p className="w-[20%] text-center">Phone</p>
          <p className="w-[20%] text-center">receipt</p>
          <p className="w-[20%] text-center">Delivery</p>
          <p className="w-[20%] text-center">procedures</p>
        </div>
        {listFilter.length ? (
          listFilter.map((item) => {
            return (
              <div
                key={item._id}
                className="flex items-center py-[10px] max-sm:text-[11px] text-[14px] hover:bg-blue-200  transition-all w-full mb-2 justify-between bg-blue-300 border-[1px] border-blue-950 rounded-lg text-blue-950"
              >
                <p className="w-[20%] text-center overflow-x-auto">
                  {item.customerName}
                </p>
                <p className="w-[20%] text-center overflow-x-auto">
                  {item.mobile}
                </p>
                <p className="w-[20%] text-center overflow-x-auto">
                  {item.issue}
                </p>
                <p className="w-[20%] text-center overflow-x-auto">
                  {item.deliveryDate.slice(0, 10)}
                </p>
                <p className="w-[20%] flex justify-around">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => togellUpdate(item._id)}
                    className="text-[20px] hover:scale-[105%] transition-all cursor-pointer max-sm:text-[15px]"
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => handellDelete(item._id)}
                    className="text-[20px] hover:text-red-600 transition-all text-red-400 cursor-pointer max-sm:text-[15px]"
                  />
                </p>
              </div>
            );
          })
        ) : (
          <p>no repairs</p>
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
                  <h2 className="text-xl font-bold mb-4">Add a new repair</h2>
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

                  {/* الهاتف */}
                  <label className="block">
                    <span className="text-gray-700">Phone:</span>
                    <input
                      type="number"
                      value={input2}
                      onChange={(e) => setInput2(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>

                  {/* المشكلة */}
                  <label className="block">
                    <span className="text-gray-700">Problem:</span>
                    <input
                      type="text"
                      value={input3}
                      onChange={(e) => setInput3(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-gray-700">deliveryDate:</span>
                    <input
                      type="date"
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
