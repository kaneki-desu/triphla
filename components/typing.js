export default function Typing() {
    return (
        <>
            <style>
                {`
                @keyframes typing {
                    from {
                        width: 0;
                    }
                }

                @keyframes blink {
                    50% {
                        border-color: transparent;
                    }
                }

                @keyframes show {
                    from {
                        visibility: hidden;
                    }
                    to {
                        visibility: visible;
                    }
                }
                `}
            </style>
            <div
                data-theme="coffee"
                className="mt-6 pt-1 opacity-90 rounded-2xl w-[18.5vw] h-[11vh] grid pl-5 overflow-hidden"
            >
                <div
                    style={{
                        width: "22ch",
                        animation: "typing 2s steps(22), blink 0.5s step-end infinite alternate, show 0s 0s forwards",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        borderRight: "3px solid",
                        fontSize: "2em",
                        visibility: "hidden",
                    }}
                >
                    <h1 className="mb-1 text-xl">AI-powered platform</h1>
                </div>
                <div
                    style={{
                        width: "30ch",
                        animation: "typing 2s steps(30) 2s forwards, blink 0.5s step-end infinite alternate, show 0s 2s forwards",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        borderRight: "3px solid",
                        fontSize: "2em",
                        visibility: "hidden",
                    }}
                >
                    <h1 className="mb-1 text-xl">for investing in crypto.</h1>
                </div>
            </div>
        </>
    );
}