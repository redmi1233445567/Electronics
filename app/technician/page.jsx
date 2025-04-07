"use client";
import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faPersonCirclePlus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { checkTokenExpiration } from "../fun/tokenAccess";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import PupupInvo from "../component/PupupInvo";

export default function page() {
  const [list, setList] = useState([]);
  const [listFilter, setListFilter] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [inputPay, setInputPay] = useState();
  const [payId, setPayId] = useState("");
  const [nameS, setnameS] = useState("");
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [idAdd, setIdAdd] = useState();

  useEffect(() => {
    checkTokenExpiration();
    showData();
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const togglePopupAdd = () => {
    if (isOpenAdd) {
      setIsOpenAdd(false);
      showData();
    } else {
      setIsOpenAdd(true);
    }
  };

  const togglePopupEdit = (id) => {
    setIsOpenEdit(!isOpenEdit);
    if (payId == "") {
      setPayId(id);
    } else {
      setPayId("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const urlS = `https://electronics-backend-production.up.railway.app/api/technicians`;

    if (input1 == "" || input3 == "") {
      toast.error("Enter Name and Phone");
    } else {
      axios
        .post(
          urlS,
          {
            name: input1,
            address: input2,
            phone: input3,
          },
          config
        )
        .then((res) => {
          console.log(res.data);
          showData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const search = (e) => {
    setListFilter([]);
    let array = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].name.toLowerCase().includes(e)) {
        array = [...array, list[i]];
      }
    }
    setListFilter(array);
  };

  const showData = () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const urlS = `https://electronics-backend-production.up.railway.app/api/technicians`;

    axios
      .get(urlS, config)
      .then((res) => {
        console.log(res.data);
        setList(res.data.data);
        setListFilter(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const pay = (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    console.log(payId);
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url = `https://electronics-backend-production.up.railway.app/api/technicians/${payId}/payment`;

    axios
      .post(
        url,
        {
          amount: +inputPay,
        },
        config
      )
      .then((res) => {
        showData();
        toast.success("seccess");
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
    togglePopupEdit();
  };

  return (
    <div className="pt-[150px] pb-[50px] px-[200px] max-sm:px-[30px]">
      <Nav />
      <h1 className="text-[32px] text-center mb-5 font-bold text-blue-600 w-fit px-[20px] py-[10px] border-[1px] border-blue-600  mx-auto bg-white rounded-md">
        Technician
      </h1>
      <div className="flex  mb-[30px] gap-2 justify-between w-full items-center text-[20px] max-sm:flex-wrap max-lg:px-[30px]">
        <div className="flex gap-[10px]">
          <input
            type="text"
            onChange={(e) => search(e.target.value)}
            placeholder="Search by name"
            className=" block px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Link href={"/allInvo"}>
          <div className="text-blue-600 text-[24px] font-bold hover:scale-105 transition-all ">
            All Incoices
          </div>
        </Link>
      </div>
      {listFilter.length ? (
        listFilter.map((li) => {
          return (
            <div key={li._id}>
              <div className="flex items-center hover:bg-blue-200 mb-2 flex-wrap  max-xl:justify-center transition-all w-full  p-[20px] bg-blue-300 border-[1px] border-blue-950 rounded-lg text-blue-950">
                <p className="font-bold text-[24px] max-sm:text-[18px] w-[200px] max-lg:text-center">
                  {li.name}
                </p>
                <div className=" flex-1/3">
                  {li.invoices.length ? (
                    li.invoices.map((item) => {
                      return (
                        <div
                          key={item._id}
                          className="flex gap-[8px] flex-wrap not-last:border-b-[0.1px] border-blue-500 mr-[50px] "
                        >
                          <p className="font-bold max-lg:text-center">
                            {item.partName} -{" "}
                          </p>
                          <p>
                            <span className="font-bold">quantity:</span>{" "}
                            {item.quantity}
                          </p>
                          <p>
                            <span className="font-bold">price:</span>{" "}
                            {item.price}
                          </p>
                          <p>
                            <span className="font-bold">remaining Amount:</span>{" "}
                            {item.remainingAmount}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No invoices</p>
                  )}
                </div>
                <div className="flex gap-[20px]">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => togglePopupEdit(li._id)}
                    className="text-[30px] hover:scale-[105%] transition-all cursor-pointer"
                  />
                  <Link href={`/technician/${li._id}`}>
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-[30px] hover:scale-[105%] transition-all cursor-pointer"
                    />
                  </Link>
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() => {
                      setIdAdd(li._id);
                      togglePopupAdd();
                    }}
                    className="text-[30px] hover:scale-[105%] transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-[28px] text-blue-950">No technician ...</p>
      )}

      <div>
        {/* البوب أب */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-sm:w-[300px]">
              <h2 className="text-xl font-bold mb-4">Add a new technician</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/*الاسم*/}
                <label className="block">
                  <fieldset className="border border-gray-300 rounded-md shadow-sm">
                    <legend className="pl-2 text-gray-700 font-medium">
                      Name
                    </legend>
                    <input
                      type="text"
                      value={input1}
                      onChange={(e) => setInput1(e.target.value)}
                      className="block w-full px-3 py-1 focus:outline-none "
                    />
                  </fieldset>
                  <fieldset className="border border-gray-300 rounded-md shadow-sm">
                    <legend className="pl-2 text-gray-700 font-medium">
                      Adress
                    </legend>
                    <input
                      type="text"
                      value={input2}
                      onChange={(e) => setInput2(e.target.value)}
                      className="block w-full px-3 py-1 focus:outline-none "
                    />
                  </fieldset>
                  <fieldset className="border border-gray-300 rounded-md shadow-sm">
                    <legend className="pl-2 text-gray-700 font-medium">
                      Phone
                    </legend>
                    <input
                      type="number"
                      value={input3}
                      onChange={(e) => setInput3(e.target.value)}
                      className="block w-full px-3 py-1 focus:outline-none "
                    />
                  </fieldset>
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

      <div>
        {/* Amountالبوب أب */}
        {isOpenEdit && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-sm:w-[300px]">
              <h2 className="text-xl font-bold mb-4">
                Much more than the total due
              </h2>
              <form onSubmit={pay} className="space-y-4">
                {/*الاسم*/}
                <label className="block">
                  <fieldset className="border border-gray-300 rounded-md shadow-sm">
                    <legend className="pl-2 text-gray-700 font-medium">
                      Pay
                    </legend>
                    <input
                      type="number"
                      onChange={(e) => setInputPay(e.target.value)}
                      className="block w-full px-3 py-1 focus:outline-none "
                    />
                  </fieldset>
                </label>
                {/* أزرار الإرسال والإغلاق */}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={togglePopupEdit}
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

      <div>
        {/* Add  */}
        {isOpenAdd && (
          <PupupInvo
            togglePopupAdd={togglePopupAdd}
            id={idAdd}
            showData={showData}
          />
        )}
      </div>

      <FontAwesomeIcon
        icon={faPersonCirclePlus}
        onClick={togglePopup}
        className=" max-md:right-[30px] max-md:bottom-[30px] text-blue-950 hover:scale-[110%] transition-all text-[50px] fixed cursor-pointer right-[100px] bottom-[100px]"
      />
      <ToastContainer />
    </div>
  );
}
