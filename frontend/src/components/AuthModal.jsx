import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { X } from "lucide-react";

const AuthModal = ({ isOpen, onClose, mode = "login" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === "login" ? "Welcome Back!" : "Join TestSAT"}
          </h2>
          <p className="text-gray-600">
            {mode === "login" 
              ? "Sign in to access your SAT practice tests" 
              : "Create your account to start practicing"
            }
          </p>
        </div>

        {/* Clerk Authentication Component */}
        <div className="flex justify-center">
          {mode === "login" ? (
            <SignIn 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-[#7a6ad8] hover:bg-[#6b5bc7] text-white border-0 rounded-full",
                  formButtonPrimary: "bg-[#7a6ad8] hover:bg-[#6b5bc7] text-white rounded-full",
                  footerActionLink: "text-[#7a6ad8] hover:text-[#6b5bc7]",
                  identityPreviewEditButton: "text-[#7a6ad8] hover:text-[#6b5bc7]",
                  formFieldInput: "rounded-lg border-gray-300 focus:border-[#7a6ad8] focus:ring-[#7a6ad8]",
                  dividerLine: "bg-gray-300",
                  dividerText: "text-gray-500"
                }
              }}
              redirectUrl="/"
            />
          ) : (
            <SignUp 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 w-full",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-[#7a6ad8] hover:bg-[#6b5bc7] text-white border-0 rounded-full",
                  formButtonPrimary: "bg-[#7a6ad8] hover:bg-[#6b5bc7] text-white rounded-full",
                  footerActionLink: "text-[#7a6ad8] hover:text-[#6b5bc7]",
                  identityPreviewEditButton: "text-[#7a6ad8] hover:text-[#6b5bc7]",
                  formFieldInput: "rounded-lg border-gray-300 focus:border-[#7a6ad8] focus:ring-[#7a6ad8]",
                  dividerLine: "bg-gray-300",
                  dividerText: "text-gray-500"
                }
              }}
              redirectUrl="/"
            />
          )}
        </div>

        {/* Switch Mode Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                // We'll handle mode switching in the parent component
                onClose();
              }}
              className="text-[#7a6ad8] hover:text-[#6b5bc7] font-semibold"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
