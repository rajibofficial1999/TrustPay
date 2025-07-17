import { CloudUploadIcon, X } from "lucide-react";
import { useRef } from "react";
import { Label } from "./ui/label";

interface FileInputProps extends React.HTMLAttributes<HTMLInputElement> {
  className?: string;
  name: string;
  placeholderText: string;
  previewImage?: string | null;
  handleRemove?: () => void;
}

const FileInput = ({
  className,
  name,
  placeholderText,
  previewImage,
  handleRemove,
  ...props
}: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      {previewImage ? (
        <div>
          <div className="max-w-58 mt-2 relative overflow-hidden">
            <img
              src={previewImage}
              className="w-full h-full object-cover rounded-md "
            />
            <button
              type="button"
              onClick={() => {
                handleRemove && handleRemove();
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
              className="absolute top-0 right-0 p-2 bg-white rounded-full cursor-pointer"
            >
              <X className="size-5 text-destructive" />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={name}
          className="bg-white text-slate-500 font-semibold text-base rounded-lg w-full h-24 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto"
        >
          <CloudUploadIcon className="size-8 text-slate-400" />
          {placeholderText}
          <input
            type="file"
            id={name}
            className="hidden"
            accept="image/*"
            {...props}
          />
          <p className="text-xs font-medium text-slate-400 mt-1">
            PNG, JPG, and JPEG are Allowed.
          </p>
        </label>
      )}
    </>
  );
};

export default FileInput;
