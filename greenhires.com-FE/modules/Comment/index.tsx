import { BlogDto, CommentDto } from "@/interfaces/blog";
import { editComment } from "@/services/blog/api";
import {
  useAddComment,
  useGetChildComments,
  useGetParentComments,
} from "@/services/blog/query";
import { useAuthStore } from "@/stores/auth";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "sonner";
dayjs.extend(relativeTime);

interface CommentProps {
  comment: CommentDto;
  level: number;
  detailBlog: BlogDto;
  isTreeComment: boolean;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  level = 0,
  detailBlog,
  isTreeComment = false,
}) => {
  const [showChildren, setShowChildren] = useState(false);
  const user = useAuthStore()((state) => state.user);
  const [replyText, setReplyText] = useState("");
  const { addComment } = useAddComment(user?.role || "");
  const [parentId, setParentId] = useState<string>();

  const [isHidden, setIsHidden] = useState<boolean | undefined>(
    comment.isHidden
  );
  const { data: childComments } = useGetChildComments(parentId);

  const handleOnChangeComment = (event: ChangeEvent<HTMLInputElement>) => {
    setReplyText(event.target.value);
  };
  const handleSubmit = (parent_id: string | undefined) => {
    if (parent_id) setParentId(parent_id);
    if (parent_id) {
      addComment({
        content: replyText,
        blog_id: detailBlog.id,
        parent_comment_id: parent_id,
      });
      if (user?.role === "superadmin" || user?.role === "admin") {
        setOpenReply(false);
        setShowChildren(true);
      }
    }
    setReplyText("");
  };
  const loadChildComments = (parent_id: string | undefined) => {
    setShowChildren(!showChildren);
    if (parent_id) setParentId(parent_id);
  };

  const handleHiddenComment = () => {
    setIsHidden(!isHidden);
    editComment(comment.id, {
      isHidden: !isHidden,
    });
    toast.success(`Comment has been ${isHidden ? "unhidden" : "hidden"}`);
  };

  const handleTimeComment = (timeComment: Date | undefined) => {
    if (timeComment) {
      const currentTime = dayjs();
      const time = dayjs(timeComment);
      return time.from(currentTime);
    }
  };

  const [openReply, setOpenReply] = useState(false);

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={"20px"} ml={"20px"}>
      <Box display="flex" justifyContent={"space-between"}>
        <Box display="flex" alignItems="center" gap={2}>
          {isTreeComment && (
            <>
              <Image
                src={comment?.commenter_picture || "/images/auth/avatar.svg"}
                alt="avatar"
                width={40}
                height={40}
                style={{
                  maxHeight: "40px",
                  cursor: "pointer",
                  borderRadius: "50%",
                  height: "40px",
                }}
              />
              <Box>
                <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                  {comment.commenter_name}
                </Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  {handleTimeComment(comment.created_at)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
        {isTreeComment &&
          (user?.role === "admin" || user?.role === "superadmin") && (
            <IconButton onClick={handleHiddenComment}>
              {isHidden ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
            </IconButton>
          )}
      </Box>
      <Box>
        <Typography textAlign="justify">{comment?.content}</Typography>
      </Box>
      {isTreeComment && (
        <div className="flex gap-2">
          <p
            className="hover:text-secondary-main cursor-pointer"
            onClick={() => setOpenReply(!openReply)}
          >
            Reply
          </p>
          {comment?.num_of_children && (
            <p
              className="hover:text-secondary-main cursor-pointer"
              onClick={() => loadChildComments(comment?.id)}
            >
              Show {comment?.num_of_children} replies
            </p>
          )}
        </div>
      )}
      {openReply && (
        <>
          <TextField
            id="filled-basic"
            placeholder={`Write your comment here...`}
            variant="filled"
            value={replyText}
            onChange={handleOnChangeComment}
            fullWidth
            multiline={true}
            rows={6}
            InputProps={{ sx: { input: { p: "10px" }, p: "10px" } }}
          />
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Button
              sx={{
                bgcolor: "#2F566B",
                color: "white",
                textTransform: "none",
                mt: "20px",
                p: "10px 20px",
                "&:hover": {
                  bgcolor: "#2F566B",
                  color: "white",
                },
              }}
              onClick={() => handleSubmit(comment?.id)}
            >
              Submit
            </Button>
          </Box>
        </>
      )}
      {showChildren &&
        childComments?.map((childComment) => (
          <Comment
            key={childComment.id}
            comment={childComment}
            level={level + 1}
            detailBlog={detailBlog}
            isTreeComment={isTreeComment}
          />
        ))}
    </Box>
  );
};
type CommentTreeType = {
  detailBlog: BlogDto;
  isTreeComment?: boolean;
};

const CommentTree = ({
  detailBlog,
  isTreeComment = false,
}: CommentTreeType) => {
  const isLoggedIn = useAuthStore()((state) => !!state.user);
  const user = useAuthStore()((state) => state.user);
  const limit = 5;
  const [inputValue, setInputValue] = useState("");

  const handleOnChangeComment = (e: any) => {
    setInputValue(e.target.value);
  };

  const { addComment } = useAddComment(user?.role || "");
  const handleSubmit = () => {
    if (!inputValue) return;
    if (!isLoggedIn) {
      toast.error("Please signin to comment");
      return;
    }
    addComment({
      content: inputValue,
      blog_id: detailBlog.id,
    });
    if (user?.role === "superadmin" || user?.role === "admin") {
    }
    setInputValue("");
  };

  const { data, hasNextPage, fetchNextPage } = useGetParentComments(
    detailBlog.id,
    limit,
    user?.role
  );

  return (
    <Box>
      {data?.pages.map((page, pageNum) => (
        <div key={pageNum}>
          {page.items.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              level={0}
              detailBlog={detailBlog}
              isTreeComment={isTreeComment}
            />
          ))}
        </div>
      ))}

      <Box width={"100%"} display={"flex"} justifyContent={"center"}>
        {hasNextPage && (
          <Typography
            sx={{
              fontSize: "14px",
              mb: "50px",
              cursor: "pointer",
              color: "#808080c4",
              "&:hover": {
                bgcolor: "transparent",
              },
            }}
            onClick={() => {
              fetchNextPage();
            }}
          >
            See more {data?.pages[0].total! - data?.pages.length! * limit}{" "}
            comments
          </Typography>
        )}
      </Box>

      <TextField
        id="filled-basic"
        placeholder={`Write your comment here...`}
        variant="filled"
        onChange={handleOnChangeComment}
        fullWidth
        value={inputValue}
        multiline={true}
        rows={6}
        InputProps={{ sx: { input: { p: "10px" }, p: "10px" } }}
      />
      <Box display={"flex"} justifyContent={"flex-end"}>
        <Button
          sx={{
            bgcolor: "#2F566B",
            color: "white",
            textTransform: "none",
            mt: "20px",
            p: "10px 20px",
            "&:hover": {
              bgcolor: "#2F566B",
              color: "white",
            },
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CommentTree;
