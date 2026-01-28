"use client";

import { useState, useEffect, Suspense } from "react";
import { createPortal } from "react-dom";
import GoogleSignInButton from "./GoogleSignInBtn";
import { useSearchParams } from "next/navigation";
import CredentialsForm from "./CredentialsForm";

function LoginModalContent({ children }) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.has("callbackUrl")) {
      setOpen(true);
    }
  }, [searchParams]);
  if (typeof window === "undefined") return null;
  return (
    <>
      {/* Trigger */}
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </span>

      {/* Portal Modal */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[9999]  flex items-center justify-center bg-black/50 animate-modal-in">
            <div className="w-full max-w-md rounded-xl text-black bg-white p-6 shadow-lg animate-modal-in">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Sign in</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-black cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Credentials */}
              <CredentialsForm/>

              {/* Divider */}
              <div className="my-4 flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-300" />
                <span className="text-sm text-gray-500">OR</span>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              {/* Google */}
              <GoogleSignInButton />
            </div>
          </div>,
          document.getElementById("modal-root")
        )}
    </>
  );
}

export default function LoginModal({ children }) {
  return (
    <Suspense fallback={<span className="cursor-pointer">{children}</span>}>
      <LoginModalContent>{children}</LoginModalContent>
    </Suspense>
  );
}
