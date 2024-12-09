"use client";

import { ResumeData } from "@/interfaces/builder/resume";

const colorLevel = ["#0070C0", "#00B0F0", "#A7D9D8", "#92D050"];

export const JoinedSkillCircleSection = ({
  content,
}: {
  content: ResumeData["sections"]["skills"];
}) => {
  const topSkills = content.items
    .slice()
    .sort((a, b) => b.level - a.level)
    .slice(0, 4);
  const otherSkills = content.items
    .slice()
    .sort((a, b) => b.level - a.level)
    .slice(4);

  const graphCover = () => {
    const coverSide = 5 - topSkills.length;
    return (
      <div
        className="absolute rounded-full"
        style={{
          zIndex: 5,
          height: `${40 * coverSide}px`,
          width: `${40 * coverSide}px`,
          background: "white",
        }}
      />
    );
  };

  if (!content || content.items.length <= 0) return null;

  return (
    <div className="flex flex-col">
      <div
        className="text-3xl font-black text-td-primary prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="h-52 flex justify-center">
        <div className="w-52 h-52 relative flex justify-center items-center">
          {topSkills.map((skill, index) => {
            return (
              <div
                key={skill.id}
                className="absolute rounded-full"
                style={{
                  zIndex: index,
                  height: `${200 - 40 * index}px`,
                  width: `${200 - 40 * index}px`,
                  background: `conic-gradient(white 0 ${
                    ((5 - skill.level) / 5) * 360
                  }deg, ${colorLevel[index]} ${
                    ((5 - skill.level) / 5) * 360
                  }deg)`,
                }}
              />
            );
          })}
          {graphCover()}
        </div>
      </div>

      <div className="grid grid-cols-2">
        {topSkills.map((skill, index) => (
          <div key={skill.id} className="flex items-center">
            <h2 className="text-5xl font-bold relative mr-3">
              <div className="relative z-10 ml-2">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: skill.level }}
                />
              </div>
              <div
                className="absolute bottom-0 h-1/2"
                style={{
                  width: "100%",
                  background: colorLevel[index],
                }}
              />
            </h2>
            <p className="flex-1 text-xl font-light">
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: skill.name }}
              />
            </p>
          </div>
        ))}
      </div>

      <div className="h-[2px] w-full bg-black my-8" />

      {otherSkills.length > 0 && (
        <div className="flex flex-col gap-4 px-2">
          {otherSkills.map((skill, index) => (
            <div key={index} className="relative">
              <div
                className="absolute left-0 bottom-0"
                style={{
                  height: "50%",
                  width: `${skill.level * 20}%`,
                  background: "#92D050",
                }}
              />
              <h2 className="relative z-10 text-lg font-bold">
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: skill.name }}
                />
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
