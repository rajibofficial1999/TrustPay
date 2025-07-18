"use client";

import { deleteProfile } from "@/actions/profile";
import AppAlertDialog from "@/components/app-alert-dialog";
import CustomButton from "@/components/custom-button";
import { useAuthContext } from "@/contexts/auth-context";
import { parseErrors } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useState } from "react";
import PersonalnfoForm from "./_partials/personal-info-form";
import SetPasswordForm from "./_partials/set-password-form";

const MyAccount = () => {
  const { user, setAuthUser } = useAuthContext();
  const [error, setError] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState(false);

  const { mutate: handleDeleteProfile, isPending: isDeletingProfile } =
    useMutation({
      mutationFn: deleteProfile,
      onSuccess: async () => {
        setAuthUser({
          user: null,
          loading: false,
        });
        await signOut();
      },
      onError: (error: any) => {
        const message = parseErrors(error);
        setError(message);
      },
    });

  return (
    <>
      <div className="container mt-10 space-y-6">
        <div className="max-w-3xl lg:max-w-4xl bg-white w-full mx-auto py-10 px-6 sm:px-10 rounded-xl flex flex-col items-center text-foreground/80">
          <div className="w-full">
            <h1 className="text-xl font-bold">Personal Info</h1>
            <PersonalnfoForm user={user} />
          </div>
        </div>

        <div className="max-w-3xl lg:max-w-4xl bg-white w-full mx-auto py-10 px-6 sm:px-10 rounded-xl flex flex-col items-center text-foreground/80">
          <div className="w-full">
            <h1 className="text-xl font-bold">Set a password</h1>
            <SetPasswordForm />
          </div>
        </div>

        <div className="max-w-3xl lg:max-w-4xl bg-white w-full mx-auto py-10 px-6 sm:px-10 rounded-xl flex flex-col items-center text-foreground/80">
          <div className="w-full">
            <h1 className="text-xl font-bold">Delete your account</h1>
            <p className="mt-1">
              Your account, along with all associated data, and payout
              information, will be permanently deleted and cannot be restored.
            </p>
            {error && (
              <div className="mt-2 text-sm text-destructive/70">{error}</div>
            )}
            <div>
              <CustomButton
                processing={isDeletingProfile}
                className="mt-4 bg-destructive/70 hover:bg-destructive/80 text-white"
                onClick={() => setOpenConfirm(true)}
              >
                Delete my account
              </CustomButton>
            </div>
          </div>
        </div>
      </div>

      <AppAlertDialog
        open={openConfirm}
        setOpen={setOpenConfirm}
        onConfirm={() => handleDeleteProfile()}
        text="Are you sure you want to delete your account?"
        title="Delete Account"
        confirmButtonClassName="rounded-full !py-3"
        cancelButtonClassName="rounded-full !py-3"
        confrimProcessing={isDeletingProfile}
      />
    </>
  );
};

export default MyAccount;
