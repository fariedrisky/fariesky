import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setClosing(false);
      setAnimationComplete(false);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleAnimationComplete = useCallback(() => {
    if (!closing) {
      setAnimationComplete(true);
    }
  }, [closing]);

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{
              opacity: 1,
              backdropFilter: "blur(8px)",
              transition: { duration: 0.4 },
            }}
            exit={{
              opacity: 0,
              backdropFilter: "blur(0px)",
              transition: { duration: 0.3 },
            }}
            className="fixed inset-0 bg-black/10"
            onClick={handleClose}
          />

          <motion.div
            variants={modalVariants}
            initial="closed"
            animate={closing ? "closed" : "open"}
            exit="closed"
            onAnimationComplete={handleAnimationComplete}
            className="relative z-[101] mx-auto w-[90vw] max-w-4xl rounded-[30px] border bg-white px-8 pb-8 pt-12 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute right-6 top-6 z-10 rounded-full p-2 text-gray-500 transition-all duration-300 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close modal</span>
            </button>

            <div
              className={cn(
                "modal-scroll max-h-[calc(85vh-3rem)]",
                animationComplete ? "overflow-y-auto" : "overflow-hidden",
                "pr-2",
              )}
            >
              <motion.div
                variants={contentVariants}
                initial="closed"
                animate={closing ? "closed" : "open"}
                exit="closed"
              >
                {children}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!isMounted) return null;

  return createPortal(modalContent, document.body);
}

const modalVariants = {
  closed: {
    scale: 0.5,
    opacity: 0,
    rotateX: -15,
    transition: {
      type: "spring",
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  open: {
    scale: 1,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3,
    },
  },
} as const;

const contentVariants = {
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.4,
    },
  },
} as const;

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
