import { ResumeData } from "@/interfaces/builder/resume";

export const SkillsSection4 = ({
  content,
}: {
  content: ResumeData["sections"]["skills"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col">
      <div className="relative flex justify-end">
        <div
          className="text-td-primary text-xl font-bold prose"
          dangerouslySetInnerHTML={{ __html: content.name }}
        />
        <div className="absolute h-[2px] w-[360px] left-0 bottom-0 bg-td-primary" />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {content.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center w-full break-inside-avoid-column"
          >
            <div className="flex-1 h-20 w-20">
              <div
                className="rounded-full"
                style={{
                  height: `60px`,
                  width: `60px`,
                  background: `conic-gradient(white 0 ${
                    ((5 - item.level) / 5) * 360
                  }deg, rgb(var(--color-primary)) ${
                    ((5 - item.level) / 5) * 360
                  }deg)`,
                }}
              />
            </div>
            <div
              className="text-sm font-bold w-24 prose"
              dangerouslySetInnerHTML={{ __html: item.name }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
