"use client";
import useScreenSize from "@/lib/hooks/useScreenSize";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function JobSearching() {
  const router = useRouter();
  const screenSize = useScreenSize();
  return (
    <section
      onClick={() => router.push("/job-searching/results")}
      className="pt-[130px] cursor-pointer"
    >
      <Image
        src="/temporary/Job Searching 2.svg"
        alt="Our Story"
        width={screenSize.width}
        height={screenSize.height}
      />
    </section>
  );
}
