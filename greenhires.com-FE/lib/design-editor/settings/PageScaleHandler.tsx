import { Slider } from "@/components/ui/slider";
import { useEditor } from "../hooks";

export const PageScaleHandler = () => {
  const { actions, scale } = useEditor((state) => ({
    scale: state.scale,
  }));
  const handleChangeScale = (value: number[]) => {
    actions.setScale(value[0] / 100);
  };
  return (
    <div
      className="justify-between"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        padding: "0 8px",
        fontWeight: 300,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          display: "grid",
          gridAutoFlow: "column",
          gridColumnGap: 8,
          alignItems: "center",
        }}
      >
        <div style={{ width: 200, paddingRight: 8 }}>
          <Slider
            className="hover:cursor-pointer"
            max={150}
            value={[scale * 100]}
            onValueChange={handleChangeScale}
            step={1}
          />
        </div>

        <div style={{ width: 48, textAlign: "center" }}>
          {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
};
