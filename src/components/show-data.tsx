import { cn } from "@/lib/utils";

interface ShowDataProps<T> {
  className?: string;
  children: React.ReactNode;
  label: string;
  data: T[] | undefined;
}

const ShowData = <T,>({
  className,
  children,
  data,
  label,
}: ShowDataProps<T>) => {
  return (
    <>
      {data && data?.length <= 0 ? (
        <div
          className={cn(
            "w-full flex justify-center items-center py-6",
            className
          )}
        >
          <p>{label}</p>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default ShowData;
