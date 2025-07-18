"use client";

import { getPaymentMethods } from "@/actions/payment_method";
import CustomButton from "@/components/custom-button";
import PaymentForm from "@/components/payment-form";
import PaymentTable from "@/components/payment-table";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Loader, MoveRight, WalletCards } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SendMoneyPage = () => {
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<IPaymentMethod | null>(null);
  const [loadingMethodInfo, setLoadingMethodInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const searchParams = useSearchParams();
  const method = searchParams.get("method");

  const router = useRouter();

  const { data, error } = useQuery<IPaymentMethod[]>({
    queryKey: ["paymentMethods"],
    queryFn: getPaymentMethods,
  });

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleMethodChange = (value: string) => {
    setLoadingMethodInfo(true);
    const findedPaymentMethod = paymentMethods.find(
      (paymentMethod) => paymentMethod._id === value
    );

    if (!findedPaymentMethod) {
      return;
    }

    setSelectedPaymentMethod(findedPaymentMethod);
  };

  const isLink = (key: string) => key.startsWith("https://");
  const isEmail = (key: string) => {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(key);
  };
  const isPhoneNumber = (key: string) => {
    const regex =
      /^\+?([0-9]{1,3})?[-. (]*([0-9]{3})[-. )]*[0-9]{3}[-. ]*[0-9]{4}$/;
    return regex.test(key);
  };

  if (error) {
    toast(error.message);
  }

  const filterMessage = (by: string) => {
    return `Please use the ${by} provided below to send your payment via ${selectedPaymentMethod?.name}. Make sure the payment is sent correctly to avoid delays.`;
  };

  const styledDescription = (description: string) => {
    return description.replace(/(<p>.*?Note:.*?<\/p>)/gi, (match) =>
      match.replace(/<p>/, `<p style="color: #e74c3c; font-style: italic;">`)
    );
  };

  useEffect(() => {
    if (data) {
      const fldata = data.filter((paymentMethod) => paymentMethod.isShow);
      setPaymentMethods(fldata);
    }
  }, [data]);

  useEffect(() => {
    if (loadingMethodInfo) {
      setTimeout(() => {
        setLoadingMethodInfo(false);
        setIsButtonDisabled(false);
      }, 2000);
    }
  }, [loadingMethodInfo]);

  return (
    <div className="container">
      <div className="max-w-3xl mt-10 lg:max-w-4xl bg-white w-full mx-auto py-10 px-6 sm:px-10 rounded-xl flex flex-col items-center text-foreground/80">
        <h3 className="font-semibold uppercase">Pay now!</h3>

        <p className="text-center mt-2">
          Choose Your Preferred Payment Method – Fast, <br />
          Secure & Always Protected.
        </p>
        {!method ? (
          <div className="w-full mt-6">
            <div className="w-full">
              <Label htmlFor="email" className="mb-2">
                Select a payment method
              </Label>

              <Select onValueChange={(value) => handleMethodChange(value)}>
                <SelectTrigger className="w-full rounded-full p-6 focus:!border-primary focus:ring-1 focus:ring-primary">
                  <SelectValue placeholder="Payment methods" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((paymentMethod) => (
                    <SelectItem
                      key={paymentMethod._id}
                      value={paymentMethod._id}
                    >
                      {paymentMethod.logo ? (
                        <img
                          src={paymentMethod.logo}
                          alt="logo"
                          className="size-5"
                        />
                      ) : (
                        <WalletCards className="size-5" />
                      )}
                      <span>{paymentMethod.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {loadingMethodInfo ? (
              <div className="w-full mt-6 flex justify-center items-center flex-col">
                <Loader className="animate-spin" />
                <span className="text-sm text-foreground/70">
                  Generating payment details...
                </span>
              </div>
            ) : (
              selectedPaymentMethod && (
                <div className="w-full mt-6 bg-green-50 border border-green-200 rounded-md p-4">
                  <h3 className="font-bold uppercase text-foreground/70">
                    Payment details:
                  </h3>
                  <ul className="space-y-2 mt-2">
                    <li className="text-foreground/70">
                      {isLink(selectedPaymentMethod.paymentKey)
                        ? filterMessage("link")
                        : isEmail(selectedPaymentMethod.paymentKey)
                        ? filterMessage("email")
                        : isPhoneNumber(selectedPaymentMethod.paymentKey)
                        ? filterMessage("phone number")
                        : filterMessage("tag")}
                    </li>
                    <li className="text-center mt-5 mb-3">
                      {isLink(selectedPaymentMethod.paymentKey) ? (
                        <a
                          className="text-primary border border-primary w-[230px] py-1.5 rounded-full text-sm font-semibold inline-block"
                          href={selectedPaymentMethod.paymentKey}
                        >
                          Click here to pay
                        </a>
                      ) : (
                        <button
                          className="text-primary border border-primary py-1.5 rounded-full text-sm font-semibold cursor-pointer w-[230px]"
                          onClick={() =>
                            handleCopy(selectedPaymentMethod.paymentKey)
                          }
                        >
                          {!copied && isEmail(selectedPaymentMethod.paymentKey)
                            ? "Click here to copy the email"
                            : !copied &&
                              isPhoneNumber(selectedPaymentMethod.paymentKey)
                            ? "Click here to copy the number"
                            : copied
                            ? "Copied!"
                            : "Click here to copy the tag"}
                        </button>
                      )}
                    </li>
                  </ul>
                  <div className="payment-method-description mt-5">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: styledDescription(
                          selectedPaymentMethod?.description || ""
                        ),
                      }}
                    />
                  </div>
                </div>
              )
            )}
            <CustomButton
              type="button"
              disabled={isButtonDisabled || processing}
              processing={processing}
              onClick={() => {
                if (selectedPaymentMethod) {
                  setProcessing(true);
                  setTimeout(() => {
                    router.push(
                      `/send-money?method=${selectedPaymentMethod._id}`
                    );
                    setProcessing(false);
                  }, 2000);
                }
              }}
            >
              <span>Next, If paid</span> <MoveRight className="size-4" />
            </CustomButton>
          </div>
        ) : (
          <PaymentForm method={method} />
        )}
      </div>

      <div className="max-w-3xl lg:max-w-4xl bg-white w-full mx-auto py-10 px-6 sm:px-10 rounded-xl flex flex-col items-center text-foreground/80 mt-10">
        <PaymentTable isLimited={true} />
      </div>
    </div>
  );
};

export default SendMoneyPage;
