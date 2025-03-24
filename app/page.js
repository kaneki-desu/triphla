'use client';

import Navbar from "@/components/Navbar";
import { SignedOut } from "@clerk/nextjs";
import Card from "@/components/cards";
import Typing from "@/components/typing";
import Image from "next/image";
import Link from "next/link";
import OutlineButton from "@/components/outlinebutton";
import Squares from "@/components/backgroundPaths";
import { TimelineDemo } from "@/components/time";
import BidirectionalSlider from "@/components/bidirectionalslider";

export default function Home() {
  const images = [
    { src: '/images/image1.jpg', alt: 'Image 1' },
    { src: '/images/image2.jpg', alt: 'Image 2' },
    { src: '/images/image3.jpg', alt: 'Image 3' },
    { src: '/images/image4.jpg', alt: 'Image 4' },
    { src: '/images/image5.jpg', alt: 'Image 5' },
    { src: '/images/image6.jpg', alt: 'Image 6' },
  ];

  return (
    

    <div>
      <div data-theme="coffee" className="relative overflow-hidden my-3 ml-3 h-[80vh] rounded-xl">
        <div className="absolute inset-0 z-0">
          <Squares />
        </div>

        <Navbar className="relative z-10 mb-10" />
        <main className="z-2 top-16 relative place-items-center">
          <div className="grid w-[70vw] h-1 place-items-center">
            <div className="leading-none h-[14vh] rounded-t-[3vw] rounded-b-[3vw]">
              <h1 className="text-7xl text-center">Your AI partner</h1>
            </div>
            <div className="leading-none -mt-3 h-[14vh] rounded-b-[2vw]">
              <h1 className="text-7xl text-center">for all things</h1>
            </div>
            <div className="leading-none -mt-3 h-[12vh] flex rounded-b-[2vw] justify-center">
              <div>
                <h1 className="text-7xl text-center">crypto</h1>
              </div>
              <Link href="/chat">
                <OutlineButton />
              </Link>
            </div>
          </div>
        </main>
      </div>


      <div className="w-screen">
          <h2 className="text-3xl font-bold text-center mb-4"></h2>
          <BidirectionalSlider images={images} />
        </div>
      <div className="flex gap-3 ml-3 mb-3">
        <div className="relative rounded-xl w-[45vw] h-[25.6vw] overflow-hidden">
          <Image
            src="/bitc.jpeg"
            alt="Dall"
            layout="fill"
            objectFit="cover"
            className="opacity-60"
          />
          <div className="absolute pl-16 right-0 w-[27.5vw] h-full">
            <span data-theme="coffee" className="mt-12 opacity-90 flex items-center justify-center w-10 h-10 rounded-full">
              <i className="ri-chat-ai-fill"></i>
            </span>
            <div className="pb-10">
              <Typing />
              <div data-theme="coffee" className="opacity-90 absolute text-xs flex items-center justify-between rounded-full mb-5 px-5 bottom-0 w-[18.5vw] h-[5vh]">
                LEARN MORE
                <Link href="/about">
                  <i className="ri-add-fill"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Card id="1" />
          <Card id="2" />
        </div>
      </div>
      <div className="absolute mb-3 mx-3 rounded-xl overflow-hidden">
        <TimelineDemo />
      </div>
    </div>
  );
}
