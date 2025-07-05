"use client";
import { checkTokenExpiration } from "@/app/fun/tokenAccess";
import {
  faArrowRight,
  faArrowsRotate,
  faBackward,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import PupupInvo from "@/app/component/PupupInvo";
import Link from "next/link";
import { mainUrl } from "@/app/api";

export default function Content({ id }) {
  let list = [];
  const [oneTech, setOneTech] = useState([]);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [invo, setInvo] = useState([]);
  const [inputPay, setInputPay] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);

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

  const filterData = () => {
    let arr = [];
    for (let i = 0; i < invo.length; i++) {
      if (input1 <= input2) {
        if (
          invo[i].date.slice(0, 10) <= input2 &&
          invo[i].date.slice(0, 10) >= input1
        ) {
          arr.push(invo[i]);
        }
        setInvo(arr);
      } else {
        toast.error("change the from date");
        break;
      }
    }
  };

  const reFilter = () => {
    setInvo(oneTech[0].invoices);
  };

  const showData = () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url = `${mainUrl}/technicians`;

    axios
      .get(url, config)
      .then((res) => {
        list = res.data.data.filter((item) => item._id == id);
        setOneTech(res.data.data.filter((item) => item._id == id));
        setInvo(list[0].invoices);
        console.log(oneTech);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const test = () => {
    console.log(oneTech);
  };

  const pay = (e) => {
    e.preventDefault();
    console.log(oneTech[0]._id);
    console.log(inputPay);
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url = `${mainUrl}/technicians/${oneTech[0]._id}/pay`;

    axios
      .post(
        url,
        {
          amount: +inputPay,
        },
        config
      )
      .then((res) => {
        setOneTech([res.data.data]);
        toast.success("success");
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
    togglePopup();
  };

  return (
    <div className="py-[50px] px-[200px] max-sm:px-[30px] text-[20px]">
      {oneTech.length ? (
        <div>
          <h1 className="text-center text-[28px] text-blue-600 font-bold">
            Technician: {oneTech[0].name}
          </h1>
          <p>Phone: {oneTech[0].phone}</p>
          <p>address: {oneTech[0].email}</p>
          <p>Total amount due: {oneTech[0].totalDueAmount}</p>
          <div className="flex justify-between items-center my-[30px]">
            <div
              onClick={togglePopupAdd}
              className="flex gap-2 max-sm:h-[50px] bg-blue-600 items-center text-white px-[20px] py-[10px] rounded-md hover:bg-blue-500 transition-all cursor-pointer"
            >
              <p className="max-sm:hidden">invoice</p>
              <FontAwesomeIcon icon={faPlus} className="text-[20px]" />
            </div>
            <div
              onClick={togglePopup}
              className="bg-red-600 text-white px-[20px] py-[10px] rounded-md hover:bg-red-500 transition-all cursor-pointer"
            >
              Debt repayment
            </div>
          </div>
          <div className="flex gap-[10px] items-center flex-wrap justify-center">
            <fieldset className="border border-gray-300 rounded-md shadow-sm max-sm:w-full">
              <legend className="pl-2 text-gray-700 font-medium text-[14px]">
                From the date
              </legend>
              <input
                type="date"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                className="block w-full px-3 py-1 focus:outline-none "
              />
            </fieldset>
            <fieldset className="border border-gray-300 rounded-md shadow-sm max-sm:w-full">
              <legend className="pl-2 text-gray-700 font-medium text-[14px]">
                To date
              </legend>
              <input
                type="date"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                className="block w-full px-3 py-1 focus:outline-none "
              />
            </fieldset>
            <FontAwesomeIcon
              icon={faArrowRight}
              onClick={filterData}
              className="bg-blue-600 translate-y-2 items-center text-white px-[20px] py-[10px] rounded-md hover:bg-blue-500 transition-all cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faArrowsRotate}
              onClick={reFilter}
              className="bg-red-600 translate-y-2 items-center text-white px-[20px] py-[10px] rounded-md hover:bg-red-500 transition-all cursor-pointer"
            />
          </div>
          <div className="my-[50px]">
            <div className="flex text-[14px] max-sm:text-[11px] justify-between">
              <p className="w-[15%] text-center">Name</p>
              <p className="w-[15%] text-center">quantity</p>
              <p className="w-[15%] text-center">price</p>
              <p className="w-[15%] text-center">date</p>
              <p className="w-[15%] text-center">paid</p>
              <p className="w-[15%] text-center">remaining</p>
            </div>
            {invo.length ? (
              invo.map((item) => {
                return (
                  <div
                    key={item._id}
                    className="flex flex-col items-center max-sm:text-[11px] text-[14px] hover:bg-blue-200  transition-all w-full mb-2 justify-between bg-blue-300 border-[1px] border-blue-950 rounded-lg text-blue-950"
                  >
                    {item.items.length ? (
                      item.items.map((row, ind) => {
                        return (
                          <div
                            key={ind}
                            className="flex w-full justify-between items-center"
                          >
                            <p className="w-[15%] text-center">
                              {row.partName}
                            </p>
                            <p className="w-[15%] text-center">
                              {row.quantity}
                            </p>
                            <p className="w-[15%] text-center">{row.price}</p>
                            <p className="w-[15%] text-center overflow-x-auto">
                              {item.date.slice(0, 10)}
                            </p>
                            <p className="w-[15%] text-center text-green-600">
                              {row.paidAmount}
                            </p>
                            <p className="w-[15%] text-center text-red-600">
                              {row.remainingAmount}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex w-full justify-between items-center">
                        <p className="w-[15%] text-center">
                          {item.items[0].partName}
                        </p>
                        <p className="w-[15%] text-center">
                          {item.items[0].quantity}
                        </p>
                        <p className="w-[15%] text-center">
                          {item.items[0].price}
                        </p>
                        <p className="w-[15%] text-center overflow-x-auto">
                          {item.date.slice(0, 10)}
                        </p>
                        <p className="w-[15%] text-center text-green-600">
                          {item.items[0].paidAmount}
                        </p>
                        <p className="w-[15%] text-center text-red-600">
                          {item.items[0].remainingAmount}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No invoices..</p>
            )}
          </div>
        </div>
      ) : (
        <p className="w-full text-center mp-[50px]">Loading..</p>
      )}
      <div>
        {/* Amountالبوب أب */}
        {isOpen && (
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
        {/* Add  */}
        {isOpenAdd && (
          <PupupInvo
            togglePopupAdd={togglePopupAdd}
            id={id}
            showData={showData}
          />
        )}
      </div>
      <Link href={"/technician"}>
        <FontAwesomeIcon
          icon={faBackward}
          className="font-bold max-md:right-[30px] max-md:bottom-[30px] rotate-180 max-md:text-[30px] hover:scale-[110%] transition-all text-[50px] text-blue-600  fixed cursor-pointer right-[100px] bottom-[100px]"
        />
      </Link>
      <ToastContainer />
    </div>
  );
}
