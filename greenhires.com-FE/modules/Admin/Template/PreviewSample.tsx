"use client";

import { SampleVariant } from "@/interfaces/sample/sample";
import { changeColorLayers } from "@/lib/design-editor/ultils/change-color";
import { Frame } from "@/lib/design-screen";
import { ColorIcon } from "@lidojs/color-picker";
import { SerializedPage } from "@lidojs/design-core";
import { useEffect, useState } from "react";

interface Props {
  data: SerializedPage[];
  variants: SampleVariant[];
}

export default function PreviewSample({ data, variants }: Props) {
  const [pagesData, setPagesData] = useState<SerializedPage[]>(data);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    setPagesData(changeColorLayers(data, selectedColor));
  }, [selectedColor]);

  return (
    <div className="my-5">
      <Frame data={pagesData} width={794} height={1123} />
      <div className="w-full mt-5 flex flex-wrap gap-2">
        {variants.map((variant, idx) => (
          <div key={idx} className="w-8 rounded-full">
            <ColorIcon
              color={variant.color}
              selected={selectedColor}
              onClick={() => setSelectedColor(variant.color)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
