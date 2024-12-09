"use client";
import { BlogDto } from "@/interfaces/blog";
import {
  useDeleteBlogById,
  useUpdateStatusComment,
} from "@/services/blog/query";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import parse from "html-react-parser";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import * as NProgcess from "nprogress";
import { useState } from "react";
import DialogConfirm from "../Consultant/DialogConfirm";
interface Props {
  detail: BlogDto;
}
const TextEditor = dynamic(() => import("@/components/CKEditor"), {
  ssr: false,
});
const ReviewBlog = ({ detail }: Props) => {
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const router = useRouter();
  const [commentReview, setCommentReview] = useState<string>("");
  const { deleteBlogById } = useDeleteBlogById();
  const { updateStatusBlogCmt } = useUpdateStatusComment();
  const handleChangeState = async (
    type: "pending" | "waiting" | "approved" | "rejected"
  ) => {
    if (type == "approved" || type == "rejected") {
      const formDataComment = { status: type, comment: commentReview };
      await updateStatusBlogCmt({ blogId: detail.id, data: formDataComment });
    }
    NProgcess.start();
    router.push("/admin/blogs/review");
  };
  return (
    <Box className="m-[60px] mt-20 flex flex-col w-full">
      <Typography
        sx={{
          mb: "32px",
          fontSize: "36px",
          lineHeight: "40px",
          fontWeight: 700,
        }}
      >
        Review
      </Typography>
      <Paper sx={{ p: "60px" }}>
        <Box display={"flex"} flexDirection={"column"}>
          <img src={detail.banner} alt="" width={"100%"} />
          <Typography
            sx={{
              my: "32px",
              fontSize: "24px",
              lineHeight: "40px",
              fontWeight: 700,
            }}
          >
            {parse(detail?.title)}
          </Typography>
          <Box>
            <TextEditor noEdit initialData={detail.content} readonly={true} />
          </Box>
        </Box>
        <Box display={"flex"} flexDirection={"column"} alignItems={"end"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            my={"20px"}
            fontSize={"12px"}
          >
            <Box>
              Created on {dayjs(detail.created_at).format("MMMM DD, YYYY")}
            </Box>
            <Box
              sx={{
                bgcolor: "gray",
                height: "6px",
                width: "6px",
                borderRadius: "50%",
                mx: "10px",
              }}
            ></Box>
            <Box>{detail.author_name}</Box>
          </Box>
          <Box
            sx={{
              bgcolor: "#E1F9E0",
              color: "#098C36",
              p: "4px 10px",
              fontSize: "12px",
              borderRadius: "4px",
            }}
          >
            {detail.category_name}
          </Box>
        </Box>
      </Paper>
      <Typography
        sx={{
          mb: "32px",
          fontSize: "24px",
          lineHeight: "40px",
          fontWeight: 700,
          mt: "20px",
        }}
      >
        Comment
      </Typography>
      <Paper sx={{ p: "40px" }}>
        <TextField
          id="filled-basic"
          placeholder={`Write your comment here...`}
          variant="filled"
          onChange={(e) => setCommentReview(e.target.value)}
          fullWidth
          value={commentReview}
          multiline={true}
          rows={6}
          InputProps={{ sx: { input: { p: "10px" }, p: "10px" } }}
        />
      </Paper>
      <Box display={"flex"} justifyContent={"center"} gap={5} mt={"20px"}>
        <Button
          sx={{
            color: "white",
            fontSize: "18px",
            fontWeight: 500,
            px: "20px",
            py: "10px",
            textTransform: "none",
            bgcolor: "#06B2B9",
            "&:hover": {
              bgcolor: "#06B2B9",
              color: "white",
            },
          }}
          onClick={() => handleChangeState("approved")}
        >
          Public
        </Button>
        <Button
          sx={{
            color: "white",
            fontSize: "18px",
            fontWeight: 500,
            px: "20px",
            py: "10px",
            textTransform: "none",
            bgcolor: "#8BAFD8",
            "&:hover": {
              bgcolor: "#8BAFD8",
              color: "white",
            },
          }}
          onClick={() => handleChangeState("rejected")}
        >
          Reject
        </Button>
        <Button
          sx={{
            color: "white",
            fontSize: "18px",
            fontWeight: 500,
            px: "20px",
            py: "10px",
            textTransform: "none",
            bgcolor: "#d33d3da8",
            "&:hover": {
              bgcolor: "#d33d3da8",
              color: "white",
            },
          }}
          onClick={() => setOpenDialogDelete(true)}
        >
          Delete
        </Button>
        <DialogConfirm
          handleDelete={() => {
            deleteBlogById(detail?.id);
            NProgcess.start();
            router.push("/admin/my-blogs");
          }}
          open={openDialogDelete}
          handleClose={() => setOpenDialogDelete(false)}
          content={"Do you want to delete this blog?"}
          textCancel={"Cancel"}
          textOk={"Delete"}
        />
      </Box>
    </Box>
  );
};

export default ReviewBlog;
