"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

// Context
const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  return <ModalContext.Provider value={{ open, setOpen }}>{children}</ModalContext.Provider>;
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};

// Modal wrapper
export const Modal = ({ children }) => <ModalProvider>{children}</ModalProvider>;

export const ModalTrigger = ({ children, className }) => {
  const { setOpen } = useModal();
  return (
    <button onClick={() => setOpen(true)} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  );
};

export const ModalBody = ({ children, className }) => {
  const { open, setOpen } = useModal();
  const modalRef = useRef(null);

  useOutsideClick(modalRef, () => setOpen(false));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <Overlay />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.5, rotateX: 40, y: 40 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 15 }}
            className={cn(
              "bg-white dark:bg-neutral-950 md:rounded-2xl p-6 max-w-3xl w-full mx-4 relative z-50",
              className
            )}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ModalContent = ({ children, className }) => (
  <div className={cn("flex flex-col flex-1", className)}>{children}</div>
);

export const ModalFooter = ({ children, className }) => (
  <div className={cn("flex justify-end p-4 bg-gray-100 dark:bg-neutral-900", className)}>
    {children}
  </div>
);

// Close button
const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button onClick={() => setOpen(false)} className="absolute top-4 right-4">
      <svg className="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" strokeWidth="2"
        viewBox="0 0 24 24">
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};

// Blur overlay
const Overlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
    className="fixed inset-0 z-40"
  />
);

// Detect clicks outside modal
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback(e);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [ref, callback]);
};
