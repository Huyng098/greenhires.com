import { TwoLineEducationSection } from "../../sections/educations";
import { Template11ExperienceSection } from "../../sections/experiences";
import { Template11HobbiesSection } from "../../sections/hoobies";
import { SkillsSection11 } from "../../sections/skills";
import { ResumeData } from "@/interfaces/builder/resume";
import {
  PAGE_HEIGHT,
  PAGE_WIDTH,
  PAGE_PADDING_X,
  PAGE_PADDING_Y,
} from "@/constants/general";
import { Envelope, Phone } from "@phosphor-icons/react";

export const Template11 = ({ data }: { data: ResumeData }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div
        style={{
          display: "flex",
          minHeight: PAGE_HEIGHT,
          height: PAGE_HEIGHT,
          width: PAGE_WIDTH,
          padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
          background: `url(${data.basics.picture})`,
          backgroundSize: "cover",
          overflow: "hidden",
        }}
      >
        <div className="flex flex-col gap-4">
          {(data.basics.firstname !== "" || data.basics.lastname !== "") && (
            <div className="text-5xl font-black font-sans">I am</div>
          )}
          <div className="flex flex-col gap-1">
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: `${data.basics.firstname}`,
              }}
            />
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: `${data.basics.lastname}`,
              }}
            />
          </div>
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: `${data.basics.headline}`,
            }}
          />

          <div className="flex flex-col gap-2">
            {data.basics.email !== "" && data.basics.email !== "<p></p>" && (
              <div className="flex items-center">
                <div className="border-2 border-[#7FA2BE] rounded-full p-1 mr-2">
                  <Envelope className="fill-[#7FA2BE]" size={30} />
                </div>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: data.basics.email,
                  }}
                />
              </div>
            )}

            {data.basics.phone !== "" && data.basics.phone !== "<p></p>" && (
              <div className="flex items-center">
                <div className="border-2 border-[#7FA2BE] rounded-full p-1 mr-2">
                  <Phone className="fill-[#7FA2BE]" size={30} />
                </div>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{
                    __html: data.basics.phone,
                  }}
                />
              </div>
            )}
          </div>

          <div
            className="flex-1 flex flex-col justify-end items-center text-3xl"
            style={{
              fontFamily: "Hangyaboly",
            }}
          >
            <div>for</div>
            <div>my portfolio</div>
          </div>
        </div>
      </div>

      <div
        className="bg-second-page bg-cover"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: PAGE_HEIGHT,
          height: PAGE_HEIGHT,
          width: PAGE_WIDTH,
          padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="flex w-full">
          <div className="mt-16 ml-8 w-[400px]">
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: data.sections.aboutme.content,
              }}
            />
          </div>
        </div>

        <div className="absolute top-[400px] left-48 w-1/4">
          <TwoLineEducationSection content={data.sections.education} />
        </div>

        <div className="absolute top-[400px] right-10 w-[300px]">
          <Template11HobbiesSection content={data.sections.hobbies} />
        </div>

        <div className="absolute top-[580px] left-20 w-full">
          <Template11ExperienceSection content={data.sections.experience} />
        </div>

        <div className="absolute top-[680px] right-14">
          <SkillsSection11 content={data.sections.skills} />
        </div>
      </div>
    </div>
  );
};
