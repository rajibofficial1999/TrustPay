import { AlertCircleIcon } from "lucide-react";

interface ErrorMessageProps {
  error: any;
  label: string;
}

const ErrorMessage = ({ error, label }: ErrorMessageProps) => {
  if (!error?.[label]) return null;

  return (
    <div className="flex items-center w-full gap-2 mt-2">
      <AlertCircleIcon className="size-4 text-destructive/90" />
      <p className="text-sm text-destructive/90">{error[label].message}</p>
    </div>
  );
};

export default ErrorMessage;
