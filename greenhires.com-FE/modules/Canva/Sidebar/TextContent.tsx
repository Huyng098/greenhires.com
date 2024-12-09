"use client";
import { Loading } from "@/components/Common/Loading";
import { TEXT_KEY } from "@/constants/query_key";
import {
  addABodyText,
  addAHeading,
  addASubheading,
} from "@/constants/text-effects";
import { useEditor } from "@/lib/design-editor";
import { getAllTextStyles } from "@/services/canva";
import { getThumbnail } from "@/utils/canva/thumbnail";
import { LayerId, SerializedLayers } from "@lidojs/design-core";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const TextContent = () => {
  const { data: styles, isPending } = useQuery({
    queryKey: [TEXT_KEY],
    queryFn: async () => {
      return await getAllTextStyles();
    },
  });

  const { actions } = useEditor();

  const handleAddText = (data: {
    rootId: LayerId;
    layers: SerializedLayers;
  }) => {
    actions.addLayerTree(data);
  };

  if (isPending) {
    return <Loading color="#FFFFFF"/>
  }

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <div className="flex items-center justify-center flex-shrink-0 h-[48px] border-b border-[rgba(57,76,96,.15)] px-[20px]">
        <p className="leading-[48px] font-[600] grow text-white">Text</p>
      </div>
      <div className="flex flex-col overflow-y-auto">
        <div className="p-[16px] flex gap-[8px] flex-col">
          <div
            style={{
              fontSize: 28,
              lineHeight: 1,
              padding: "16px 16px",
              fontWeight: 700,
              background: "#EBECF0",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => handleAddText(addAHeading)}
          >
            Add a heading
          </div>
          <div
            style={{
              fontSize: 18,
              lineHeight: 1,
              padding: "16px",
              fontWeight: 700,
              background: "#EBECF0",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => handleAddText(addASubheading)}
          >
            Add a subheading
          </div>
          <div
            style={{
              fontSize: 12,
              lineHeight: 1,
              padding: "16px",
              fontWeight: 700,
              background: "#EBECF0",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => handleAddText(addABodyText)}
          >
            Add a little bit of body text
          </div>
        </div>
        <div className="grow overflow-y-auto grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[8px] p-[16px]">
          {styles?.map(({ img, elements }, idx) => (
            <div
              key={idx}
              className="cursor-pointer relative pb-[100%] w-full"
              onClick={() => handleAddText(elements)}
            >
              <Image
                className="absolute top-0 left-0 h-full w-full object-cover"
                alt="style"
                src={getThumbnail(img)}
                fill
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextContent;
