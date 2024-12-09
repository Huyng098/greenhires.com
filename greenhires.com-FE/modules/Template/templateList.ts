export type VariantsValue = {
  name: string;
  previews: string;
};

export type TemplateResumeio = {
  name: string;
  previews: string[];
  description?: string;
  variants?: VariantsValue[];
  disabled?: boolean;
};

export const templateList: TemplateResumeio[] = [
  {
    name: "Business 1",
    previews: ["/images/templates/Business_001.png"],
    description: "This is a description",
  },
  {
    name: "Business 2",
    previews: ["/images/templates/Business_002.png"],
    description: "This is a description",
  },
  {
    name: "Business 3",
    previews: ["/images/templates/Business_003.png"],
    description: "This is a description",
  },
  {
    name: "Creativity 1",
    previews: ["/images/templates/Creativity_001.png"],
    description: "This is a description",
  },
  {
    name: "Creativity 2",
    previews: ["/images/templates/Creativity_002.png"],
    description: "This is a description",
  },
  {
    name: "Creativity 3",
    previews: ["/images/templates/Creativity_003.png"],
    description: "This is a description",
  },
  {
    name: "Designing 1",
    previews: ["/images/templates/Designing_001.png"],
    description: "This is a description",
  },
  {
    name: "Designing 2",
    previews: ["/images/templates/Designing_002.png"],
    description: "This is a description",
  },
  {
    name: "Designing 3",
    previews: ["/images/templates/Designing_003.png"],
    description: "This is a description",
  },
  {
    name: "Hospitality 1",
    previews: ["/images/templates/Hospitality_001.png"],
    description: "This is a description",
  },
  {
    name: "Hospitality 2",
    previews: ["/images/templates/Hospitality_002.png"],
    description: "This is a description",
  },
  {
    name: "Hospitality 3",
    previews: ["/images/templates/Hospitality_003.png"],
    description: "This is a description",
  },
  {
    name: "Hospitality 4",
    previews: ["/images/templates/Hospitality_004.png"],
    description: "This is a description",
  },
  {
    name: "Hospitality 5",
    previews: ["/images/templates/Hospitality_005.png"],
    description: "This is a description",
  },
  {
    name: "Hospitality 6",
    previews: ["/images/templates/Hospitality_006.png"],
    description: "This is a description",
  },
  {
    name: "Template 1",
    previews: ["/images/templates/1.png"],
    description: "This is a description",
  },
  {
    name: "Template 2",
    previews: ["/images/templates/2.png"],
    description: "This is a description",
    variants: [
      {
        name: "#7CA655",
        previews: "/images/templates/2.png",
      },
      {
        name: "#AA5881",
        previews: "/images/templates/2-b.png",
      },
      {
        name: "#7F7F7F",
        previews: "/images/templates/2-c.png",
      },
    ],
  },
  {
    name: "Template 3",
    previews: ["/images/templates/3.png"],
    description: "This is a description",
  },
  {
    name: "Template 4",
    previews: ["/images/templates/4.png"],
    description: "This is a description",
  },
  {
    name: "Template 5",
    previews: ["/images/templates/5.png"],
    description: "This is a description",
  },
  {
    name: "Template 8",
    previews: ["/images/templates/8.png"],
  },
  {
    name: "Template 6",
    previews: ["/images/templates/6.png"],
  },
  {
    name: "Template 7",
    previews: ["/images/templates/7.png"],
  },

  {
    name: "Template 9",
    previews: ["/images/templates/9.png"],
  },
  {
    name: "Template 10",
    previews: ["/images/templates/10.png"],
  },
  {
    name: "Template 11",
    previews: ["/images/templates/11.png"],
  },
  {
    name: "Template 12",
    previews: ["/images/templates/12.png"],
  },
  {
    name: "Template 13",
    previews: ["/images/templates/13.png"],
  },
  {
    name: "Template 14",
    previews: ["/images/templates/14.png"],
  },
  {
    name: "Template 15",
    previews: ["/images/templates/15.png"],
  },
  {
    name: "Template 16",
    previews: ["/images/templates/16.png"],
  },
  {
    name: "Template 17",
    previews: ["/images/templates/17.png"],
  },
  {
    name: "Template 18",
    previews: ["/images/templates/18.png"],
  },
  {
    name: "Template 19",
    previews: ["/images/templates/19.png"],
  },

  {
    name: "Template 20",
    previews: ["/images/templates/20.png"],
    disabled: true,
  },
  {
    name: "Template 21",
    previews: ["/images/templates/21.png"],
    disabled: true,
  },
  {
    name: "Template 22",
    previews: ["/images/templates/22.png"],
    disabled: true,
  },
  {
    name: "Template 23",
    previews: ["/images/templates/23.png"],
    disabled: true,
  },
  {
    name: "Template 24",
    previews: ["/images/templates/24.png"],
    disabled: true,
  },
  {
    name: "Template 25",
    previews: ["/images/templates/25.png"],
    disabled: true,
  },
];
