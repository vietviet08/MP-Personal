// Import all logos from assets
import aws from "@/assets/AWS.svg";
import azure from "@/assets/Azure.svg";
import cPlusPlus from "@/assets/C++-Ob3WtyTta_brandlogos.net.svg";
import docker from "@/assets/Docker.svg";
import git from "@/assets/Git.svg";
import github from "@/assets/GitHub.svg";
import gitlab from "@/assets/GitLab.svg";
import jenkins from "@/assets/Jenkins.svg";
import jira from "@/assets/Jira.svg";
import kubernetes from "@/assets/Kubernetes.svg";
import mongodb from "@/assets/MongoDB.svg";
import nextjs from "@/assets/Next.js-OaGXgRZeP_brandlogos.net.svg";
import nodejs from "@/assets/Node.js.svg";
import postgresql from "@/assets/PostgresSQL.svg";
import rancher from "@/assets/Rancher.svg";
import spring from "@/assets/Spring.svg";
import tailwindcss from "@/assets/Tailwind CSS.svg";
import c from "@/assets/c-language-seeklogo.svg";
import css from "@/assets/CSS3.svg";
import expressjs from "@/assets/express-js.svg";
import html from "@/assets/HTML5.svg";
import java from "@/assets/java-logo-I5un0lRP_brandlogos.net.svg";
import javascript from "@/assets/javascript-js-seeklogo.svg";
import mysql from "@/assets/mysql-logo-brandlogos.net_7fuk34bn1.svg";
import nodeJsLogo from "@/assets/node.js-logo-brandlogos.net_9gb0f3wp3.svg";
import python from "@/assets/python-logo-EE6D25DA_brandlogos.net.svg";
import react from "@/assets/React.svg";
import typescript from "@/assets/typescript-logo-brandlogos.net_8m25t2gyq.svg";
import django from "@/assets/Django.svg";
import flask from "@/assets/Flask.svg";
import redis from "@/assets/Redis.svg";
import kafka from "@/assets/Apache Kafka.svg";
import boostrap from "@/assets/Bootstrap.svg";

import PicProject1 from "@/assets/pic-project-1.png";
import PicProject2 from "@/assets/pic-project-2.png";

export const SkillsInfo = [
    {      
        title: "Programming Languages",
        skills: [
            {name: "JavaScript", logo: javascript},
            {name: "TypeScript", logo: typescript},
            {name: "Python", logo: python},
            {name: "Java", logo: java},
            {name: "C", logo: c},
            {name: "C++", logo: cPlusPlus},
        ],

    },
    {
        title: "Frontend",
        skills: [
            {name: "HTML", logo: html},
            {name: "CSS", logo: css},
            {name: "React", logo: react},
            {name: "Next.js", logo: nextjs},
            {name: "Express.js", logo: expressjs},
            {name: "Tailwind CSS", logo: tailwindcss},
            {name: "Bootstrap", logo: boostrap},
        ],
    },
    {
        title: "Backend",
        skills: [
            {name: "Spring Boot", logo: spring},
            {name: "Node.js", logo: nodejs},
            {name: "Express.js", logo: expressjs},
            {name: "Django", logo: django}, 
            {name: "Flask", logo: flask}, 
            {name: "Redis", logo: redis}, 
            {name: "Kafka", logo: kafka}, 
        ],
    },
    {
        title: "Databases",
        skills: [
            {name: "MySQL", logo: mysql},
            {name: "PostgreSQL", logo: postgresql},
            {name: "MongoDB", logo: mongodb},
        ],
    },
    {
        title: "DevOps & Cloud",
        skills: [
            {name: "Docker", logo: docker},
            {name: "Kubernetes", logo: kubernetes},
            {name: "AWS", logo: aws},
            {name: "Azure", logo: azure},
        ],
    },
    {
        title: "Version Control & Collaboration",
        skills: [
            {name: "Git", logo: git},
            {name: "GitHub", logo: github},
            {name: "GitLab", logo: gitlab},
        ],
    },
]

export const ProjectsInfo = [
    {
        title: "Microservices E-commerce Platform - Oralie",
        description: "A scalable e-commerce platform built with microservices architecture. It includes user authentication, product management, and order processing.",
        image: {PicProject1},
        technologies: ["Spring Boot", "Spring Cloud", "Eureka", "Kafka", "Redis", "PostgresSql", "Keycloak", 
                        "AWS S3", "Paypal", "MySql", "NextJs", "Tailwind CSS",
                        "Shadcn", "TypeScript", "Grafana", "Loki", "Prometheus", "Docker", "Kubernetes", "Jenkins"],
        link: "https://github.com/vietviet08/Oralie"
    },
    {
        title: "Clothing Store - Catcosy",
        description: "A full-stack clothing store application with user authentication, product management, and order processing. Built with Spring Boot and Thymeleaf.",
        image: {PicProject2},
        technologies: ["Spring Boot", "Spring Security", "JWT", "Mail Service",
                        "AWS S3", "VN Pay", "MySql", "Thymeleaf", "Bootstrap", "Docker"],
        link: "https://github.com/vietviet08/CATCOSY"
    },
]