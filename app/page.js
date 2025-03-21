import Navbar from "@/components/Navbar";
import { SignedOut } from "@clerk/nextjs";
import Card from "@/components/cards";
import Typing from "@/components/typing";
import Image from "next/image";
import Link from "next/link";
import OutlineButton from "@/components/outlinebutton";

export default async function Home() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });

  return (
    <>
      <div data-theme="coffee" className="w-full rounded-xl">
        <Navbar />
        <main className="pt-10 place-items-center">

          <div className="pt-7 w-[50vw] h-[35vh] place-items-center">
            <div className="leading-none h-[12vh] rounded-t-[3vw] rounded-b-[3vw] w-[35vw]"><h1 className="text-6xl text-center">Your AI partner</h1></div>
            <div className="leading-none -mt-3 h-[12vh] rounded-b-[2vw] w-[30vw]"><h1 className="text-6xl text-center">for all things</h1></div>
            <div className="leading-none -mt-3 h-[12vh] flex w-[27vw] rounded-b-[2vw] justify-center">
              <div><h1 className="text-6xl text-center">crypto</h1></div>
              <Link href="/chat">
              <OutlineButton/>
              </Link>
              <SignedOut>
                <OutlineButton></OutlineButton>
              </SignedOut>
            </div>
            <div className="flex mt-[21.65vh]">
              <div className="relative mt-3 mb-3 mx-3 rounded-xl w-[45vw] h-[25.6vw] overflow-hidden">
                <Image
                  src="/bitc.jpeg"
                  alt="Dall"
                  layout="fill"
                  objectFit="cover"
                  className="opacity-60"
                />
                <div className="absolute pl-16 mr-1 right-0 w-[27.5vw] h-full">
                  <span
                    data-theme="coffee"
                    className="mt-12 opacity-90 flex items-center justify-center w-10 h-10 rounded-full"
                  >
                    <i className="ri-chat-ai-fill"></i>
                  </span>
                  <div className="pb-10">
                    <Typing></Typing>
                    <div
                      data-theme="coffee"
                      className="opacity-90 absolute text-xs flex items-center justify-between rounded-full mb-5 px-5 bottom-0 w-[18.5vw] h-[5vh]"
                    >
                      LEARN MORE
                      <Link href="/about">
                        <i className="ri-add-fill"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-3">
                <Card id="1" />
                <Card id="2" />
              </div>

            </div>
          </div>

        </main>
        
      </div>
      
    </>

  );
}
