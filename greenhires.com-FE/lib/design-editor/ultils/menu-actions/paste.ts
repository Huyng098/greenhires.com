import { uploadImage } from "@/services/general/api";
import { LayerComponentProps, SerializedLayerTree } from "@lidojs/design-core";
import { EditorActions } from "../../types";

export const paste = async ({ actions }: { actions: EditorActions }) => {
  async function handleUploadFile(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "general");
    try {
      const res = await uploadImage(formData);
      const newImage = new Image();
      newImage.onerror = (err) => window.alert(err);
      newImage.src = res.url;
      newImage.crossOrigin = "anonymous";
      newImage.onload = () => {
        actions.addImageLayer(
          { url: res.url, thumb: res.url },
          { width: newImage.naturalWidth, height: newImage.naturalHeight }
        );
      };
    } catch (e) {
      window.alert("Cannot upload image: " + (e as Error).message);
    }
  }

  const textData = await navigator.clipboard.readText();
  if (textData === "") {
    try {
      const data = await navigator.clipboard.read();
      if (data.length === 0) return;
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.types.includes("image/png")) {
          const blob = await item.getType("image/png");
          const newFile = new File([blob], "image.png", { type: "image/png" });
          await handleUploadFile(newFile);
        } else if (item.types.includes("image/jpeg")) {
          const blob = await item.getType("image/jpeg");
          const newFile = new File([blob], "image.jpeg", {
            type: "image/jpeg",
          });
          await handleUploadFile(newFile);
        } else {
          window.alert("Cannot paste this type of data");
        }
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      const serializedData: SerializedLayerTree[] = JSON.parse(textData);
      //TODO VALIDATE data
      serializedData.forEach((serializedLayers) => {
        Object.entries(serializedLayers.layers).forEach(([layerId]) => {
          (
            serializedLayers.layers[layerId].props as LayerComponentProps
          ).position.x += 10;
          (
            serializedLayers.layers[layerId].props as LayerComponentProps
          ).position.y += 10;
        });
        actions.addLayerTree(serializedLayers);
      });
    } catch (e) {
      console.error(e);
    }
  }
};
