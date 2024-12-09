import { Category } from "@/interfaces/general/category";
import { TemplateActionResumeIO } from "@/modules/Template/TemplateActionResumeIO";

interface ApplyTemplateProps {
  categories: Category[];
  size: number;
  isLayout?: boolean;
}

export const ApplyTemplate = ({
  categories,
  isLayout = false,
}: ApplyTemplateProps) => {
  return (
    <TemplateActionResumeIO
      categories={categories}
      numLimit={26}
      isShowCheck
      isLayout={isLayout}
    >
      <p className="text-md font-medium">
        {isLayout ? "Switch Layout" : "Switch Template"}
      </p>
    </TemplateActionResumeIO>
  );
};
