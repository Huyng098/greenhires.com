import { ResumeData } from "@/interfaces/builder/resume";

const hoobies = {
  Tenis: "url('/templates/11/hobbies/1.png')",
  Gardening: "url('/templates/11/hobbies/2.png')",
  Game: "url('/templates/11/hobbies/3.png')",
  Photography: "url('/templates/11/hobbies/4.png')",
  Writing: "url('/templates/11/hobbies/5.png')",
  Yoga: "url('/templates/11/hobbies/6.png')",
  Painting: "url('/templates/11/hobbies/7.png')",
  "Solving Puzzles": "url('/templates/11/hobbies/8.png')",
  Volleyball: "url('/templates/11/hobbies/9.png')",
  Bowling: "url('/templates/11/hobbies/10.png')",
  Other: "url('/templates/11/hobbies/11.png')",
} as const;

export const Template11HobbiesSection = ({
  content,
}: {
  content: ResumeData["sections"]["hobbies"];
}) => {
  if (!content || content.items.length <= 0) return null;
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-xl font-bold text-td-primary pl-10 prose"
        dangerouslySetInnerHTML={{ __html: content.name }}
      />
      <div className="flex gap-2 mt-2 w-full flex-wrap">
        {content &&
          content.items.map((item) => (
            <div
              key={item.id}
              style={{
                height: "65px",
                width: "65px",
                background: hoobies[item.name as keyof typeof hoobies],
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          ))}
      </div>
    </div>
  );
};
