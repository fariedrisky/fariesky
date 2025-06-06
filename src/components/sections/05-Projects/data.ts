import { ProjectsData } from "./types";

export const projectsData: ProjectsData = {
    title: "Projects",
    projects: [
        {
            id: 1,
            title: "BP Project Booth",
            description: "The best photo booth vendor website that offers various interesting photo booth information and services, complete with the convenience of ordering online.",
            image: [
                "/assets/images/projects/bp-project/1.jpg",
                "/assets/images/projects/bp-project/2.jpg",
                "/assets/images/projects/bp-project/3.jpg",
                "/assets/images/projects/bp-project/4.jpg",
                "/assets/images/projects/bp-project/5.jpg",
                "/assets/images/projects/bp-project/6.jpg",
                "/assets/images/projects/bp-project/7.jpg",
                "/assets/images/projects/bp-project/8.jpg",
                "/assets/images/projects/bp-project/9.jpg",
                "/assets/images/projects/bp-project/10.jpg",
                "/assets/images/projects/bp-project/11.jpg",
            ],
            url: "https://bp-projectbooth.com",
            techStack: [
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Framer Motion",
            ],
            features: [
                "Online Booking System",
                "Real-time Availability Check",
                "Photo Gallery",
            ],
            date: "January 2025"
        },
        {
            id: 2,
            title: "FoodGuardian",
            description: "A website that provides a catalog of food that is nearing its expiration date but is still edible at affordable prices from various trusted merchants.",
            image: [
                "/assets/images/projects/foodguardian.jpg",
                "/assets/images/projects/foodguardian2.jpg",
                "/assets/images/projects/foodguardian3.jpg",
                "/assets/images/projects/foodguardian4.jpg"
            ],
            url: "https://sdg-12-b-frontend.vercel.app/",
            techStack: [
                "React Vite",
                "Tailwind CSS",
                "Node.js",
                "Express.js",
                "MongoDB",
                "Zustand",
            ],
            features: [
                "Food Catalog Management",
                "Expiry Date Tracking",
                "Merchant Dashboard",
                "Real-time Stock Updates",
                "Order Management System"
            ],
            date: "November 2023"
        },
        {
            id: 3,
            title: "Unaya",
            description: "Abulyatama University website that presents the latest news, event information, as well as various activities and important announcements about the campus in a complete and updated manner.",
            image: [
                "/assets/images/projects/unaya.jpg",
                "/assets/images/projects/unaya2.jpg",
                "/assets/images/projects/unaya3.jpg"
            ],
            url: "https://unaya.ac.id",
            techStack: [
                "React Vite",
                "Tailwind CSS",
                "Node.js",
                "Express.js",
                "PostgreSQL",
            ],
            features: [
                "News Management System",
                "Event Calendar",
                "Student Portal Integration",
                "Academic Program Directory",
                "Faculty & Staff Directory",
                "Dynamic Content Management"
            ],
            date: "October 2023"
        },
    ]
};
