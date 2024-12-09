import { Loading } from "@/components/Common/Loading";
import { FRAMES_KEY } from "@/constants/query_key";
import { useEditor } from "@/lib/design-editor";
import { getAllFrames } from "@/services/canva";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface Frame {
  img: string;
  clipPath: string;
  width: number;
  height: number;
}

const FrameContent = () => {
  const { actions } = useEditor();
  const { data: frames, isPending } = useQuery({
    queryKey: FRAMES_KEY,
    queryFn: async () => {
      return await getAllFrames();
    },
  });
  const addFrame = async (data: Frame) => {
    actions.addFrameLayer(data, data.clipPath);
  };

  if (isPending) {
    return <Loading color="#FFFFFF" />;
  }
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-center flex-shrink-0 h-[48px] border-b  border-b-[rgba(57,76,96,.15)] px-[20px]">
        <p className="text-white font-[600] leading-[48px] grow">Frames</p>
      </div>
      <div className="flex flex-col overflow-y-auto">
        <div className="p-[16px] grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[8px] grow overflow-y-auto">
          {frames?.map((item, index) => (
            <div
              key={index}
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => addFrame(item)}
            >
              <div className="pb-[100%]" />
              <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                <Image
                  alt={`frame-${item.height}`}
                  className="w-full h-full"
                  src={item.img}
                  fill
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FrameContent;
