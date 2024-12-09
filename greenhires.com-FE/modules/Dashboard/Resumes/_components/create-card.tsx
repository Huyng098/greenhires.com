import { useI18n } from "@/config/i18n/client";
import { PlusCircle } from "@phosphor-icons/react";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { BaseCard } from "./base-card";
import { TYPE } from "@/constants/dashboard";

interface Props {
  type: TYPE;
}
export const CreateResumeCard = ({ type }: Props) => {
  const t = useI18n();
  const router = useRouter();
  return (
    <BaseCard
      onClick={() => router.push(`/choose-types-of-builder?type=${type}`)}
      className="bg-background cursor-pointer flex flex-col justify-center"
    >
      <PlusCircle
        size={80}
        weight="light"
        color="#2F566B"
        style={{ marginTop: "20px" }}
      />
      <div
        className={classNames(
          "absolute inset-x-0 bottom-0 lg:z-10 flex flex-col justify-end space-y-0.5 p-4",
          "bg-gradient-to-t from-background/80 to-transparent rounded"
        )}
      >
        <h4 className="font-base">
          {type === "resume"
            ? t("dashboard.create_resume")
            : t("dashboard.create_coverletter")}
        </h4>
        <p className="text-xs opacity-75">
          {type === "resume"
            ? t("dashboard.build_resume")
            : t("dashboard.build_coverletter")}
        </p>
      </div>
    </BaseCard>
  );
};
