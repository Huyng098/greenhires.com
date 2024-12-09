import { ResumeData } from "@/interfaces/builder/resume";

export const CoursesSection = ({
  content,
}: {
  content: ResumeData["sections"]["courses"];
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-td-primary">COURSES</h1>
      <div className="text-xs font-light">{content && <></>}</div>
    </div>
  );
};
