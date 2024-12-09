import { Basics } from "@/interfaces/builder";

export const ProfileSection2 = ({ content }: { content?: Basics }) => {
  if (!content) return null;
  return (
    <div className="min-h-80 py-5 flex flex-col">
      <div className="flex-1 flex flex-col justify-center text-td-primary text-xs">
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: content.address,
          }}
        />
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html:
              `${content.city}` +
              `${content.city !== "" && content.city !== "<p></p>" && content.country !== "" && content.country !== "<p></p>" ? ", " : ""}` +
              `${content.country}`,
          }}
        />

        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: content.phone,
          }}
        />
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: content.email,
          }}
        />
      </div>

      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: `${content.firstname} ${content.lastname}`,
        }}
      />
    </div>
  );
};
