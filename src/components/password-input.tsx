"use client";

import { useState } from "react";
import { Input } from "./ui/input";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  password: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className="p-6 rounded-full placeholder:text-sm pr-16"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        {...props}
      />
      {String(password).length > 0 && (
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        >
          {visible ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
};

export default PasswordInput;
