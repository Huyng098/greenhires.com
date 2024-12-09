"use client";
import { Loading } from "@/components/Common/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  isPending: boolean;
  handlePaymentToken: () => void;
}
export const BindingTokenScreen = ({
  open,
  setOpen,
  isPending,
  handlePaymentToken,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ZaloPay Wallet</DialogTitle>
          {!isPending ? (
            <div className="text-sm">
              <p>
                Your ZaloPay is binding with Humantree, Humantree is allowed:
              </p>
              <div className="ml-3">
                <ul>
                  <li>Access your identifier on ZaloPay.</li>
                  <li>Fund back, money transfer to your ZaloPay wallet.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Loading color="#C8C8C8" />
              <p>Processing...</p>
            </div>
          )}
        </DialogHeader>
        {!isPending && (
          <DialogFooter>
            <Button
              onClick={() => handlePaymentToken()}
              className="bg-primary-main"
            >
              Pay
            </Button>
            <Button onClick={() => setOpen(false)} className="bg-red-500">
              Cancel
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
