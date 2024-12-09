import { Menu } from "@/interfaces/general/menu";
import {
  AppWindow,
  Article,
  Book,
  EnvelopeSimpleOpen,
  Target,
} from "@phosphor-icons/react";

const menuData: Menu[] = [
  {
    id: 1,
    title: "About Us",
    newTab: false,
    link: "/about-us",
    submenu: [
      {
        id: 20,
        title: "Our Story",
        path: "/our-story",
        icon: <Book size={35} weight="light" />,
        newTab: false,
        description: "",
      },
      {
        id: 21,
        title: "Our Vision & Core Values",
        path: "/our-vision-core-values",
        icon: <Target size={35} weight="light" />,
        newTab: false,
        description: "",
      },
    ],
  },
  {
    id: 2,
    title: "Resume",
    newTab: false,
    link: "/choose-types-of-builder",
    submenu: [
      {
        id: 41,
        title: "Choose Template",
        path: "/resume-templates",
        icon: <Article size={35} weight="light" />,
        newTab: false,
        description:
          "Customize Your Template - Craft high-performing CVs with industry-specific templates",
      },
      {
        id: 44,
        title: "Blank Page",
        path: "/ai-templates",
        icon: <AppWindow size={35} weight="light" />,
        newTab: false,
        description:
          "Tailor Your AI-Driven CV Personalization AI-Tailored Content & Design for Stand-Out CVs ",
      },
      {
        id: 45,
        title: "Cover Letter",
        path: "/letter-templates",
        icon: <EnvelopeSimpleOpen size={35} weight="light" />,
        newTab: false,
        description:
          "Customize Your Template - Craft high-performing CVs with industry-specific templates",
      },
    ],
  },
  {
    id: 33,
    title: "Your CV Editor",
    path: "/dashboard/resumes",
    newTab: false,
  },
  {
    id: 3,
    title: "Blog",
    newTab: false,
    path: "/blogs",
  },
  {
    id: 6,
    title: "Plans & Pricing",
    path: "/pricing-plans",
    newTab: false,
  },
];
export default menuData;
