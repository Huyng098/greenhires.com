"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BaseCard } from "@/modules/Dashboard/Resumes/_components/base-card";
import { TemplateContext } from "@/stores/template";
import { CircleNotch, Eye, Pencil } from "@phosphor-icons/react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { TemplateResumeio, VariantsValue } from "./templateList";
import { SamplePreview } from "@/lib/design-screen/screen/SamplePreview";
import { ResumeData } from "@/interfaces/builder/resume";

interface TemplateCardProps {
  item: TemplateResumeio;
  children: React.ReactNode;
}

export const TemplateLocalCard = ({ item, children }: TemplateCardProps) => {
  const isServerSample = !!item?.id;
  const [baseCardWidth, setBaseCardWidth] = useState<number | null>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (baseRef.current) {
      setBaseCardWidth(baseRef.current.offsetWidth);
    }
  }, [baseRef.current?.offsetWidth]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [hoveredVariant, setHoveredVariant] = useState<VariantsValue | null>(
    null
  );

  const router = useRouter();
  const { setTemplateId, setTemplateVariant, setResumeData } =
    useContext(TemplateContext);
  const onEnter = () => setIsHover(true);
  const onLeave = () => setIsHover(false);
  const handleUseTemplate = (id: string, resume_data?: ResumeData) => {
    setTemplateId(id);
    if (hoveredVariant) {
      setTemplateVariant(hoveredVariant.name);
    }
    if (resume_data) {
      setResumeData(resume_data);
    }
    router.push("/create-resume");
  };

  const handleUseVariant = (id: string, variant: VariantsValue) => {
    setTemplateId(id);
    setTemplateVariant(variant.name);
    router.push("/create-resume");
  };

  return (
    <div className="flex flex-col">
      <BaseCard className="relative border-[1px] shadow" ref={baseRef}>
        <AnimatePresence>
          {!isServerSample && !item.previews && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CircleNotch
                size={64}
                weight="thin"
                opacity={0.5}
                className="animate-spin self-center justify-self-center"
              />
            </motion.div>
          )}
          {hoveredVariant ? (
            <motion.img
              layout
              initial="hidden"
              variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 },
              }}
              whileInView="visible"
              loading="lazy"
              className="h-full w-full object-cover"
              src={hoveredVariant.previews}
            />
          ) : isServerSample && baseCardWidth ? (
            <SamplePreview
              data={item.elements}
              width={794}
              height={1123}
              scale={baseCardWidth / 794}
            />
          ) : (
            <motion.img
              layout
              initial="hidden"
              variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 },
              }}
              whileInView="visible"
              loading="lazy"
              className="h-full w-full object-cover"
              src={item.previews?.[0] || item.variants?.[0]?.imgs?.[0]}
            />
          )}
        </AnimatePresence>
        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className={classNames(
            "flex items-center rounded justify-center inset-0 bg-black bg-opacity-30 transition-opacity duration-100 absolute",
            isHover ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="font-medium flex text-sm flex-col gap-3 items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <button className="rounded-lg px-4 py-2 flex text-center gap-2 items-center justify-center bg-white text-primary-main">
                  <Eye size={16} color="#2F566B" weight="light" />
                  Preview
                </button>
              </DialogTrigger>
              <DialogContent
                ref={scrollRef}
                className="z-[1000] w-full aspect-[794/1123]"
              >
                {hoveredVariant ? (
                  <motion.img
                    layout
                    initial="hidden"
                    variants={{
                      visible: { opacity: 1 },
                      hidden: { opacity: 0 },
                    }}
                    whileInView="visible"
                    loading="lazy"
                    className="h-full w-full p-2 object-cover"
                    src={hoveredVariant.previews}
                  />
                ) : isServerSample ? (
                  <SamplePreview
                    data={item.elements}
                    width={794}
                    height={1123}
                    scale={0.59}
                  />
                ) : (
                  <motion.img
                    layout
                    initial="hidden"
                    variants={{
                      visible: { opacity: 1 },
                      hidden: { opacity: 0 },
                    }}
                    whileInView="visible"
                    loading="lazy"
                    className="h-full w-full p-2 object-cover"
                    src={item.previews?.[0] || item.variants?.[0]?.imgs?.[0]}
                  />
                )}
              </DialogContent>
            </Dialog>

            <button
              onClick={() =>
                handleUseTemplate(
                  isServerSample
                    ? item.resume_data?.metadata?.template
                    : item.name,
                  item.resume_data
                )
              }
              className="rounded-lg px-4 py-2 flex text-center gap-2 items-center justify-center bg-primary-main text-white"
            >
              <Pencil size={16} color="white" weight="light" />
              Use this template
            </button>
          </div>
        </div>
      </BaseCard>
      {item.variants && item.variants.length > 1 && (
        <div className="flex mt-5 gap-2 flex-wrap">
          {item.variants.map((variant, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredVariant(variant)}
              onClick={() => handleUseVariant(item.name, variant)}
              className={cn(
                "h-4 w-4 rounded-full relative cursor-pointer",
                "before:absolute before:inset-px before:rounded-full before:bg-white before:transition-transform before:duration-200 before:ease-in-out",
                variant.name === hoveredVariant?.name
                  ? "before:opacity-100 before:scale-100"
                  : "before:opacity-0 before:scale-0"
              )}
              style={{ backgroundColor: variant.name }}
            />
          ))}
        </div>
      )}
      {children}
    </div>
  );
};
