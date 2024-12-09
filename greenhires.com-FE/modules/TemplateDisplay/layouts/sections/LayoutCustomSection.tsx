import { CustomSectionGroup } from "@/interfaces/builder/baseSection";

export const LayoutCustomSection = ({
  content,
}: {
  content: CustomSectionGroup;
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className=" flex flex-col">
      <div
        className="text-xl font-bold text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex flex-col gap-2 mt-2">
        {content.items.map((item) => {
          return (
            <div key={item.id} className="flex flex-col ">
              <div
                className="text-sm font-bold"
                dangerouslySetInnerHTML={{ __html: item.name }}
              />
              <div className="flex items-center gap-1">
                <div
                  className="text-sm font-light prose"
                  dangerouslySetInnerHTML={{ __html: item.startDate as string }}
                />{" "}
                -{" "}
                <div
                  className="text-sm font-light prose"
                  dangerouslySetInnerHTML={{ __html: item.endDate as string }}
                />
              </div>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: item.summary }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
