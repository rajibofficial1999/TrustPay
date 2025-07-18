import { Label } from "@/components/ui/label";
import { CloudUploadIcon } from "lucide-react";

const DemoPaymentForm = () => {
  return (
    <div className="p-5 shadow-lg rounded-xl bg-white ring-1 ring-primary/10 backdrop-blur-sm w-full relative">
      <h3 className="font-semibold uppercase text-center">Pay now!</h3>

      <p className="text-center mt-2 text-sm">
        Choose Your Preferred Payment Method. Fast, <br />
        Secure & Always Protected.
      </p>

      <div className="w-full mt-6 space-y-2">
        <div className="w-full">
          <Label htmlFor="email" className="mb-2">
            Amount
          </Label>
          <div className="w-full rounded-full py-2.5 px-5 border text-left text-sm relative">
            Enter amount
          </div>
        </div>
        <div className="w-full">
          <Label htmlFor="email" className="mb-2">
            Receiver account
          </Label>
          <div className="w-full rounded-full py-2.5 px-5 border text-left text-sm relative">
            Email, Phone number or Tag
          </div>
        </div>
        <div className="w-full">
          <Label htmlFor="email" className="mb-2">
            Account holder name
          </Label>
          <div className="w-full rounded-full py-2.5 px-5 border text-left text-sm relative">
            Enter account holder name
          </div>
        </div>
        <div className="w-full">
          <Label htmlFor="email" className="mb-2">
            Phone number
          </Label>
          <div className="w-full rounded-full py-2.5 px-5 border text-left text-sm relative">
            Enter your phone number
          </div>
        </div>

        <div className="w-full">
          <Label htmlFor="email" className="mb-2">
            Phone number
          </Label>
          <div className="bg-white text-slate-500 font-semibold text-base rounded-lg w-full h-20 flex flex-col items-center justify-center  border-2 border-gray-300 border-dashed mx-auto">
            <CloudUploadIcon className="size-8 text-slate-400" />
            Upload screenshots
            <p className="text-xs font-medium text-slate-400 mt-1">
              PNG, JPG, and JPEG are Allowed.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary mt-2">
          Submit
        </div>
      </div>

      <div className="absolute size-14 bg-white rounded-full ring-1 ring-primary/10 shadow-lg flex justify-center items-center text-2xl -top-3 -right-5">
        💳
      </div>

      <div className="absolute w-52 p-2 bg-white rounded-md ring-1 ring-primary/10 shadow-lg bottom-24 -left-8 md:-left-18  text-left text-sm">
        💯 Emphasizes speed + security for the "Pay Now" section
      </div>
    </div>
  );
};

export default DemoPaymentForm;
