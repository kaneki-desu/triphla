"use client";
import { useState, useEffect } from "react";
import { CounterAPI } from "counterapi";
import Image from "next/image";
import Chatbot from "@/components/chatbot";

export default function Card({ id }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (id === "1") {
      const counter = new CounterAPI();
      counter.up("My Counter 01", true).then((response) => {
        console.log(response);
        setCount(response.Count);
      });
    }
  }, [id]);

  return (
    <div
      data-theme="coffee"
      className="relative rounded-xl w-[25.6vw] h-[25.6vw] overflow-hidden"
    >
      {id === "1" && (
        <div>
          <Image src="/gra2.jpeg" alt="Dall" layout="fill" objectFit="cover" />
          <div className="text-8xl font-light opacity-95 ml-3 mt-1">
            {count !== null ? `${count}+` : null}
          </div>
          <div className="absolute bottom-0 right-0 mb-3 mr-3 text-5xl font-light opacity-95">
            Site visits
          </div>
        </div>
      )}

      {id === "2" && <Chatbot />}
    </div>
  );
}
