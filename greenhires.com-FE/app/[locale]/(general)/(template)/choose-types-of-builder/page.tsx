import ScrollUp from "@/components/Common/ScrollUp";
import { ChooseTypesOfBuilder } from "@/modules/Builder/TypesOfBuilder";
import Banner from "@/modules/Home/Banner";

export default function TypesOfBuilder({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  return (
    <>
      <ScrollUp />
      <ChooseTypesOfBuilder />
      <Banner type="cv" />
    </>
  );
}
