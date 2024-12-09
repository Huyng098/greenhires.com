"use client";
import useScreenSize from "@/lib/hooks/useScreenSize";
import Image from "next/image";
export default function JobHome() {
  const screenSize = useScreenSize();
  return (
    <section className="pt-[130px]">
      <Image
        src="/temporary/Job Searching.svg"
        alt="Our Story"
        width={screenSize.width}
        height={screenSize.height}
      />
    </section>
  );
}
