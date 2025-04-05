import axios from "axios"; // Keep axios if other parts need it, or remove if unused after changes.
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
import { Newspaper } from "lucide-react";
// Removed useState and useEffect

const NEWS_API= process.VITE_NEWS_API || "https://triphla-yv9t.onrender.com/api/stock-news";
async function fetchNews() {
  try {
    // Using fetch API for server-side fetching and revalidation (ISR)
    const response = await fetch(NEWS_API, {
      method: 'POST', // Assuming POST is required as per original code
      headers: {
        'Content-Type': 'application/json', // Add headers if needed by the API
      },
      // Add body if the POST request needs data: body: JSON.stringify({ key: 'value' })
      next: { revalidate: 3600 } // Revalidate every hour (3600 seconds)
    });

    if (!response.ok) {
      // Log detailed error for server-side debugging
      console.error(`Error fetching stock news: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error body:", errorBody);
      return null; // Return null or throw an error
    }
    const newsData = await response.json();
    console.log(newsData);
    return newsData;
  } catch (error) {
    console.error("Error fetching stock news:", error);
    return null; // Return null or handle error appropriately
  }
}

export default async function Home() {
  const news = await fetchNews(); // Fetch data on the server
  const newsArr= JSON.parse(news); // Parse the news data
  console.log("Parsed news data:", typeof(newsArr)); // Log the parsed data
  const images = [
    { src: '/images/image1.jpg', alt: 'Image 1' },
    { src: '/images/image2.jpg', alt: 'Image 2' },
    { src: '/images/image3.jpg', alt: 'Image 3' },
    { src: '/images/image4.jpg', alt: 'Image 4' },
    { src: '/images/image5.jpg', alt: 'Image 5' },
    { src: '/images/image6.jpg', alt: 'Image 6' },
  ];

  return (
    

    <div className="w-full">
      <div data-theme="coffee" className="relative overflow-hidden  h-[80vh] rounded-xl">
        <div className="absolute inset-0 z-0">
          <Squares />
        </div>
      
        {/* <StockNews/> This will fetch and log the stock news */}
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
              <Link href="/interface">
                <OutlineButton />
              </Link>
            </div>
          </div>
        </main>
      </div>


      <div className="w-full">
          <h2 className="text-3xl font-bold text-center mb-4">Latest News</h2> {/* Added a title */}
          {/* Pass fetched news data to the slider */}
          {/*news ? <BidirectionalSlider news={news} /> : <p>Loading news...</p>*/}
          {/* If BidirectionalSlider also needs images, pass them too */}
          <BidirectionalSlider images={images} news={newsArr} />
        </div>
      {/* <div className="flex gap-3  mb-3">
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
      </div> */}
      {/* <div className="absolute mb-3 mx-3 rounded-xl overflow-hidden"> */}
        <TimelineDemo />
      {/* </div> */}
    </div>
  );
}
