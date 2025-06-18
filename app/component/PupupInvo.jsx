"use client";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useReducer, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { mainUrl } from "../api";

export default function PupupInvo({ togglePopupAdd, id, showData }) {
  const [PartList, setPartList] = useState(["z", "v", "h"]);
  const [inputQ, setInputQ] = useState(1);
  const [inputPr, setInputPr] = useState(0);
  const [inputPa, setInputPa] = useState(0);
  const [inputPart, setInputPart] = useState();
  const [inputDate, setInputDate] = useState();
  const [idPart, setIdPart] = useState();
  const [numQu, setNumQu] = useState(0);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [allInvoices, setAllInvoices] = useState([
    {
      items: [],
      date: inputDate,
    },
  ]);

  useEffect(() => {
    getPartList();
  }, []);

  const getPartList = () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const url = `${mainUrl}/parts`;

    axios
      .get(url, config)
      .then((res) => {
        setPartList(res.data.data);
        setInputPr(res.data.data[0].sellingPrice);
        setNumQu(res.data.data[0].quantity);
        setInputPart(res.data.data[0].name);
        setIdPart(res.data.data[0]._id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectPart = (e) => {
    for (let i = 0; i < PartList.length; i++) {
      if (PartList[i]._id == e) {
        setInputPr(PartList[i].sellingPrice);
        setNumQu(PartList[i].quantity);
        setInputPart(PartList[i].name);
        setIdPart(PartList[i]._id);
      }
    }
  };

  const addOneInvoice = () => {
    if (inputDate == undefined || inputPa == "") {
      toast.error("Please enter all Data");
    } else {
      const newRow = {
        partId: idPart,
        partName: inputPart,
        quantity: inputQ,
        price: inputPr * inputQ,
        paidAmount: inputPa,
        remainingAmount: inputPr * inputQ - inputPa,
      };
      let newArray = allInvoices;
      newArray[0].items.push(newRow);
      newArray[0].date = inputDate;

      setAllInvoices(newArray);
      forceUpdate();
    }
  };

  const deleteOne = (idd) => {
    let newArray = [];
    for (let i = 0; i < allInvoices[0].items.length; i++) {
      if (i != idd) {
        newArray.push(allInvoices[0].items[i]);
      }
    }
    let editArray = allInvoices;
    editArray[0].items = newArray;
    console.log(editArray);
    setAllInvoices(editArray);
    forceUpdate();
  };

  const handellSave = (e) => {
    e.preventDefault();
    console.log(allInvoices);
    console.log(id);
    if (allInvoices[0].items.length) {
      const token = Cookies.get("authToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const url = `${mainUrl}/technicians/${id}/invoices`;

      axios
        .post(url, allInvoices[0], config)
        .then((res) => {
          toast.success("success");
        })
        .catch((error) => {
          toast.error(error);
          console.log(error);
        });
    } else {
      toast.error("add invoice");
    }
    showData();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 ">
      <div className="bg-white p-3 rounded-lg shadow-lg w-96 max-sm:w-[300px] h-[500px] overflow-y-auto my-[30px]">
        <h2 className="text-xl font-bold mb-4">ِAdd invoice</h2>
        <form className="space-y-4" onSubmit={handellSave}>
          {/*الاسم*/}
          <label className="block">
            <fieldset className="border border-gray-300 rounded-md shadow-sm">
              <legend className="pl-2 text-gray-700 font-medium">Date</legend>
              <input
                type="date"
                onChange={(e) => setInputDate(e.target.value)}
                className="block w-full px-3  focus:outline-none "
              />
            </fieldset>
            <fieldset className="border border-gray-300 rounded-md shadow-sm">
              <legend className="pl-2 text-gray-700 font-medium">Part</legend>
              <select
                name="part"
                className="w-full px-2 focus:outline-none"
                onChange={(e) => selectPart(e.target.value)}
              >
                {PartList.length ? (
                  PartList.map((item, ind) => {
                    return (
                      <option key={ind} value={item._id}>
                        {item.name} ({item.quantity})
                      </option>
                    );
                  })
                ) : (
                  <option value={no}>No</option>
                )}
              </select>
            </fieldset>
            <fieldset className="border border-gray-300 rounded-md shadow-sm">
              <legend className="pl-2 text-gray-700 font-medium">
                quantity
              </legend>
              <input
                type="number"
                value={inputQ}
                onChange={(e) => setInputQ(e.target.value)}
                max={numQu}
                min={1}
                className="block w-full px-3 focus:outline-none "
              />
            </fieldset>
            <fieldset className="border border-gray-300 rounded-md shadow-sm">
              <legend className="pl-2 text-gray-700 font-medium">price</legend>
              <input
                type="number"
                readOnly
                value={inputPr * inputQ}
                className="block w-full px-3 focus:outline-none "
              />
            </fieldset>
            <fieldset className="border border-gray-300 rounded-md shadow-sm">
              <legend className="pl-2 text-gray-700 font-medium">
                price paid
              </legend>
              <input
                type="number"
                onChange={(e) => setInputPa(e.target.value)}
                className="block w-full px-3 focus:outline-none "
              />
            </fieldset>
            <FontAwesomeIcon
              icon={faPlus}
              onClick={addOneInvoice}
              className="text-[30px] bg-green-600 text-white rounded-md px-[10px] py-[6px] my-[20px] cursor-pointer transition-all hover:bg-green-500"
            />
          </label>
          <div>
            <div className="flex justify-between text-[11px]">
              <p className="w-[15%] text-center">name</p>
              <p className="w-[15%] text-center">quantity</p>
              <p className="w-[15%] text-center">price</p>
              <p className="w-[15%] text-center">paid</p>
              <p className="w-[15%] text-center">remaining</p>
              <p className="w-[15%] text-center">delete</p>
            </div>
            {allInvoices[0].items.length ? (
              allInvoices[0].items.map((item, ind) => {
                return (
                  <div key={ind}>
                    <div className="flex items-center text-[14px] hover:bg-blue-200  transition-all w-full mb-2 justify-between bg-blue-300 border-[1px] border-blue-950 rounded-lg text-blue-950">
                      <p className="w-[15%] text-center">{item.partName}</p>
                      <p className="w-[15%] text-center">{item.quantity}</p>
                      <p className="w-[15%] text-center">{item.price}</p>
                      <p className="w-[15%] text-center text-green-600">
                        {item.paidAmount}
                      </p>
                      <p className="w-[15%] text-center text-red-600">
                        {item.remainingAmount}
                      </p>
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        onClick={() => deleteOne(ind)}
                        className="text-red-600 w-[15%] text-center cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center">.....</p>
            )}
          </div>
          {/* أزرار الإرسال والإغلاق */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={togglePopupAdd}
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
      <ToastContainer />
    </div>
  );
}
