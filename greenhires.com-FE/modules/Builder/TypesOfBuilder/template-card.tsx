"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateDto } from "@/interfaces/builder/resume";
import { BaseCard } from "@/modules/Dashboard/Resumes/_components/base-card";
import { useCreateResume } from "@/services/resume/query";
import { CircleNotch, Eye, Pencil } from "@phosphor-icons/react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useRef, useState } from "react";
import { toast } from "sonner";

interface TemplateCardProps {
  template: TemplateDto;
  variantIdx: number;
  children?: React.ReactNode;
}

export const TemplateCard = ({
  template,
  variantIdx,
  children,
}: TemplateCardProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);

  const onLeave = () => setIsHover(false);
  const onEnter = () => setIsHover(true);
  const { createResume } = useCreateResume();
  const handleUseTemplate = async (id: string) => {
    try {
      await createResume({
        typeOfBuilder: "resumecanva",
        templateId: id,
        title: "Untitled",
        type: "resume",
      });
    } catch (error) {
      toast.error("Create resume canva failed");
    }
  };

  return (
    <Fragment>
      <BaseCard className="relative border-[1px] shadow">
        <AnimatePresence>
          {!template && (
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
          {template && (
            <motion.img
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              loading="lazy"
              alt={template.name}
              className="h-full rounded w-full object-cover"
              src={`${template.variants[variantIdx].imgs[0]}?cache=${new Date().getTime()}`}
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
                {template && (
                  <ScrollArea className="w-full h-full">
                    {template.variants[variantIdx].imgs.map((img, idx) => (
                      <motion.img
                        layout
                        initial="hidden"
                        variants={{
                          visible: { opacity: 1 },
                          hidden: { opacity: 0 },
                        }}
                        key={idx}
                        whileInView="visible"
                        loading="lazy"
                        alt={template.name}
                        className="h-full w-full p-2 object-cover"
                        src={`${img}?cache=${new Date().getTime()}`}
                      />
                    ))}
                  </ScrollArea>
                )}
              </DialogContent>
            </Dialog>

            <button
              onClick={() => handleUseTemplate(template.id)}
              className="rounded-lg px-4 py-2 flex text-center gap-2 items-center justify-center bg-primary-main text-white"
            >
              <Pencil size={16} color="white" weight="light" />
              Use this template
            </button>
          </div>
        </div>
      </BaseCard>
      {children}
    </Fragment>
  );
};
