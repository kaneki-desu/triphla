"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";



export default function About() {
    const headingRef = useRef(null);
    const textRef = useRef(null);
    const statsRef = useRef([]);



    useEffect(() => {
        gsap.from(headingRef.current, { opacity: 0, y: -50, duration: 1, ease: "power3.out" });

        gsap.from(textRef.current, { opacity: 0, y: 50, duration: 1, delay: 0.5, ease: "power3.out" });


        statsRef.current.forEach((stat, index) => {

            gsap.from(stat, {

                opacity: 0,

                y: 30,

                duration: 1,

                delay: index * 0.3 + 1,

                ease: "power3.out",
            });



            gsap.to(stat.querySelector(".counter"), {

                innerText: stat.dataset.value,

                duration: 2,

                delay: index * 0.3 + 1,

                snap: { innerText: 1 },
                ease: "power3.out",

            });

        });

    }, []);



    return (

        <div className="min-h-screen w-screen bg-gradient-to-r from-black via-gray-900 to-[#C59F60] text-white overflow-auto">



            {/* Hero Section */}

            <section className="h-screen flex flex-col items-center justify-center text-center px-6">

                <h1 ref={headingRef} className="text-5xl font-bold max-w-4xl leading-tight">

                    Revolutionizing Financial Decisions with AI-Powered Conversations

                </h1>

                <p ref={textRef} className="text-gray-300 mt-4 max-w-2xl">

                    With millions of investors entering the market, AI is the only scalable solution. Our GenAI-based assistant helps individuals make informed financial decisions through natural conversations.

                </p>

            </section>



            {/* Story Section */}

            <section className="py-16 px-6 max-w-5xl mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>

                        <h2 className="text-3xl font-semibold">Our Mission</h2>

                        <p className="text-gray-300 mt-4">

                            We are building a cutting-edge AI-driven solution that enables users to discuss their financial needs in real-time and make data-backed decisions confidently.

                        </p>

                        <button className="mt-4 text-yellow-400 font-medium transition-transform transform hover:scale-105">Learn More ➜</button>

                    </div>

                    <div className="bg-gray-800 rounded-lg flex items-center justify-center h-48">

                        <span className="text-gray-400 text-lg">[ Video Placeholder ]</span>

                    </div>

                </div>

            </section>



            {/* Stats Section with Animations */}

            <section className="py-16 px-6 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">



                {/* AI-Powered Conversations */}

                <div ref={(el) => statsRef.current.push(el)} data-value="100" className="p-6 border border-gray-600 rounded-lg flex flex-col items-center">

                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">

                        <polygon points="10,90 50,10 90,90" stroke="yellow" strokeWidth="4" fill="none" />

                    </svg>

                    <h3 className="text-4xl font-bold text-yellow-400 mt-3 counter">0</h3>

                    <p className="text-gray-300">AI-driven user interactions</p>



                </div>

                {/* Data-Driven Insights */}

                <div ref={(el) => statsRef.current.push(el)} data-value="100" className="p-6 border border-gray-600 rounded-lg flex flex-col items-center">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">

                        <defs>

                            <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">

                                <circle cx="2" cy="2" r="2" fill="yellow" />

                            </pattern>

                        </defs>

                        <rect width="100" height="100" fill="url(#dots)" />

                    </svg>

                    <h3 className="text-4xl font-bold text-yellow-400 mt-3 counter">0</h3>

                    <p className="text-gray-300">Markets analyzed in real-time</p>

                </div>


                {/* User Satisfaction */}

                <div ref={(el) => statsRef.current.push(el)} data-value="98" className="p-6 border border-gray-600 rounded-lg flex flex-col items-center">

                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">

                        <polygon points="50,5 61,35 95,35 67,55 78,85 50,65 22,85 33,55 5,35 39,35" stroke="yellow" strokeWidth="4" fill="none" />

                    </svg>

                    <h3 className="text-4xl font-bold text-yellow-400 mt-3 counter">0</h3>

                    <p className="text-gray-300">User satisfaction rate</p>

                </div>

            </section>



            {/* Call to Action */}

            <div className="py-16 flex justify-center">

                <button className="bg-yellow-500 text-black px-8 py-4 rounded-full font-medium transition-transform transform hover:scale-110">

                    Start Your AI-Powered Journey ➜

                </button>

            </div>



        </div>

    );

}

