import { Icons } from "@/components/icons";
import { House, Library } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Astro } from "@/components/ui/svgs/astro";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Javascript } from "@/components/ui/svgs/javascript";
import { Flask } from "@/components/ui/svgs/flask";
import { Pytorch } from "@/components/ui/svgs/pytorch";
import { Snowflake } from "@/components/ui/svgs/snowflake";
import { Mongodb } from "@/components/ui/svgs/mongodb";
import { Redis } from "@/components/ui/svgs/redis";
import { Firebase } from "@/components/ui/svgs/firebase";
import { Swift } from "@/components/ui/svgs/swift";
import { Tailwindcss } from "@/components/ui/svgs/tailwindcss";
import { Cplusplus } from "@/components/ui/svgs/cplusplus";

export const DATA = {
  name: "Alan Nhan - Software Engineer",
  initials: "AN",
  url: "https://alannhvn.com",
  location: "Los Angeles, CA",
  locationLink: "https://www.google.com/maps/place/los+angeles+ca",
  description:
    "Full-stack software engineer with a passion for problem-solving, building across web, data, and AI-driven products.",
  summary:
    "I'm a software engineer pursuing a [Master of Science in Computer Science at USC](/#education), graduating in 2026, with experience across data engineering, full-stack development, and applied AI. I've [competed in hackathons](/#projects) with Reddit and Dell x NVIDIA, and I'm actively looking for full-time opportunities in software, data, or AI engineering.",
  avatarUrl: "/picofme.png",
  ogImage: "/picofme.png",
  sections: {
    about: { order: 1, enabled: true, heading: "About" },
    work: { order: 2, enabled: true, heading: "Work Experience", presentLabel: "Present" },
    education: { order: 3, enabled: true, heading: "Education" },
    skills: { order: 4, enabled: true, heading: "Skills" },
    projects: {
      order: 5, enabled: true,
      label: "Projects",
      text: "I've worked on a variety of projects, from hackathon-winning games to full-stack apps. Here are a few of my favorites.",
    },
    photos: {
      order: 6, enabled: true,
      heading: "Life as of Recently",
    },
    blog: {
      order: 7, enabled: false,
      heading: "Latest Blog Posts",
    },
    contact: {
      order: 8, enabled: true,
      label: "Get in Touch",
      text: "Whether you're hiring, have a project in mind, or just want to talk shop about software, data, or AI, I'd love to hear from you. Send me a message on LinkedIn or shoot me an email, and I'll get back to you as soon as I can.",
    },
  },
  photos: [
    { src: "/photos/cat.jpeg", alt: "My cat" },
    { src: "/photos/camping.jpeg", alt: "Camping trip" },
    { src: "/photos/golfing.JPG", alt: "Golfing" },
    { src: "/photos/unreal-poke.jpeg", alt: "Unreal Poke in Arcadia" },
    { src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80", alt: "Times Square, NYC" },
    { src: "https://images.unsplash.com/photo-1592919505780-303950717480?w=800&auto=format&fit=crop&q=80", alt: "A day on the course" },
    { src: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&auto=format&fit=crop&q=80", alt: "Hollywood, LA" },
    { src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80", alt: "Vintage tees" },
    { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80", alt: "Coffee with friends" },
  ] as { src: string; alt: string }[],
  skills: [
    { name: "Python", icon: Python },
    { name: "JavaScript", icon: Javascript },
    { name: "TypeScript", icon: Typescript },
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Node.js", icon: Nodejs },
    { name: "Flask", icon: Flask },
    { name: "PyTorch", icon: Pytorch },
    { name: "PostgreSQL", icon: Postgresql },
    { name: "MongoDB", icon: Mongodb },
    { name: "Snowflake", icon: Snowflake },
    { name: "Redis", icon: Redis },
    { name: "Firebase", icon: Firebase },
    { name: "Tailwind CSS", icon: Tailwindcss },
    { name: "Swift", icon: Swift },
    { name: "C++", icon: Cplusplus },
    { name: "Astro", icon: Astro },
  ],
  navbar: [
    { href: "/", icon: House, label: "Home" },
    { href: "/blog", icon: Library, label: "Blog" },
  ],
  contact: {
    email: "alannhan443@gmail.com",
    tel: undefined,
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/nhvn",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/alannhans",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:alannhan443@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Houlihan Lokey",
      href: "https://www.hl.com",
      badges: [],
      location: "Los Angeles, CA",
      title: "Data Engineer Intern",
      logoUrl: "/logos/houlihan-lokey.png",
      start: "June 2025",
      end: "August 2026",
      description:
        "Built Python and Snowflake pipelines to clean and deduplicate Salesforce data, and integrated the Gemini API to automate entity resolution across 2,000+ corporate accounts.",
    },
    {
      company: "theCoderSchool",
      href: "https://www.thecoderschool.com",
      badges: [],
      location: "Pasadena, CA",
      title: "Code Coach",
      logoUrl: "/logos/thecoderschool.png",
      start: "March 2024",
      end: "November 2024",
      description:
        "Taught weekly 1-on-1 lessons in Python, Scratch, and Swift, tailoring each session to the student's skill level and interests.",
    },
    {
      company: "Lexor Inc.",
      href: "https://lexor.com",
      badges: [],
      location: "Westminster, CA",
      title: "Web Development Intern",
      logoUrl: "/logos/chair.svg",
      start: "April 2023",
      end: "June 2023",
      description:
        "Built a React-based product builder on Shopify's Storefront API with real-time pricing, and improved theme accessibility with ARIA labels and keyboard navigation.",
    },
  ],
  education: [
    {
      school: "University of Southern California",
      href: "https://www.usc.edu",
      degree: "Master of Science, Computer Science",
      logoUrl: "/logos/usc.png",
      start: "2025",
      end: "2026",
    },
    {
      school: "Cal State Long Beach",
      href: "https://www.csulb.edu",
      degree: "Full-Stack Software Development Program",
      logoUrl: "/logos/csulb.svg",
      start: "2022",
      end: "2023",
    },
    {
      school: "University of California, Irvine",
      href: "https://uci.edu",
      degree: "Bachelor of Science, Natural Sciences",
      logoUrl: "/logos/uci.ico",
      start: "2019",
      end: "2021",
    },
  ],
  projects: [
    {
      title: "Karma Maze",
      slug: "karma-maze",
      href: "https://www.reddit.com/r/KarmaMaze/",
      dates: "November 2024 - January 2025",
      active: true,
      blurb: "Reddit-integrated maze game built for a hackathon.",
      description:
        "A Reddit-integrated maze adventure game built for the Reddit Puzzles & Games Hackathon. Players guide daring Snoos through procedurally generated mazes, collecting karma and overcoming challenges, reaching 1,000+ Reddit users on both desktop and mobile.",
      technologies: ["Devvit", "JavaScript", "Node.js", "React", "Redis", "TypeScript"],
      links: [
        {
          type: "Reddit",
          href: "https://www.reddit.com/r/KarmaMaze/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/nhvn/karmamaze",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/karma-maze.png",
      video: "",
    },
    {
      title: "AugmentAI",
      slug: "augmentai",
      href: "https://github.com/nhvn/data-aug",
      dates: "August 2024 - November 2024",
      active: true,
      blurb: "GAN-based platform for synthetic image generation.",
      description:
        "A generative AI platform for data augmentation and synthetic image generation, awarded honorable mention at the Dell x NVIDIA HackAI Hackathon. Uses a GAN-based model with a Stability AI API fallback, scaled with NVIDIA AI Workbench.",
      technologies: ["Python", "PyTorch", "Flask", "NVIDIA AI Workbench", "JavaScript"],
      links: [
        {
          type: "Demo",
          href: "https://www.youtube.com/watch?v=acIyUkKU0uQ&t=6s",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/nhvn/data-aug",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/augmentai.png",
      video: "",
    },
    {
      title: "BeFit v2",
      slug: "befit-v2",
      href: "https://befit-v2.zachuri.com/login",
      dates: "February 2024 - August 2024",
      active: true,
      blurb: "Fitness tracker for workouts, diet, and weight.",
      description:
        "A fitness companion app for tracking weight-loss progress, diet, and workouts. Built with a team of two other engineers, later expanded into a native iOS app using Swift for a seamless mobile experience.",
      technologies: ["Next.js", "Shadcn UI", "Tailwind CSS", "Supabase", "PostgreSQL", "Stripe", "Swift"],
      links: [
        {
          type: "Website",
          href: "https://befit-v2.zachuri.com/login",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/nhvn/befitv2app",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/befit-v2.png",
      video: "",
    },
    {
      title: "Task Master",
      slug: "task-master",
      href: "https://github.com/nhvn/to-do-list",
      dates: "April 2023 - June 2023",
      active: false,
      blurb: "To-do app with tasks, priorities, and notes.",
      description:
        "A productivity tool for creating, editing, and tracking tasks with due dates, priorities, and sticky notes. Built a REST API with Node.js, Express, and MongoDB, supporting 100+ users and 10,000+ tasks across 5 teams.",
      technologies: ["React", "Node.js", "Express", "PostgreSQL", "MongoDB", "HTML", "CSS"],
      links: [
        {
          type: "Source",
          href: "https://github.com/nhvn/to-do-list",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/task-master.png",
      video: "",
    },
    {
      title: "Smart Lighting Control System",
      slug: "smart-lighting-control-system",
      href: "https://github.com/nhvn",
      dates: "February 2023 - March 2023",
      active: false,
      blurb: "IoT system for automated home lighting.",
      description:
        "An IoT automation solution for precise control of up to 50 lights across 10 rooms with customizable schedules, built on a Raspberry Pi with multithreaded parallel light control.",
      technologies: ["Python", "Flask", "Raspberry Pi"],
      links: [],
      image: "/projects/smart-lighting-control-system.png",
      video: "",
    },
    {
      title: "Pumpkin Lostte Game",
      slug: "pumpkin-lostte-game",
      href: "https://pumpkin-lost-te.web.app/",
      dates: "October 2022 - February 2023",
      active: false,
      blurb: "Halloween-themed twist on Flappy Bird.",
      description:
        "A Halloween-themed twist on Flappy Bird, where players guide Jerry to rescue his lost pumpkin by dodging obstacles. Built with an object-oriented architecture using ES6 classes and HTML5 Canvas.",
      technologies: ["JavaScript", "HTML", "CSS", "Firebase"],
      links: [
        {
          type: "Website",
          href: "https://pumpkin-lost-te.web.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/nhvn/first-browser-game",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/pumpkin-lostte-game.png",
      video: "",
    },
  ],
} as const;
