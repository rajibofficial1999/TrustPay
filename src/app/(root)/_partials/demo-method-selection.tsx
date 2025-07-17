import { Label } from "@/components/ui/label";
import { ChevronDown, MoveRight } from "lucide-react";

const DemoMethodSelection = () => {
  return (
    <div className="px-5 lg:py-14 py-5 shadow-lg rounded-xl bg-white ring-1 ring-primary/10 backdrop-blur-sm w-full relative">
      <h3 className="font-semibold uppercase text-center">Pay now!</h3>

      <p className="text-center mt-2 text-sm">
        Choose Your Preferred Payment Method – Fast, <br />
        Secure & Always Protected.
      </p>

      <div className="w-full mt-6">
        <div className="w-full">
          <Label htmlFor="email" className="mb-2">
            Select a payment method
          </Label>

          <div className="w-full rounded-full py-2.5 px-5 border text-left text-sm relative">
            <div className="flex items-center gap-2">
              <img src="/images/paypal.png" alt="paypal" className="size-4" />
              <span>PayPal</span>
            </div>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4" />
          </div>
        </div>

        <div className="w-full mt-6 bg-green-50 border border-green-200 rounded-md p-4">
          <h3 className="font-bold uppercase text-foreground/70 text-left">
            Payment details:
          </h3>
          <ul className="space-y-2 mt-2 text-left">
            <li className="text-foreground/70 text-sm">
              Please use the email address provided below to send your payment
              via PayPal. Make sure the payment is sent correctly to avoid
              delays.
            </li>
            <li className="mt-5 mb-3">
              <div className="text-primary border border-primary py-1.5 rounded-full text-sm font-semibold w-[230px] text-center mx-auto">
                Click here to copy the email
              </div>
            </li>
          </ul>
          <div className="text-left text-sm text-foreground/70">
            Copy the email address and complete your payment securely through
            PayPal.
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary mt-2">
          <span>Next, If paid</span> <MoveRight className="size-4" />
        </div>
      </div>

      <div className="absolute w-52 p-2 bg-white rounded-md ring-1 ring-primary/10 shadow-lg top-40 -right-8 md:-right-20 z-20 text-left text-sm">
        💹 Ideal for the payment method selection section
      </div>

      <div className="absolute size-14 bg-white rounded-full ring-1 ring-primary/10 shadow-lg flex justify-center items-center text-2xl top-6 -left-5">
        💯
      </div>
    </div>
  );
};

export default DemoMethodSelection;
