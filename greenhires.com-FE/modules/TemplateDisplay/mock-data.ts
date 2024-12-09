import { ResumeData } from "@/interfaces/builder/resume";

export const mockResumeData: ResumeData = {
  basics: {
    name: "John",
    firstname: "John",
    lastname: "Doe",
    headline: "Software Engineer",
    email: "johndoe@gmail.com",
    phone: "1234567890",
    country: "United States",
    city: "San Francisco",
    address: "1234 Main St",
    picture: "/avatar.png",
  },
  sections: {
    aboutme: {
      name: "About Me",
      key: "aboutme",
      visible: true,
      columns: 1,
      content:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.",
    },
    education: {
      name: "Education",
      key: "education",
      visible: true,
      columns: 1,
      items: [
        {
          id: "education-1",
          visible: true,
          school: "Stanford University",
          major: "Computer Science",
          typeOfStudy: "Bachelor's Degree",
          yearGraduation: new Date("2020-01-01"),
          score: "4.0",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
          id: "education-2",
          visible: true,
          school: "Harvard University",
          major: "Computer Science",
          typeOfStudy: "Master's Degree",
          yearGraduation: new Date("2021-01-01"),
          score: "4.0",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
      ],
    },
    experience: {
      name: "Experience",
      key: "experience",
      visible: true,
      columns: 1,
      items: [
        {
          id: "experience-1",
          visible: true,
          company: "Google",
          position: "Software Engineer",
          startDate: new Date("2020-01-01"),
          endDate: new Date("2021-01-01"),
          summary:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.",
        },
        {
          id: "experience-2",
          visible: true,
          company: "Facebook",
          position: "Software Engineer",
          startDate: new Date("2021-01-01"),
          endDate: new Date("2022-01-01"),
          summary:
            "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.",
        },
      ],
    },
    skills: {
      name: "Skills",
      key: "skills",
      visible: true,
      columns: 1,
      items: [
        {
          id: "skills-1",
          visible: true,
          name: "Photoshop",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          level: 4,
          displayBar: "star",
        },
        {
          id: "skills-2",
          visible: true,
          name: "Adobe InDesign",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          level: 5,
          displayBar: "star",
        },
        {
          id: "skills-3",
          visible: true,
          name: "Adobe Illustrator",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          level: 5,
          displayBar: "star",
        },
        {
          id: "skills-4",
          visible: true,
          name: "Microsoft Visual Studio",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          level: 5,
          displayBar: "star",
        },
        {
          id: "skills-5",
          visible: true,
          name: "After Effects",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          level: 5,
          displayBar: "star",
        },
      ],
    },
    languages: {
      name: "Languages",
      key: "languages",
      visible: true,
      columns: 1,
      items: [
        {
          id: "languages-1",
          visible: true,
          name: "English",
          level: 5,
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
          id: "languages-2",
          visible: true,
          name: "Spanish",
          level: 3,
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
      ],
    },
    awards: {
      name: "Awards",
      key: "awards",
      visible: true,
      columns: 1,
      items: [
        {
          id: "awards-1",
          visible: true,
          title: "Best Employee",
          date: new Date("2020-01-01"),
          awarder: "Google",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
      ],
    },
    hobbies: {
      name: "Hobbies",
      key: "hobbies",
      visible: true,
      columns: 1,
      items: [
        {
          id: "hobbies-1",
          visible: true,
          name: "Painting",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
          id: "hobbies-2",
          visible: true,
          name: "Yoga",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
          id: "hobbies-3",
          visible: true,
          name: "Gardening",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
          id: "hobbies-4",
          visible: true,
          name: "Volleyball",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
          id: "hobbies-5",
          visible: true,
          name: "Bowling",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
          id: "hobbies-3",
          visible: true,
          name: "Other",
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
      ],
    },
    courses: {
      name: "Courses",
      key: "courses",
      visible: true,
      columns: 1,
      items: [
        {
          id: "courses-1",
          visible: true,
          name: "Course 1",
          institution: "Institution 1",
          startDate: new Date("2020-01-01"),
          endDate: new Date("2021-01-01"),
        },
      ],
    },
    certifications: {
      name: "Certifications",
      key: "certifications",
      visible: true,
      columns: 1,
      items: [
        {
          id: "certifications-1",
          visible: true,
          title: "Certification 1",
          issuer: "Issuer 1",
          date: new Date("2020-01-01"),
          summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
      ],
    },
    references: {
      name: "References",
      key: "references",
      visible: true,
      columns: 1,
      items: [
        {
          id: "references-1",
          visible: true,
          name: "Reference 1",
          position: "Position 1",
          phone: "1234567890",
          email: "something@gmail.com",
        },
      ],
    },
    links: {
      name: "Links",
      key: "links",
      visible: true,
      columns: 1,
      items: [
        {
          id: "links-1",
          visible: true,
          label: "LinkedIn",
          href: "https://www.linkedin.com",
        },
        {
          id: "links-2",
          visible: true,
          label: "GitHub",
          href: "https://github.com",
        },
      ],
    },
    custom: {
      "custom.adfead": {
        name: "Custom Section 1",
        key: "custom-1",
        visible: true,
        columns: 1,
        items: []
      },
    },
  },
  metadata: {
    template: "Layout 1",
    variant: "",
    section_order: [
      "aboutme",
      "education",
      "experience",
      "skills",
      "languages",
      "awards",
      "hobbies",
      "courses",
      "certifications",
      "references",
      "links",
    ],
  },
};
