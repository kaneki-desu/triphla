import { SignInButton } from "@clerk/nextjs";
import "remixicon/fonts/remixicon.css";

export default function AnimatedLinkComponent() {
  const animatedLinkWrapper = {
    display: "inline-block",
    position: "relative",
    margin: "2vh",
  };

  const animatedLink = {
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    cursor: "pointer",
    width: "100%",
    minWidth: "11vw",
    outline: "2px solid transparent",
    outlineOffset: "2px",
    padding: "5px 10px",
    height: "3rem",
    borderRadius: "100px",
    background: "#170F16",
    color: "#fff",
  };

  const animatedLinkEffect = {
    pointerEvents: "none",
    borderRadius: "100px",
    width: "calc(100% - 1px)",
    height: "calc(100% - 1px)",
    position: "absolute",
    padding: "1px",
    WebkitMask: "linear-gradient(#C59F60 0 0) content-box, linear-gradient(#C59F60 0 0)",
    mask: "linear-gradient(#C59F60 0 0) content-box, linear-gradient(#C59F60 0 0)",
    WebkitMaskComposite: "exclude",
    maskComposite: "exclude",
    WebkitMaskComposite: "xor",
  };

  const animatedLinkEffectDiv = {
    backgroundImage:
      "conic-gradient(from 0 at 50% 50%, rgba(255, 255, 255, 0.5) 0deg, rgba(255, 255, 255, 0) 60deg, rgba(255, 255, 255, 0) 310deg, rgba(255, 255, 255, 0.5) 360deg)",
    position: "relative",
    left: "50%",
    top: "50%",
    WebkitTransform: "translate(-50%, -50%)",
    MozTransform: "translate(-50%, -50%)",
    MsTransform: "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)",
    width: "100%",
    animation: "rotate 2s linear infinite",
    aspectRatio: 1,
  };

  return (
    <>
      <style>
        {`
                @keyframes rotate {
                    from {
                        transform: translate(-50%, -50%) scale(1.4) rotate(0turn);
                    }
                    to {
                        transform: translate(-50%, -50%) scale(1.4) rotate(1turn);
                    }
                }
                `}
      </style>

      <SignInButton mode="modal">
        <div style={animatedLinkWrapper}>
          {/* Outer rotating outline */}
          <div style={animatedLinkEffect}>
            <div style={animatedLinkEffectDiv}></div>
          </div>

          {/* Inner button */}
          <div className="flex items-center gap-4"  style={animatedLink}>
              Get Started
            <span>
              <i className="ri-arrow-right-up-long-line"></i>
            </span>
          </div>
        </div>
      </SignInButton>
    </>
  );
}
