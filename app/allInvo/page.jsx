"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { checkTokenExpiration } from "../fun/tokenAccess";
import Nav from "../component/Nav";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mainUrl } from "../api";

export default function page() {
  const [list, setList] = useState([]);

  useEffect(() => {
    checkTokenExpiration();
    showData();
  }, []);

  const showData = () => {
    const token = Cookies.get("authToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const urlS = `${mainUrl}/technicians`;

    axios
      .get(urlS, config)
      .then((res) => {
        setList(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const exportPDFOrExcel = async (e) => {
    const token = Cookies.get("authToken");

    try {
      let urll;
      if (e == 0) {
        urll = `${mainUrl}/technicians/export/pdf`;
      } else if (e == 1) {
        urll = `${mainUrl}/technicians/export/excel`;
      } else if (e == 2) {
        urll = `${mainUrl}/technicians/invoices/export/pdf`;
      } else {
        urll = `${mainUrl}/technicians/invoices/export/excel`;
      }
      const response = await axios({
        method: "GET",
        proxy: `${mainUrl}`,
        url: urll,
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      // إنشاء رابط تحميل
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      if (
        urll == `${mainUrl}/technicians/invoices/export/excel` ||
        urll == `${mainUrl}/technicians/export/excel`
      ) {
        link.setAttribute("download", "invoice.xlsx");
      } else {
        link.setAttribute("download", "invoice.pdf");
      }
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="pt-[150px] pb-[50px] px-[200px] max-lg:px-[30px]">
      <Nav />
      <div className="flex justify-around items-center mb-[30px] flex-wrap gap-5">
        <div
          onClick={() => exportPDFOrExcel(0)}
          className="flex gap-2 items-center text-[16px] text-white shadow-black shadow-sm py-[10px] px-[20px] bg-red-600 hover:bg-red-500 transition-all cursor-pointer rounded-md"
        >
          <p>Invoices</p>
          <FontAwesomeIcon icon={faFilePdf} />
        </div>
        <div
          onClick={() => exportPDFOrExcel(1)}
          className="flex gap-2 items-center text-[16px] text-white shadow-black shadow-sm py-[10px] px-[20px] bg-green-600 hover:bg-green-500 transition-all cursor-pointer rounded-md"
        >
          <p>Invoices</p>
          <FontAwesomeIcon icon={faFileExcel} />
        </div>
        <div
          onClick={() => exportPDFOrExcel(2)}
          className="flex gap-2 items-center text-[16px] text-white shadow-black shadow-sm py-[10px] px-[20px] bg-red-600 hover:bg-red-500 transition-all cursor-pointer rounded-md"
        >
          <p>Summary</p>
          <FontAwesomeIcon icon={faFilePdf} />
        </div>
        <div
          onClick={() => exportPDFOrExcel(3)}
          className="flex gap-2 items-center text-[16px] text-white shadow-black shadow-sm py-[10px] px-[20px] bg-green-600 hover:bg-green-500 transition-all cursor-pointer rounded-md"
        >
          <p>Summary</p>
          <FontAwesomeIcon icon={faFileExcel} />
        </div>
      </div>
      {list.length ? (
        list.map((item) => {
          return (
            <div key={item._id}>
              {item.invoices ? (
                item.invoices.map((inv) => {
                  return (
                    <div
                      key={inv._id}
                      className="flex hover:bg-blue-200 p-2 gap-2 items-center flex-wrap justify-center transition-all mb-2 max-sm:text-[12px]  w-full bg-blue-300 border-[1px] border-blue-950 rounded-lg text-blue-950"
                    >
                      <h2 className="w-[150px] font-bold  max-sm:w-[100px] text-center">
                        {item.name}
                      </h2>
                      <div className="flex items-center text-[14px] max-sm:text-[11px] flex-2/3  justify-between ">
                        <p className="w-[15%] text-center">
                          {inv.items[0].partName}
                        </p>
                        <p className="w-[15%] text-center">
                          {inv.items[0].quantity}
                        </p>
                        <p className="w-[15%] text-center">
                          {inv.items[0].price}
                        </p>
                        <p className="w-[15%] text-center overflow-x-auto ">
                          {inv.date}
                        </p>
                        <p className="w-[15%] text-center text-green-600">
                          {inv.items[0].paidAmount}
                        </p>
                        <p className="w-[15%] text-center text-red-600">
                          {inv.items[0].remainingAmount}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div></div>
              )}
            </div>
          );
        })
      ) : (
        <p>No Invoices...</p>
      )}
    </div>
  );
}
