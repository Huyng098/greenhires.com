"use client";
import { useI18n } from "@/config/i18n/client";
import Link from "next/link";
const data = [
  {
    title: "OUR STORY",
    image: "/about-us/ourstory.svg",
    link: "/our-story",
    description:
      "Empowering careers with AI-driven CV creation for standout job applications",
  },
  {
    title: "OUR VISION & CORE VALUES",
    link: "/our-vision-core-values",
    image: "/about-us/ourvisioncorevalues.svg",
    description:
      "Revolutionizing recruitment with AI, supporting job seekers and businesses alike",
  },
];
const AboutPage = () => {
  const t = useI18n();

  return (
    <section className="flex flex-col items-center pt-[130px]">
      <p className="text-3xl my-10 text-secondary-main font-medium">
        {t("aboutus.title")}
      </p>
      <div className="flex gap-24">
        {data.map((item, index) => (
          <Link
            href={item.link}
            key={index}
            className="transition ease-in-out delay-550 duration-500 hover:-translate-y-5 flex text-center bg-[#FBFFFF] shadow-md p-5 rounded-md flex-col max-w-[400px] items-center"
          >
            <img src={item.image} alt={item.title} />
            <p className="text-secondary-main my-8 text-xl font-medium">
              {item.title}
            </p>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AboutPage;
