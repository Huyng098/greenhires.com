"use client";
import { Button as ButtonShadCn } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusBlog, typeBlog } from "@/constants/filter";
import { Category } from "@/interfaces/general/category";
import { UserRole } from "@/interfaces/user";
import DialogConfirm from "@/modules/Consultant/DialogConfirm";
import {
  useDeleteBlogById,
  useGetAllBlogs,
  useUpdateBlogById,
} from "@/services/blog/query";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import parse from "html-react-parser";
import dynamic from "next/dynamic";
import ImageNextJS from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as NProgress from "nprogress";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { FaRegTrashCan } from "react-icons/fa6";
import FilterDate from "./FilterDate";

const SubmitDialog = dynamic(
  () =>
    import("@/components/Common/GeneralDialog").then(
      (module) => module.GeneralDialog
    ),
  { ssr: false }
);

interface Props {
  categories: Category[];
  restrict?: string;
  typeButton?: string;
  role?: UserRole;
}

const BlogsTable = ({ categories, restrict, typeButton, role }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedBlogId, setSelectedBlogId] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blogId, setBlogId] = useState<string>("");
  const [blogsId, setBlogsId] = useState<string[]>([]);
  const handleOpenDialogDelete = () => {
    setOpenDialogDelete(true);
  };
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: addDays(new Date(), 1),
  });
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const category_id = searchParams.get("category_id") ?? "";
  const pagePagi = Number(searchParams.get("page")) ?? 0;
  const limit = 10;

  const { data } = useGetAllBlogs(
    pagePagi,
    limit,
    status,
    dateFilter?.from,
    dateFilter?.to,
    category_id,
    restrict
  );
  const { deleteBlogById, isPending: isPendingDeleteBlog } =
    useDeleteBlogById();
  function convertObjectToQueryParams(obj: object) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(obj)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, encodeURIComponent(item));
        }
      } else {
        params.set(key, encodeURIComponent(value));
      }
    }
    return params.toString();
  }
  const updatePath = (condition: any) => {
    const parameters = convertObjectToQueryParams(condition);
    router.push(`${pathname}?${parameters}`);
  };

  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
  };
  const open = Boolean(anchorEl);
  const handleClickOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentIndex(index);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteBlogs = () => {
    try {
      blogsId.map((blogId) => {
        deleteBlogById(blogId);
      });
      setBlogsId([]);
    } catch (err) {
      console.log(err);
    }
  };

  const { editBlogById } = useUpdateBlogById();

  const handleUpdateBlogStatus = (id: string) => {
    try {
      const formData = new FormData();
      formData.append("status", "waiting");
      editBlogById({ id: id, data: formData });
    } catch (err) {
      console.log(err);
    }
  };
  const [openSubmit, setOpenSubmit] = useState(false);
  return (
    <>
      <Box className="m-[30px] flex flex-col w-full">
        <p className="font-medium text-xl my-5">
          {restrict === "my" ? "My Blogs" : "Review Blogs"}
        </p>
        <Paper elevation={1} className="flex flex-col w-full">
          <Box className="p-10 pr-8">
            <Box className="flex justify-between mb-5">
              <Box className="flex flex-row gap-4">
                <Box className="flex flex-row items-center w-[250px] gap-4">
                  <FilterDate
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                  />
                </Box>
                <Box className="flex flex-row items-center w-[140px] gap-5">
                  <Select
                    onValueChange={(value) =>
                      updatePath({
                        page: 0,
                        category_id,
                        status: value === "All" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0 flex gap-2 bg-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                    </SelectContent>
                  </Select>
                </Box>
                <Box className="flex flex-row items-center w-[140px] gap-5">
                  <Select
                    onValueChange={(value) =>
                      updatePath({
                        page: 0,
                        category_id: value === "All" ? "" : value,
                        status,
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0  bg-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem value={category.id} key={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Box>
              </Box>
              <Box gap={2} display={"flex"}>
                <Button
                  startIcon={<FaRegTrashCan size={15} />}
                  sx={{
                    color: "white",
                    bgcolor: "#E48181",
                    textTransform: "none",
                    px: "12px",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      color: "white",
                      bgcolor: "#E48181",
                    },
                  }}
                  disabled={blogsId.length === 0}
                  onClick={() => handleDeleteBlogs()}
                >
                  Delete
                </Button>
                <Button
                  startIcon={<AddIcon />}
                  sx={{
                    color: "white",
                    bgcolor: "#2F566B",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    "&:hover": {
                      color: "white",
                      bgcolor: "#2F566B",
                    },
                  }}
                  onClick={() => {
                    NProgress.start();
                    router.push("/internal/create-blog");
                  }}
                >
                  Add Blogs
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ color: "#969696" }}
                      align="left"
                      width={20}
                    >
                      Select
                    </TableCell>
                    <TableCell
                      sx={{ color: "#969696" }}
                      align="left"
                      width={240}
                    >
                      Title
                    </TableCell>
                    <TableCell
                      sx={{ color: "#969696" }}
                      align="center"
                      width={20}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={{ color: "#969696" }}
                      align="center"
                      width={120}
                    >
                      Status
                    </TableCell>

                    <TableCell
                      sx={{ color: "#969696" }}
                      align="left"
                      width={120}
                    >
                      Author
                    </TableCell>
                    <TableCell
                      sx={{ color: "#969696" }}
                      align="left"
                      width={120}
                    >
                      Updated At
                    </TableCell>
                    <TableCell
                      sx={{ color: "#969696" }}
                      align="left"
                      width={20}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.items.map((row, index) => {
                    const statusProperty = statusBlog.find(
                      (item) => item.value === row.status
                    );
                    const typeProperty = typeBlog.find(
                      (item) => item.value === row.category_name
                    );
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="left">
                          <Checkbox
                            checked={blogsId.includes(row.id)}
                            onChange={(e) =>
                              e.target.checked
                                ? setBlogsId([...blogsId, row.id])
                                : setBlogsId(
                                    blogsId.filter((item) => item !== row.id)
                                  )
                            }
                          />
                        </TableCell>
                        <TableCell align="left">{parse(row?.title)}</TableCell>

                        <TableCell
                          align="center"
                          sx={{ verticalAlign: "middle" }}
                        >
                          <Typography
                            sx={{
                              color: typeProperty?.color,
                              display: "inline-block",
                              width: "100px",
                              fontSize: "14px",
                            }}
                          >
                            {typeProperty?.value}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ verticalAlign: "middle" }}
                        >
                          <Box
                            sx={{
                              bgcolor: statusProperty?.bgcolor,
                              color: statusProperty?.color,
                              width: "100px",
                              p: "4px 10px",
                              borderRadius: "4px",
                              display: "inline-block",
                            }}
                          >
                            {statusProperty?.text}
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Typography
                            sx={{
                              display: "inline-block",
                              width: "100px",
                              fontSize: "14px",
                            }}
                          >
                            {row?.author_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Typography
                            sx={{
                              fontSize: "14px",
                            }}
                          >
                            {dayjs(row?.updated_at).format("DD/MM/YYYY")}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <IconButton
                            id={`${index}-button`}
                            aria-controls={open ? `${index}-menu` : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={(e) => {
                              handleClickOpenMenu(e, index);
                              setBlogId(row.id);
                            }}
                          >
                            <MoreHorizIcon sx={{ color: "#969696" }} />
                          </IconButton>
                          <Menu
                            disableScrollLock
                            id="fade-menu"
                            MenuListProps={{
                              "aria-labelledby": `${row?.id}-button`,
                            }}
                            anchorEl={anchorEl}
                            open={open && currentIndex == index}
                            onClose={handleClose}
                          >
                            {typeButton === "edit" && (
                              <MenuItem
                                disabled={row.status === "waiting"}
                                onClick={() => {
                                  NProgress.start();
                                  router.push(`/internal/edit-blog/${row.id}`);
                                }}
                              >
                                <Button
                                  variant="text"
                                  sx={{
                                    textTransform: "none",
                                    p: 0,
                                    color: "#000",
                                    width: "80px",
                                    justifyContent: "flex-start",
                                  }}
                                  startIcon={
                                    <ImageNextJS
                                      alt="edit icon"
                                      src={"/images/consultant/edit.svg"}
                                      height={20}
                                      width={20}
                                    />
                                  }
                                  onClick={() => router.push("/")}
                                >
                                  Edit
                                </Button>
                              </MenuItem>
                            )}
                            {typeButton !== "edit" && (
                              <MenuItem
                                onClick={() => {
                                  NProgress.start();
                                  router.push(`/admin/review-blog/${row.id}`);
                                }}
                              >
                                <Button
                                  variant="text"
                                  sx={{
                                    textTransform: "none",
                                    p: 0,
                                    color: "#000",
                                    width: "80px",
                                    justifyContent: "flex-start",
                                  }}
                                  startIcon={
                                    <ImageNextJS
                                      alt="edit icon"
                                      src={"/images/consultant/edit.svg"}
                                      height={20}
                                      width={20}
                                    />
                                  }
                                >
                                  Review
                                </Button>
                              </MenuItem>
                            )}
                            {typeButton === "edit" && (
                              <MenuItem disabled={row.status !== "pending"}>
                                <Button
                                  variant="text"
                                  sx={{
                                    textTransform: "none",
                                    p: 0,
                                    color: "#000",
                                    width: "80px",
                                    justifyContent: "flex-start",
                                  }}
                                  startIcon={
                                    <ImageNextJS
                                      alt="edit icon"
                                      src={"/images/consultant/submit_blog.svg"}
                                      height={20}
                                      width={20}
                                    />
                                  }
                                  onClick={() => {
                                    setSelectedBlogId(row.id);
                                    setOpenSubmit(true);
                                    handleClose();
                                  }}
                                >
                                  Submit
                                </Button>
                              </MenuItem>
                            )}
                            {typeButton === "edit" ? (
                              <MenuItem
                                disabled={
                                  restrict === "my" &&
                                  (row.status === "waiting" ||
                                    row.status === "approved")
                                }
                                onClick={handleClose}
                              >
                                <Button
                                  variant="text"
                                  sx={{
                                    textTransform: "none",
                                    p: 0,
                                    color: "#000",
                                    width: "80px",
                                    justifyContent: "flex-start",
                                  }}
                                  startIcon={
                                    <ImageNextJS
                                      alt="trash icon"
                                      src={"/images/consultant/trash.svg"}
                                      height={20}
                                      width={20}
                                    />
                                  }
                                  onClick={handleOpenDialogDelete}
                                >
                                  Delete
                                </Button>
                              </MenuItem>
                            ) : (
                              <MenuItem
                                disabled={
                                  role !== "superadmin" &&
                                  (status === "waiting" ||
                                    status === "approved")
                                }
                                onClick={handleClose}
                              >
                                <Button
                                  variant="text"
                                  sx={{
                                    textTransform: "none",
                                    p: 0,
                                    color: "#000",
                                    width: "80px",
                                    justifyContent: "flex-start",
                                  }}
                                  startIcon={
                                    <ImageNextJS
                                      alt="trash icon"
                                      src={"/images/consultant/trash.svg"}
                                      height={20}
                                      width={20}
                                    />
                                  }
                                  onClick={handleOpenDialogDelete}
                                >
                                  Delete
                                </Button>
                              </MenuItem>
                            )}
                          </Menu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="mt-2 flex items-center gap-5 justify-end w-full">
              <p>{`Page ${pagePagi + 1} of ${Math.ceil((data?.total ?? 1) / 10) || 1}`}</p>
              <ButtonShadCn
                variant="outline"
                size="sm"
                onClick={() => {
                  updatePath({
                    page: pagePagi - 1,
                    category_id,
                    status,
                  });
                }}
                disabled={pagePagi === 0}
              >
                <CaretLeft size={20} />
              </ButtonShadCn>
              <ButtonShadCn
                variant="outline"
                size="sm"
                onClick={() => {
                  updatePath({
                    page: pagePagi + 1,
                    category_id,
                    status,
                  });
                }}
                disabled={(pagePagi + 1) * 10 > (data?.total ?? 0)}
              >
                <CaretRight size={20} />
              </ButtonShadCn>
            </div>
          </Box>
          <DialogConfirm
            handleDelete={() => deleteBlogById(blogId)}
            open={openDialogDelete}
            handleClose={handleCloseDialogDelete}
            content={"Do you want to delete this blog?"}
            textCancel={"Cancel"}
            textOk={"Delete"}
          />
        </Paper>
      </Box>
      <SubmitDialog
        open={openSubmit}
        setOpen={setOpenSubmit}
        title="Submit Blog"
        description="Are you sure you want to submit this blog?"
        cancelText="Cancel"
        confirmText="Submit"
        confirmButtonColor="bg-secondary-main"
        handleConfirm={() => {
          setOpenSubmit(false);
          handleUpdateBlogStatus(selectedBlogId);
        }}
      />
    </>
  );
};

export default BlogsTable;
