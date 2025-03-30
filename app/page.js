"use client";
import Nav from "./component/Nav";
import Cookies from "js-cookie";
import img2 from "../image/pngwing.com (1).png";
import img1 from "../image/pngwing.com (2).png";
import img3 from "../image/pngwing.com (3).png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const token = Cookies.get("authToken");
  const router = useRouter();
  const list = [
    { name: "Parts", img: img2 },
    { name: "Accessories", img: img1 },
    { name: "Technician", img: img3 },
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
                className="hover:scale-[110%] bg-white shadow transition-all cursor-pointer hover:shadow-lg rounded-2xl"
                onClick={() => goTo(item.name)}
              >
                <Image
                  src={item.img}
                  alt="Picture of the author"
                  className="w-[300px] h-[350px]"
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
