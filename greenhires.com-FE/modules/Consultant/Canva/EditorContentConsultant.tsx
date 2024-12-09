"use client";


import { SerializedPage } from "@lidojs/design-core";
import DesignFrameConsultant from "@/lib/design-editor/editor/DesignFrameConsultant";

interface Props {
    data: SerializedPage[],
    sample_id : string;
}

const EditorContentConsultant = ({data, sample_id} : Props) => {
    
  return <DesignFrameConsultant data={data} sample_id={sample_id}/>;
};

export default EditorContentConsultant;
