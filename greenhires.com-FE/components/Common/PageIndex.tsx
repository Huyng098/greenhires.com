import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";

interface Props {
  total_page: number;
  pageIdx: number;
  setPageIdx: (pageIdx: number) => void;
}

export default function PaginationData({
  total_page,
  pageIdx,
  setPageIdx,
}: Props) {
  return (
    <Stack spacing={2}>
      <Pagination
        count={total_page}
        page={pageIdx}
        onChange={(_, page) => setPageIdx(page)}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
          />
        )}
      />
    </Stack>
  );
}
