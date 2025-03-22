export default function Loading() {
    return (
        <>
            <style>
                {`
                    @keyframes pulse {
                        0% {
                            transform: scale(0.95);
                            box-shadow: 0 0 0 0 rgba(222, 84, 72, 0.7);
                        }

                        70% {
                            transform: scale(1);
                            box-shadow: 0 0 0 15px rgba(222, 84, 72, 0);
                        }

                        100% {
                            transform: scale(0.95);
                            box-shadow: 0 0 0 0 rgba(222, 84, 72, 0);
                        }
                    }       
                `}
            </style>
            <div
                style={{
                    minWidth: "100vw",
                    minHeight: "100vh", // Full viewport height to center vertically
                    display: "flex", // Flexbox for centering
                    alignItems: "center", // Center vertically
                    justifyContent: "center", // Center horizontally
                }}
            >
                <div
                    style={{
                        background: "rgb(222, 84, 72)", // Background color
                        borderRadius: "50%", // Circular shape
                        height: "30px",
                        width: "30px",
                        boxShadow: "0 0 0 0 rgba(222, 84, 72, 1)", // Initial box shadow
                        transform: "scale(1)", // Initial scale
                        animation: "pulse 2s infinite", // Pulse animation
                    }}
                ></div>
            </div>
        </>
    );
}