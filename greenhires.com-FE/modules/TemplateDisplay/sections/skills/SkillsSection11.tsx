import { ResumeData } from "@/interfaces/builder/resume";

const skills = {
  Photoshop: "url('/templates/11/skills/12.png')",
  "Adobe InDesign": "url('/templates/11/skills/13.png')",
  "Adobe Illustrator": "url('/templates/11/skills/14.png')",
  "Microsoft Visual Studio": "url('/templates/11/skills/15.png')",
  "After Effects": "url('/templates/11/skills/16.png')",
} as const;

const skillsColor = {
  Photoshop: "#001D26",
  "Adobe InDesign": "#F9A800",
  "Adobe Illustrator": "#FF7F00",
  "Microsoft Visual Studio": "#68217A",
  "After Effects": "#D291BC",
} as const;

export const SkillsSection11 = ({
  content,
}: {
  content: ResumeData["sections"]["skills"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col">
      <div
        className="text-td-primary text-xl font-bold prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="grid grid-cols-2 gap-4 mt-10">
        {content.items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "4px",
              borderRadius: "9999px",
              background: `conic-gradient(${
                skillsColor[item.name as keyof typeof skillsColor]
              } ${(item.level / 5) * 360}deg, white ${
                (item.level / 5) * 360
              }deg)`,
            }}
          >
            <div className="p-1 bg-white rounded-full">
              <div
                style={{
                  height: "65px",
                  width: "65px",
                  background: skills[item.name as keyof typeof skills],
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
