import { Circle, Heart, Star, Triangle } from "@phosphor-icons/react";

export const levelBar = [
  {
    value: 1,
    label: "novice",
    color: "#a84032",
  },
  {
    value: 2,
    label: "beginner",
    color: "#a86b32",
  },
  {
    value: 3,
    label: "intermediate",
    color: "#6da832",
  },
  {
    value: 4,
    label: "advanced",
    color: "#32a86f",
  },
  {
    value: 5,
    label: "expert",
    color: "#32a8a0",
  },
];

export const displayBar = [
  {
    label: (
      <div className="flex flex-row gap-3">
        <Star size={20} color="#19B2B9" weight="regular" />
        <Star size={20} color="#19B2B9" weight="regular" />
        <Star size={20} color="#19B2B9" weight="regular" />
        <Star size={20} color="#19B2B9" weight="regular" />
        <Star size={20} color="#19B2B9" weight="regular" />
      </div>
    ),
    value: "star",
  },
  {
    label: (
      <div className="flex flex-row gap-3">
        <Circle size={20} color="#19B2B9" weight="regular" />
        <Circle size={20} color="#19B2B9" weight="regular" />
        <Circle size={20} color="#19B2B9" weight="regular" />
        <Circle size={20} color="#19B2B9" weight="regular" />
        <Circle size={20} color="#19B2B9" weight="regular" />
      </div>
    ),
    value: "circle",
  },
  {
    label: (
      <div className="flex flex-row gap-3">
        <Heart size={20} color="#19B2B9" weight="regular" />
        <Heart size={20} color="#19B2B9" weight="regular" />
        <Heart size={20} color="#19B2B9" weight="regular" />
        <Heart size={20} color="#19B2B9" weight="regular" />
        <Heart size={20} color="#19B2B9" weight="regular" />
      </div>
    ),
    value: "heart",
  },
  {
    label: (
      <div className="flex flex-row gap-3">
        <Triangle size={20} color="#19B2B9" weight="regular" />
        <Triangle size={20} color="#19B2B9" weight="regular" />
        <Triangle size={20} color="#19B2B9" weight="regular" />
        <Triangle size={20} color="#19B2B9" weight="regular" />
        <Triangle size={20} color="#19B2B9" weight="regular" />
      </div>
    ),
    value: "triangle",
  },
];

export const levelLanguage = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Elementary" },
  { value: 3, label: "Intermediate" },
  { value: 4, label: "Advanced" },
  { value: 5, label: "Native" },
];
