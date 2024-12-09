import { CircularProgress } from "@mui/material";

interface LoadingProps {
  color: string;
  size?: string;
}

export const Loading = ({ color, size }: LoadingProps) => {
  return (
    <div className="flex justify-center">
      <CircularProgress
        size={size}
        style={{
          color: color,
        }}
      />
    </div>
  );
};
