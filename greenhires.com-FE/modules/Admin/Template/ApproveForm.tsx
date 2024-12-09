"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useChangeSampleStatus,
  useDeleteSample,
} from "@/services/sample/query";
import humanizeString from "humanize-string";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  type: string;
  sample_id: string;
}
const ActionDialog = dynamic(
  () =>
    import("@/components/Common/GeneralDialog").then(
      (module) => module.GeneralDialog
    ),
  { ssr: false }
);

export default function ApproveForm({ sample_id, type }: Props) {
  const [adcomment, setComment] = useState("");
  const router = useRouter();
  const [openApproved, setOpenApproved] = useState<boolean>(false);
  const [openRejected, setOpenRejected] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const { changeSampleStatus } = useChangeSampleStatus();
  const { deleteSampleById } = useDeleteSample();
  const updateStatus = async (status: string) => {
    await changeSampleStatus({
      id: sample_id,
      status: status,
      comment: adcomment,
    });
    if (status === "deleted") {
      setOpenDelete(false);
    } else if (status === "rejected") {
      setOpenRejected(false);
    } else {
      setOpenApproved(false);
    }
    router.push("/admin/samples/review");
  };
  return (
    <>
      <div className="flex flex-col gap-8 mt-10">
        <p className="font-bold text-lg ">Comment</p>
        <Textarea
          name="comment"
          onChange={(e) => setComment(e.target.value)}
          value={adcomment}
          placeholder={`Write your comment about Kelvin's ${humanizeString(
            type
          )} here`}
          className="bg-white focus-visible:ring-0 focus-visible:ring-offset-0 px-10 py-6"
          rows={8}
        />
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => setOpenApproved(true)}
            className="text-md px-6 py-4 bg-secondary-main hover:bg-primary-main/85"
          >
            Public
          </Button>
          <Button
            onClick={() => setOpenRejected(true)}
            className="text-md px-6 py-4 bg-primary-main hover:bg-primary-main/85"
          >
            Reject
          </Button>
          <Button
            onClick={() => setOpenDelete(true)}
            className="text-md px-6 py-4 bg-red-500 hover:bg-primary-main/85"
          >
            Delete
          </Button>
        </div>
      </div>
      <ActionDialog
        open={openApproved}
        setOpen={setOpenApproved}
        title={`Approve ${humanizeString(type)}`}
        description={`Are you sure you want to approve this ${humanizeString(type)}?`}
        cancelText="Cancel"
        confirmText="Public"
        confirmButtonColor="bg-secondary-main"
        handleConfirm={() => updateStatus("approved")}
      />
      <ActionDialog
        open={openRejected}
        setOpen={setOpenRejected}
        title={`Reject ${humanizeString(type)}`}
        description={`Are you sure you want to reject this ${humanizeString(type)}?`}
        cancelText="Cancel"
        confirmText="Reject"
        confirmButtonColor="bg-primary-main"
        handleConfirm={() => updateStatus("rejected")}
      />
      <ActionDialog
        open={openDelete}
        setOpen={setOpenDelete}
        title={`Delete ${humanizeString(type)}`}
        description={`Are you sure you want to delete this ${humanizeString(type)}?`}
        cancelText="Cancel"
        confirmText="Delete"
        confirmButtonColor="bg-red-500"
        handleConfirm={() => deleteSampleById(sample_id)}
      />
    </>
  );
}
