import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export interface CardStatisticsProps {
  title: string;
  number: number;
  icon: string;
  icon_trending: string;
  trend_number: number;
}

export default function CardStatistics({
  title,
  number,
  icon,
  icon_trending,
  trend_number,
}: CardStatisticsProps) {
  return (
    <Card className="shadow-lg w-3/12 flex flex-col justify-between">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <p className="font-semibold text-lg text-[#636466]">{title}</p>
          <p className="font-semibold text-lg ">{number}</p>
        </div>
        <Image src={icon} alt="icon" width={50} height={50} />
      </CardHeader>
      <CardContent className="flex ">
        <Image src={icon_trending} alt="trending" width={24} height={24} />
        <span className="font-semibold text-sm text-hoduc-bg-success mx-2 ">{`${trend_number}% up`}</span>
        <span className="font-semibold text-sm text-[#636466]">{`from yesterday`}</span>
      </CardContent>
    </Card>
  );
}
