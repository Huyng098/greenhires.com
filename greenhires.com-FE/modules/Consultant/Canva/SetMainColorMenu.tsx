import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SampleVariant } from "@/interfaces/sample/sample";
import { defaultColors } from "@/lib/design-editor/settings/default-colors";
import { changeColorLayers } from "@/lib/design-editor/ultils/change-color";
import { Frame } from "@/lib/design-screen";
import { useReplaceVariant } from "@/services/sample/query";
import { ColorIcon } from "@lidojs/color-picker";
import { SerializedPage } from "@lidojs/design-core";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  canvaData: SerializedPage[];
  closeMenu: () => void;
  sample_id: string;
  variants: SampleVariant[];
}

function SetMainColorMenu({
  canvaData,
  closeMenu,
  sample_id,
  variants,
}: Props) {
  const [pagesData, setPagesData] = useState<SerializedPage[]>(canvaData);
  const [selectedColor, setSelectedColor] = useState<string[]>(
    variants.map((v) => v.color)
  );
  const { isPending, addVariantRQ } = useReplaceVariant(closeMenu);
  const onSetMainColor = async (colors: string[]) => {
    await addVariantRQ({ sample_id, colors });
  };
  useEffect(() => {
    setPagesData(
      changeColorLayers(canvaData, selectedColor[selectedColor.length - 1])
    );
  }, [selectedColor]);

  return (
    <div className="flex flex-col w-full h-full bg-primary-main">
      <div className="flex justify-between p-3">
        <Button onClick={closeMenu}>
          <ChevronLeft size={20} color="white" />
          <p className="ml-2 text-white">Back to editor</p>
        </Button>

        <Button
          disabled={isPending}
          className="bg-cyan-500 hover:bg-cyan-500/85 px-8"
          onClick={() => onSetMainColor(selectedColor)}
        >
          <p className="text-white">Save</p>
        </Button>
      </div>
      <div className="flex flex-1">
        <ScrollArea className="h-full flex min-w-[350px] bg-white p-4">
          <div style={{ borderTop: "1px solid rgba(217, 219, 228, 0.6)" }}>
            <div style={{ padding: "8px 0", fontWeight: 700 }}>
              Default Colors
            </div>
            <div
              style={{
                display: "grid",
                gridGap: 12,
                gridTemplateColumns: `repeat(${defaultColors[0].length},minmax(0,1fr))`,
              }}
            >
              {defaultColors.map((colorList) =>
                colorList.map((c, ci) => (
                  <ColorIcon
                    key={ci}
                    color={c}
                    selected={selectedColor.includes(c) ? c : null}
                    onClick={() => {
                      setSelectedColor((prev) =>
                        prev.includes(c)
                          ? prev.filter((i) => i !== c)
                          : [...prev, c]
                      );
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="flex-grow overflow-auto flex flex-col bg-backgroundColor-main">
          <Frame data={pagesData} width={794} height={1123} zoomable={true} />
        </div>
      </div>
    </div>
  );
}

export default SetMainColorMenu;
