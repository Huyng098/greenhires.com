"use client";
import useScreenSize from "@/lib/hooks/useScreenSize";
import Image from "next/image";
export default function OurStory() {
  const screenSize = useScreenSize();
  return (
    <section className="pt-[130px]">
      <Image
        src="/temporary/Our Story.svg"
        alt="Our Story"
        width={screenSize.width}
        height={screenSize.height}
      />
    </section>
  );
}
