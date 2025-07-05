"use client";
import React, { useEffect, useState } from "react";
import Nav from "../component/Nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faPersonCirclePlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { checkTokenExpiration } from "../fun/tokenAccess";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import PupupInvo from "../component/PupupInvo";
import { mainUrl } from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [list, setList] = useState([]);
  const [listFilter, setListFilter] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [payId, setPayId] = useState("");
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
    if (!payId) {
      setPayId(id);
      let oneTech = list.find((item) => item._id == id);
      if (oneTech) {
        setInput1(oneTech.name);
        setInput2(oneTech.email);
        setInput3(oneTech.phone);
      }
    } else {
      setPayId("");
      setInput1("");
      setInput2("");
      setInput3("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const urlS = `${mainUrl}/technicians`;

    if (!input1 || !input3) {
      toast.error("Enter Name and Phone");
    } else {
      axios
        .post(urlS, { name: input1, email: input2, phone: input3 }, config)
        .then(() => {
          showData();
          togglePopup();
          setInput1("");
          setInput2("");
          setInput3("");
        })
        .catch(console.error);
    }
  };

  const pay = (e) => {
    e.preventDefault();
    const token = Cookies.get("authToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const urlS = `${mainUrl}/technicians/${payId}`;

    if (!input1 || !input3) {
      toast.error("Enter Name and Phone");
    } else {
      axios
        .put(urlS, { name: input1, email: input2, phone: input3 }, config)
        .then(() => {
          showData();
          setInput1("");
          setInput2("");
          setInput3("");
          togglePopupEdit();
        })
        .catch(console.error);
    }
  };

  const deleteItem = (id) => {
    const token = Cookies.get("authToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const urlS = `${mainUrl}/technicians/${id}`;

    axios
      .delete(urlS, config)
      .then(() => {
        const updatedList = list.filter((item) => item._id !== id);
        setList(updatedList);
        setListFilter(updatedList);
      })
      .catch(console.error);
  };

  const search = (e) => {
    const query = e.toLowerCase();
    const filtered = list.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setListFilter(filtered);
  };

  const showData = () => {
    const token = Cookies.get("authToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const urlS = `${mainUrl}/technicians`;

    axios
      .get(urlS, config)
      .then((res) => {
        setList(res.data.data);
        setListFilter(res.data.data);
      })
      .catch(console.error);
  };

  return (
    <div className="pt-32 px-4 md:px-24 bg-white min-h-screen">
      <Nav />
      <h1 className="text-3xl font-bold text-center text-blue-600 bg-blue-50 py-4 rounded-xl shadow mb-8">
        Technician Dashboard
      </h1>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <input
          type="text"
          onChange={(e) => search(e.target.value)}
          placeholder="Search technician..."
          className="flex-1 px-4 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
        />
        <Link
          href="/allInvo"
          className="text-blue-600 font-medium hover:underline"
        >
          View All Invoices
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {listFilter.length ? (
          listFilter.map((li) => (
            <motion.div
              key={li._id}
              className="bg-blue-50 border border-blue-100 rounded-lg shadow p-4 transition hover:shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-blue-700">
                  {li.name}
                </h2>
                <div className="flex gap-3 text-lg">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={() => togglePopupEdit(li._id)}
                    className="text-yellow-500 cursor-pointer hover:scale-110"
                  />
                  <Link href={`/technician/${li._id}`}>
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-blue-500 cursor-pointer hover:scale-110"
                    />
                  </Link>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteItem(li._id)}
                    className="text-red-500 cursor-pointer hover:scale-110"
                  />
                </div>
              </div>
              <details className="group">
                <summary className="cursor-pointer text-blue-600 hover:underline text-sm">
                  {li.invoices.length
                    ? `${li.invoices.length} Invoice(s)`
                    : "No invoices"}
                </summary>
                {li.invoices.length ? (
                  <div className="mt-2 space-y-1 transition-all ease-in-out">
                    {li.invoices.map((inv) => (
                      <div
                        key={inv._id}
                        className="text-xs border border-gray-200 p-2 rounded bg-gray-50"
                      >
                        <span className="font-semibold">
                          {inv.items[0].partName}
                        </span>{" "}
                        — Qty: {inv.items[0].quantity} — Price:{" "}
                        {inv.items[0].price} — Remain:{" "}
                        <span className="text-red-500">
                          {inv.items[0].remainingAmount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </details>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-2">
            No technicians found...
          </p>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Add Technician
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  placeholder="Name"
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  placeholder="Address"
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="number"
                  value={input3}
                  onChange={(e) => setInput3(e.target.value)}
                  placeholder="Phone"
                  className="w-full border rounded px-3 py-2"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={togglePopup}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpenEdit && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Edit Technician
              </h2>
              <form onSubmit={pay} className="space-y-4">
                <input
                  type="text"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  placeholder="Name"
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  placeholder="Address"
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="number"
                  value={input3}
                  onChange={(e) => setInput3(e.target.value)}
                  placeholder="Phone"
                  className="w-full border rounded px-3 py-2"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={togglePopupEdit}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpenAdd && (
        <PupupInvo
          togglePopupAdd={togglePopupAdd}
          id={idAdd}
          showData={showData}
        />
      )}

      <FontAwesomeIcon
        icon={faPersonCirclePlus}
        onClick={togglePopup}
        className="fixed bottom-10 right-10 text-blue-700 text-5xl cursor-pointer hover:scale-110 transition-transform"
      />

      <ToastContainer />
    </div>
  );
}
