"use client";
import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faPersonCirclePlus,
  faPlus,
  faTrash,
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
          showData();
          togglePopup();
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
      if (list[i].name.toLowerCase().includes(e.toLowerCase())) {
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

  const deleteItem = (id) => {
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const urlS = `https://electronics-backend-production.up.railway.app/api/technicians/${id}`;

    axios
      .delete(urlS, config)
      .then((res) => {
        console.log(res);
        setListFilter([]);
        let array = [];
        for (let i = 0; i < list.length; i++) {
          if (list[i]._id != id) {
            array = [...array, list[i]];
          }
        }
        setListFilter(array);
        setList(listFilter);
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
    <div className="pt-[150px] pb-[50px] md:px-[150px] max-sm:px-[30px]">
      <Nav />
      <h1 className="text-[32px] text-center mb-5 font-bold text-blue-600 w-fit px-[20px] py-[10px] border-[1px] border-blue-600  mx-auto bg-white rounded-md">
        Technician
      </h1>
      <div className="flex  mb-[30px] gap-2 justify-between w-full max-md:justify-center items-center text-[20px] flex-wrap">
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
      <table className="w-[100%] max-sm:w-[90%]  max-sm:text-[13px] max-md:block max-md:overflow-auto">
        <thead>
          <tr className="text-blue-600">
            <th>name</th>
            <th>invoices</th>
            <th>procedures</th>
          </tr>
        </thead>
        <tbody>
          {listFilter.length ? (
            listFilter.map((li) => {
              return (
                <tr
                  key={li._id}
                  className="border-b-[1px] border-b-gray-200 hover:bg-blue-100 transition-all pb-[30px]"
                >
                  <td className="font-bold text-[24px] max-sm:text-[18px] w-[200px] text-center">
                    {li.name}
                  </td>
                  <td className="  min-w-[300px]">
                    {li.invoices.length ? (
                      <table className="w-full mx-auto overflow-auto">
                        <thead>
                          <tr>
                            <th>name</th>
                            <th>quantity</th>
                            <th>price</th>
                            <th>Rprice</th>
                          </tr>
                        </thead>
                        <tbody>
                          {li.invoices.length ? (
                            li.invoices.map((item) => {
                              return (
                                <tr key={item._id}>
                                  <td className="text-center w-[40%]">
                                    {item.partName}
                                  </td>
                                  <td className="text-center w-[20%]">
                                    {item.quantity}
                                  </td>
                                  <td className="text-center w-[20%]">
                                    {item.price}
                                  </td>
                                  <td className="text-center w-[20%]">
                                    {item.remainingAmount}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td>No invoices</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <p>No invoices</p>
                    )}
                  </td>
                  <td className="flex gap-[20px] justify-center items-center">
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
                      icon={faTrash}
                      onClick={() => deleteItem(li._id)}
                      className="text-[30px] hover:text-red-600 transition-all text-red-400 cursor-pointer"
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No technician ...</td>
            </tr>
          )}
        </tbody>
      </table>

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
