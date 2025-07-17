"use client";

import { deleteUser, getUsers } from "@/actions/user";
import AppAlertDialog from "@/components/app-alert-dialog";
import AppTable from "@/components/app-table";
import { Badge } from "@/components/ui/badge";

import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle, PenSquare, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const theads = ["Full name", "Email address", "User Role", "Action"];

const UserPage = () => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const [deleteableId, setDeleteableId] = useState<string | null>(null);

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast("User deleted successfully.");
      setOpenConfirm(false);
      setDeleteableId(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (error) {
    toast(error.message);
  }

  return (
    <>
      {isLoading ? (
        <div
          className="flex justify-center items-center"
          style={{ height: "calc(100vh - 100px)" }}
        >
          <LoaderCircle className="size-20 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center my-2">
            <div>
              <h1 className="text-xl font-semibold">Users</h1>
              <p className="text-sm text-gray-600">Manage all users here.</p>
            </div>
            <Link href="/admin/users/create" className={buttonVariants({})}>
              Create new user
            </Link>
          </div>
          <div className="border rounded-md mt-4">
            <ScrollArea>
              <AppTable theads={theads}>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="py-3 font-semibold">
                        {user?.fullName || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3">{user.email}</TableCell>
                      <TableCell className="py-3 capitalize">
                        <Badge
                          className={cn({
                            "bg-blue-500 text-white": user.role === "user",
                          })}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-3 space-x-2">
                        {user.role === "admin" && (
                          <Link
                            href={`/admin/users/${user._id}`}
                            className={buttonVariants({
                              className: "cursor-pointer",
                              variant: "outline",
                              size: "icon",
                            })}
                          >
                            <PenSquare className="size-4 text-blue-500" />
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => {
                            setOpenConfirm(true);
                            setDeleteableId(user._id);
                          }}
                        >
                          <Trash className="size-4 text-destructive/80" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={theads.length}
                      className="text-center py-6"
                    >
                      No user found.
                    </TableCell>
                  </TableRow>
                )}
              </AppTable>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <AppAlertDialog
            open={openConfirm}
            setOpen={setOpenConfirm}
            onConfirm={() => handleDelete(deleteableId!)}
            text="Are you sure you want to delete this method?"
            confrimProcessing={isDeleting}
          />
        </>
      )}
    </>
  );
};

export default UserPage;
