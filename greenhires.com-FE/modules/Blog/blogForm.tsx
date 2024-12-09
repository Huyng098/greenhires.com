"use client";
import { Form, FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENERAL } from "@/constants/apis";
import { statusBlog } from "@/constants/filter";
import { BlogDto, blogSchema } from "@/interfaces/blog";
import { Category } from "@/interfaces/general/category";
import {
  useAddBlog,
  useDeleteBlogById,
  useEditBlog,
} from "@/services/blog/query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCheckmarkOutline } from "react-icons/io5";
import { z } from "zod";
import DialogConfirm from "../Consultant/DialogConfirm";
import { UploadFilePond } from "../Upload/uploadFile";

const TextEditor = dynamic(() => import("@/components/CKEditor"), {
  ssr: false,
});
interface Props {
  categories: Category[];
  detail?: BlogDto;
  role: string;
}
type BlogData = z.infer<typeof blogSchema>;
const BlogForm = ({ categories, detail, role }: Props) => {
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const { addBlog, isAdding } = useAddBlog();
  const { editBlog, isEditing } = useEditBlog();
  const router = useRouter();
  const [isSave, setIsSave] = useState<boolean>(false);
  const { deleteBlogById } = useDeleteBlogById();

  const statusProperty = statusBlog.find(
    (item) => item.value === detail?.status
  );

  async function onSubmit(data: BlogData) {
    const formData = new FormData();
    (Object.keys(data) as (keyof BlogData)[]).forEach((key) => {
      if (key === "banner") {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });
    if (detail) {
      await editBlog({ id: detail.id, data: formData });
    } else {
      await addBlog(formData);
    }
    setIsSave(true);
    if (role === "admin" || role === "superadmin") {
      router.replace("/admin/my-blogs");
    } else if (role === "consultant") {
      router.replace("/consultant/blogs/my-blogs");
    }
  }

  const form = useForm<BlogData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: detail?.title || "",
      content: detail?.content || "",
      category_id: detail?.category_id || "",
      banner: null,
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      if (detail) {
        try {
          const response = await fetch(detail.banner);
          const blob = await response.blob();
          const file = new File([blob], detail.banner, { type: blob.type });
          form.setValue("banner", [file]);
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      }
    };

    fetchData();
  }, [detail]);

  return (
    <Box className="p-10 flex flex-col w-full">
      <p className="font-medium text-2xl my-5">
        {detail ? "Edit Blog" : "Create Blog"}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Box display={"flex"}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "auto",
                gap: 2,
              }}
            >
              <FormField
                control={form.control}
                name="banner"
                render={({ field, fieldState }) => (
                  <>
                    <UploadFilePond
                      files={field.value}
                      maxFiles={1}
                      acceptFileTypes={["image/*"]}
                      allowMultiple={false}
                      onChange={(fileItems) => {
                        field.onChange(
                          fileItems.map((fileItem) => fileItem.file)
                        );
                      }}
                      text="banner"
                    />
                    <p className="text-red-500"> {fieldState.error?.message}</p>
                  </>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <div>
                    <Typography fontWeight={500} fontSize={"18px"} mb={"10px"}>
                      Title
                    </Typography>
                    <TextEditor
                      initialData={field.value}
                      onChange={field.onChange}
                      isTitle={true}
                      uploadImageRequestUrl={GENERAL.IMAGE}
                    />
                    {form.formState.errors.title && (
                      <p className="text-red-500">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <TextEditor
                    initialData={field.value}
                    onChange={field.onChange}
                    height="722px"
                    uploadImageRequestUrl={GENERAL.IMAGE}
                  />
                )}
              />
              {form.formState.errors.content && (
                <p className="text-red-500">
                  {form.formState.errors.content.message}
                </p>
              )}
            </Box>
            <Box
              width={"25%"}
              mx={"20px"}
              display="flex"
              flexDirection="column"
            >
              <Box
                width={"100%"}
                bgcolor={"white"}
                gap={2}
                display={"flex"}
                flexDirection={"column"}
                p={"20px"}
                border={"1px solid #C5C5C5"}
              >
                <Typography fontWeight={700} fontSize={"18px"} mb={"10px"}>
                  Summary
                </Typography>
                {detail && (
                  <Box display={"flex"}>
                    <Typography mr={"6px"} color={"#7d7f7c"}>
                      Date create:
                    </Typography>
                    <Typography color={"#2F566B"} fontWeight={500}>
                      {dayjs(detail?.created_at).format("DD/MM/YYYY")}
                    </Typography>
                  </Box>
                )}
                <Box display={"flex"}>
                  <Typography color={"#7d7f7c"} mr={"30px"}>
                    Status:
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: statusProperty?.bgcolor,
                      color: statusProperty?.color,
                      p: "2px 10px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    {statusProperty?.text}
                  </Box>
                </Box>
                <Box>
                  <div className="flex items-center">
                    <Typography color={"#7d7f7c"} mr={"44px"}>
                      Type:
                    </Typography>
                    <Box width={"120px"}>
                      {categories?.length > 0 && (
                        <FormField
                          control={form.control}
                          name="category_id"
                          render={({ field }) => (
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      )}
                    </Box>
                  </div>
                  {form.formState.errors.category_id && (
                    <p className="text-red-500">
                      {form.formState.errors.category_id.message}
                    </p>
                  )}
                  <Button
                    disabled={isAdding || isEditing}
                    sx={{
                      width: "100%",
                      bgcolor: "#2F566B",
                      color: "white",
                      mt: "20px",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        bgcolor: "#2F566B",
                        color: "white",
                      },
                    }}
                    type="submit"
                    startIcon={
                      isSave ? (
                        <IoCheckmarkOutline />
                      ) : (
                        <Image
                          alt="save icon"
                          src={"/images/consultant/save.svg"}
                          height={20}
                          width={20}
                        />
                      )
                    }
                  >
                    Save
                  </Button>
                </Box>
                {detail && (
                  <Button
                    sx={{
                      width: "100%",
                      bgcolor: "white",
                      color: " rgba(211, 61, 61, 0.8)",
                      mt: "20px",
                      textTransform: "none",
                      fontWeight: "500",
                      "&:hover": {
                        bgcolor: "white",
                        color: " rgba(211, 61, 61, 0.8)",
                      },
                      border: "1px solid  rgba(211, 61, 61, 0.7)",
                    }}
                    onClick={() => setOpenDialogDelete(true)}
                    startIcon={
                      <Image
                        alt="trash icon"
                        src={"/images/consultant/trash.svg"}
                        height={20}
                        style={{
                          filter:
                            " invert(60%) sepia(100%) saturate(10000%) hue-rotate(350deg) brightness(80%) opacity(80%)",
                        }}
                        width={20}
                      />
                    }
                  >
                    Delete blog
                  </Button>
                )}
              </Box>

              {detail?.comments && (
                <div className="w-full h-[500px] overflow-scroll mt-10">
                  <p>Comments:</p>
                  <div className="bg-gray-200 rounded-md p-3 shadow-sm">
                    {detail.comments.map((item, index) => (
                      <div key={index} className="bg-white rounded mb-2 p-2">
                        <div key={index} className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">
                            {dayjs(item.time).format("HH:MM DD/MM/YYYY")}, by{" "}
                            {item.admin_name}:
                          </p>
                        </div>
                        <div className="text-sm ml-3">{item.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Box>
          </Box>
        </form>
      </Form>
      <DialogConfirm
        handleDelete={() => {
          deleteBlogById(detail?.id);
          if (role === "admin" || role === "superadmin") {
            router.replace("/admin/my-blogs");
          } else if (role === "consultant") {
            router.replace("/consultant/blogs/my-blogs");
          }
        }}
        open={openDialogDelete}
        handleClose={() => setOpenDialogDelete(false)}
        content={"Do you want to delete this blog?"}
        textCancel={"Cancel"}
        textOk={"Delete"}
      />
    </Box>
  );
};

export default BlogForm;
