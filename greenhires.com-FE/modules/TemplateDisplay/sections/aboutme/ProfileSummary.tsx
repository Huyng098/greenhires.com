import { ResumeData } from "@/interfaces/builder/resume";
import { Person } from "@mui/icons-material";

export const ProfileSummary = ({
  content,
}: {
  content: ResumeData["sections"]["aboutme"];
}) => {
  if (
    !content.content ||
    content.content === "" ||
    content.content === "<p></p>"
  )
    return null;
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center">
        <Person
          className="fill-td-primary text-td-primary mr-2"
          fontSize="large"
        />
        <div
          className="text-xl font-bold prose"
          dangerouslySetInnerHTML={{ __html: content.name }}
        />
      </div>
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: content.content,
        }}
      />
    </div>
  );
};
