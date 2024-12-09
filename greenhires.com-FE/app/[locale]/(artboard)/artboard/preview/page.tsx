"use client";
import { Frame } from "@/lib/design-screen";
import { useEffect, useState } from "react";

const PreviewPage = () => {
  const [resumeCanva, setResumeCanva] = useState(null);

  useEffect(() => {
    const resume_canva = window.localStorage.getItem("resume_canva");
    if (resume_canva) {
      setResumeCanva(JSON.parse(resume_canva));
    }
  }, []);
  if (!resumeCanva) return null;
  return <Frame data={resumeCanva} width={794} height={1123} />;
};

export default PreviewPage;
