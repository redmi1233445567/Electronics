"use client";
import Nav from "./component/Nav";
import Cookies from "js-cookie";
import img2 from "../image/pngwing.com (1).png";
import img1 from "../image/pngwing.com (2).png";
import img3 from "../image/pngwing.com (3).png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMobileScreen,
  faPerson,
  faScrewdriver,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const token = Cookies.get("authToken");
  const router = useRouter();
  const list = [
    { name: "Parts", img: faMobileScreen },
    { name: "Accessories", img: faScrewdriver },
    { name: "Technician", img: faPerson },
    { name: "Repair", img: faScrewdriverWrench },
  ];

  const goTo = (e) => {
    for (let i = 0; i < list.length; i++) {
      if (e == list[i].name) {
        router.push(`/${list[i].name.toLowerCase()}`);
      }
    }
  };

  return (
    <div className=" h-full relative w-full">
      <Nav />
      <section className="h-full ">
        <div className="h-full flex items-center justify-center flex-wrap pt-[100px] max-md:pt-[150px] gap-[20px]">
          {list.map((item, ind) => {
            return (
              <div
                key={ind}
                className="hover:scale-[110%] flex flex-col justify-around bg-white shadow transition-all cursor-pointer hover:shadow-lg rounded-2xl p-[20px] w-[250px] h-[300px]"
                onClick={() => goTo(item.name)}
              >
                <FontAwesomeIcon
                  className="text-[100px] text-blue-950"
                  icon={item.img}
                />
                <p className="text-center text-[28px] text-blue-600 font-bold">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
