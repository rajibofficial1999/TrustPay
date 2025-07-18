"use client";

import HeroSection from "@/components/hero-section";
import { Label } from "@/components/ui/label";
import { useScrollContext } from "@/contexts/scroll-context";
import {
  CheckCircle,
  ChevronDown,
  CloudUploadIcon,
  MoveDown,
  MoveRight,
} from "lucide-react";
import { useEffect } from "react";
import DemoMethodSelection from "./_partials/demo-method-selection";
import DemoPaymentForm from "./_partials/demo-payment-form";

const HomePage = () => {
  const { handleSetScroll } = useScrollContext();
  const handleScroll = () => {
    handleSetScroll(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <HeroSection />
      <div className="sm:py-20 container">
        <div className="max-w-4xl lg:max-w-5xl bg-white w-full mx-auto py-6 px-6 sm:px-10 rounded-xl flex flex-col items-center text-foreground/80 text-start sm:text-center">
          <h3 className="font-semibold uppercase">How!</h3>
          <h1 className="text-3xl sm:text-6xl font-bold mt-2">
            The Secure Way to Send & Receive Payments
          </h1>
          <p className="mt-3">
            Where Trust Meets Payment Secure, Simple, and Seamless Payments
            Every Time.
          </p>

          <div className="flex justify-between items-center mt-10 gap-2 flex-col md:flex-row">
            <DemoMethodSelection />
            <div>
              <MoveRight className="size-7 text-foreground/70 hidden md:inline-block" />
              <MoveDown className="size-7 text-foreground/70 md:hidden inline-block" />
            </div>
            <DemoPaymentForm />
          </div>
        </div>

        <div className="py-10 max-w-4xl lg:max-w-5xl w-full mx-auto px-6 sm:px-10 text-foreground/80">
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-left md:text-center w-full">
            How We Keep Your Money Safe
          </h1>
          <ul className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-10">
            <li className="flex gap-4">
              <div>
                <CheckCircle className="size-8 mt-1" />
              </div>
              <p className="text-left text-xl">
                Funds are held securely until the buyer confirms they’ve
                received what they paid for. No early releases. No risk.
              </p>
            </li>
            <li className="flex gap-4">
              <div>
                <CheckCircle className="size-8 mt-1" />
              </div>
              <p className="text-left text-xl">
                Got a problem? We step in to help resolve disputes fairly and
                fast, protecting both sides.
              </p>
            </li>
            <li className="flex gap-4">
              <div>
                <CheckCircle className="size-8 mt-1" />
              </div>
              <p className="text-left text-xl">
                Send and receive secure payments globally. All you need is an
                internet connection and an email address.
              </p>
            </li>
            <li className="flex gap-4">
              <div>
                <CheckCircle className="size-8 mt-1" />
              </div>
              <p className="text-left text-xl">
                We monitor all payments and user behavior to catch suspicious
                activity before it becomes a problem.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
