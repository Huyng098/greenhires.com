import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth";
import { useResumeStore } from "@/stores/resume";
import { CopySimple } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

export const SharingSection = () => {
  const user = useAuthStore()((state) => state.user);
  const setValue = useResumeStore()((state) => state.setResume);
  const slug = useResumeStore()((state) => state.resume.slug);
  const isPublic = useResumeStore()(
    (state) => state.resume.visibility === "public"
  );
  const url = `${window.location.origin}/sharing-resume/${user?.firstname}-${user?.lastname}/${slug}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(url);
    toast.success(
      <div className="flex flex-col">
        <p className="font-medium">A link has been copied to your clipboard.</p>
        <p>
          Anyone with this link can view the resume. Share it on your profile or
          with recruiters.{" "}
        </p>
      </div>
    );
  };

  return (
    <section id="sharing" className="grid gap-y-6">
      <main className="grid gap-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-x-4">
            <Switch
              id="visibility"
              checked={isPublic}
              onCheckedChange={(checked) => {
                setValue("visibility", checked ? "public" : "private");
              }}
            />
            <div>
              <Label htmlFor="visibility" className="space-y-1">
                <p>Public</p>
                <p className="text-xs opacity-60">
                  Anyone with the link can view the resume.
                </p>
              </Label>
            </div>
          </div>
        </div>

        <AnimatePresence presenceAffectsLayout>
          {isPublic && (
            <motion.div
              layout
              className="space-y-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Label htmlFor="resume-url">URL</Label>
              <div className="flex gap-x-1.5">
                <Input
                  id="resume-url"
                  readOnly
                  value={url}
                  className="flex-1"
                />
                <Tooltip content={"Copy to Clipboard"}>
                  <Button size="icon" variant="ghost" onClick={onCopy}>
                    <CopySimple />
                  </Button>
                </Tooltip>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </section>
  );
};
