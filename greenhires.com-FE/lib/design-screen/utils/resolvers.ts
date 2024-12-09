import { ElementType } from "react";
import FrameLayer from "../layers/FrameLayer";
import GroupLayer from "../layers/GroupLayer";
import ImageLayer from "../layers/ImageLayer";
import ItemLayer from "../layers/ItemLayer";
import LineLayer from "../layers/LineLayer";
import ResumeLayer from "../layers/ResumeLayer";
import TemplateLayoutLayer from "../layers/TemplateLayoutLayer";
import RootLayer from "../layers/RootLayer";
import SectionLayer from "../layers/SectionLayer";
import ShapeLayer from "../layers/ShapeLayer";
import SvgLayer from "../layers/SvgLayer";
import TextLayer from "../layers/TextLayer";
import VideoLayer from "../layers/VideoLayer";

export const resolvers: Record<string, ElementType> = {
  RootLayer,
  TextLayer,
  ImageLayer,
  ShapeLayer,
  FrameLayer,
  SvgLayer,
  GroupLayer,
  SectionLayer,
  ResumeLayer,
  VideoLayer,
  ItemLayer,
  LineLayer,
  TemplateLayoutLayer,
};
