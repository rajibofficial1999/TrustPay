"use client";

import { getPublicPaymentMethods } from "@/actions/payment_method";
import { useAuthContext } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star, WalletCards } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";

const HeroSection = () => {
  const { user } = useAuthContext();
  const [leftCards, setLeftCards] = useState<IPaymentMethod[]>([]);
  const [rightCards, setRightCards] = useState<IPaymentMethod[]>([]);

  const { data: paymentMethods } = useQuery<IPaymentMethod[]>({
    queryKey: ["publicPaymentMethods"],
    queryFn: getPublicPaymentMethods,
  });

  useEffect(() => {
    if (paymentMethods) {
      const leftCards = paymentMethods.slice(0, 3);
      const rightCards = paymentMethods.slice(3, 6);
      setLeftCards(leftCards);
      setRightCards(rightCards);
    }
  }, [paymentMethods]);

  return (
    <div className="flex flex-col items-center justify-center py-20 relative">
      {/* Floating Cards - Left */}
      <div className="absolute left-0 top-16 space-y-6 w-full h-full lg:flex flex-col items-start hidden">
        {leftCards.map((paymentMethod, index) => (
          <HeroCard
            key={paymentMethod._id}
            className={cn("", {
              "rotate-2 -ml-6": index === 0,
              "-rotate-8 ml-8 -mt-5": index === 1,
              "rotate-12 mr-12 mt-7 ": index === 2,
            })}
            title={paymentMethod.name}
            logo={paymentMethod.logo}
            text="3201"
            delay={
              index === 0 ? 0.1 : index === 1 ? 0.2 : index === 2 ? 0.4 : 0.6
            }
          />
        ))}
      </div>

      <div className="absolute right-0 top-16 space-y-6 w-full h-full lg:flex hidden flex-col items-end">
        {rightCards.map((paymentMethod, index) => (
          <HeroCard
            key={paymentMethod._id}
            className={cn("", {
              "rotate-12 mr-24": index === 0,
              "rotate-6 -mr-8 -mt-2": index === 1,
              "-rotate-10 mr-12 mt-5 ": index === 2,
            })}
            title={paymentMethod.name}
            logo={paymentMethod.logo}
            text="3201"
            delay={
              index === 0 ? 0.6 : index === 1 ? 0.7 : index === 2 ? 0.9 : 1
            }
          />
        ))}
      </div>

      {/* Main Hero Content */}
      <div className="container text-center">
        <div className="flex items-center gap-2 justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4.5 text-primary" />
          ))}
          <span className="ml-2">Loved by 10,000+ people</span>
        </div>

        <h1 className="sm:text-7xl text-5xl font-bold text-center mt-8">
          Hold Now, <br /> Release Later.
        </h1>
        <p className="mt-3 text-lg text-center">
          Avoid scams and fake deals. We act as a trusted third party — your
          money
          <br />
          stays safe until the item is delivered and verified.
        </p>

        <Link
          href="/make-payment"
          className={buttonVariants({
            className:
              "!rounded-full !p-6 sm:!p-8 mt-8 !font-bold text-lg sm:text-xl hover:scale-105 duration-200 relative z-50",
          })}
        >
          Make a Payment
        </Link>
        <p className="text-foreground/80 mt-3">
          Send & Receive with Confidence. Your Safety is Our Priority
        </p>
      </div>
    </div>
  );
};

const HeroCard = ({
  className,
  title,
  text,
  logo,
  delay,
}: {
  className?: string;
  title?: string;
  text: string;
  delay: number;
  logo: string | null | undefined;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay }}
      className={cn(
        "w-[220px] bg-white rounded-xl px-4 py-6 shadow-xl ring-1 ring-primary/10 backdrop-blur-sm relative z-40",
        className
      )}
    >
      <Link href="/make-payment" className="w-full h-full">
        <div className="flex flex-col items-center gap-3 mb-2">
          {logo ? (
            <img src={logo} alt="logo" className="size-8 rounded-full" />
          ) : (
            <WalletCards className="size-8 rounded-full" />
          )}
          <h2 className="font-bold text-sm">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          ❤️ {text} supporters
        </p>
      </Link>
    </motion.div>
  );
};

export default HeroSection;
