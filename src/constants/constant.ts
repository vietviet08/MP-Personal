import aws from "@/assets/AWS.svg";
import azure from "@/assets/Azure.svg";
import cPlusPlus from "@/assets/C++-Ob3WtyTta_brandlogos.net.svg";
import docker from "@/assets/Docker.svg";
import git from "@/assets/Git.svg";
import github from "@/assets/GitHub.svg";
import gitlab from "@/assets/GitLab.svg";
import kubernetes from "@/assets/Kubernetes.svg";
import mongodb from "@/assets/MongoDB.svg";
import nextjs from "@/assets/Next.js-OaGXgRZeP_brandlogos.net.svg";
import nodejs from "@/assets/Node.js.svg";
import postgresql from "@/assets/PostgresSQL.svg";
import spring from "@/assets/Spring.svg";
import tailwindcss from "@/assets/Tailwind CSS.svg";
import c from "@/assets/c-language-seeklogo.svg";
import css from "@/assets/CSS3.svg";
import expressjs from "@/assets/express-js.svg";
import html from "@/assets/HTML5.svg";
import java from "@/assets/java-logo-I5un0lRP_brandlogos.net.svg";
import javascript from "@/assets/javascript-js-seeklogo.svg";
import mysql from "@/assets/mysql-logo-brandlogos.net_7fuk34bn1.svg";
import python from "@/assets/python-logo-EE6D25DA_brandlogos.net.svg";
import react from "@/assets/React.svg";
import typescript from "@/assets/typescript-logo-brandlogos.net_8m25t2gyq.svg";
import django from "@/assets/Django.svg";
import redis from "@/assets/Redis.svg";
import kafka from "@/assets/Apache Kafka.svg";
import boostrap from "@/assets/Bootstrap.svg";
import vue from "@/assets/vue.svg";
import bitbucket from "@/assets/bitbucket.svg";
import nuxt from "@/assets/nuxt.svg";
import scss from "@/assets/scss.svg";
import fastapi from "@/assets/FastAPI.svg";
import firebase from "@/assets/firebase.svg";
import supabase from "@/assets/supabase.svg";
import linux from "@/assets/linux.svg";
import digitalocean from "@/assets/digital-ocean.svg";
import gcp from "@/assets/gcp.svg";
import jenkins from "@/assets/Jenkins.svg";
import rancher from "@/assets/Rancher.svg";
import jira from "@/assets/Jira.svg";
import terraform from "@/assets/terraform.svg";
import nginx from "@/assets/nginx.svg";
import grafana from "@/assets/grafana.svg";
import prometheus from "@/assets/prometheus.svg";
import loki from "@/assets/loki.svg";
import sonarqube from "@/assets/sonarqube.svg";

import PicProject1 from "@/assets/pic-project-1.png";
import PicProject2 from "@/assets/pic-project-2.png";
import PicProject3 from "@/assets/pic-project-3.png";
import PicProject4 from "@/assets/pic-project-4.png";

// ====== Personal Info ======
export const PersonalInfo = {
    name: "Nguyen Quoc Viet",
    shortName: "Viet",
    lastName: "Quoc",
    title: "Software Engineer",
    subtitle: "Backend-focused Developer & DevSecOps Enthusiast",
    description:
        "Backend-focused developer transitioning to DevSecOps, with hands-on delivery experience in CI/CD pipelines, containerized deployment, and cloud-based applications.",
    resumeUrl: "/Nguyen_Quoc_Viet_CV.pdf",
    avatarUrl: "/avatar.jpg",
};

// ====== Navigation ======
export const NavItems = [
    { name: "Home", href: "#home", type: "scroll" },
    { name: "About", href: "#about", type: "scroll" },
    { name: "Experience", href: "#experience", type: "scroll" },
    { name: "Skills", href: "#skills", type: "scroll" },
    { name: "Projects", href: "#projects", type: "scroll" },
    { name: "Blogs", href: "/blogs", type: "link" },
    { name: "Contact", href: "#contact", type: "scroll" },
];

// ====== About Section ======
export const AboutInfo = {
    headline: "Backend-focused Software Engineer & DevSecOps Enthusiast",
    paragraphs: [
        "Backend-focused developer transitioning to DevSecOps, with hands-on delivery experience in CI/CD pipelines, containerized deployment, and cloud-based applications.",
        "Built and maintained delivery workflows using Jenkins, GitHub Actions/GitLab CI, and Docker; supported cloud deployment with AWS ECS Fargate, ECR, S3, and CloudFront.",
        "Applied production-oriented practices including monitoring and log analysis (Prometheus, Grafana, Loki), API security (OAuth2/JWT), and release quality controls (SonarQube, automated testing).",
    ],
    highlights: [
        {
            icon: "Code",
            title: "Backend & API Development",
            description:
                "Building robust REST APIs with Spring Boot, FastAPI. Designing microservices with clean architecture and production-ready patterns.",
        },
        {
            icon: "Cloud",
            title: "DevOps & Cloud Infrastructure",
            description:
                "CI/CD pipelines with Jenkins, GitHub Actions. Container orchestration with Docker & Kubernetes. AWS cloud services deployment.",
        },
        {
            icon: "Shield",
            title: "Security & Monitoring",
            description:
                "OAuth2/OIDC with Keycloak, JWT-based auth, RBAC. Production monitoring with Prometheus, Grafana, and Loki stack.",
        },
    ],
};

// ====== Education ======
export const EducationInfo = [
    {
        school: "Vietnam-Korea University of Information and Communication Technology",
        location: "Da Nang",
        degree: "Information Technology (Enterprise Collaboration Program)",
        period: "Sep 2023 — Apr 2027",
        highlights: [
            "GPA: 3.45/4.0",
            "Academic incentive scholarship recipient for 3 out of 4 semesters",
        ],
    },
];

// ====== Work Experience ======
export const ExperienceInfo = [
    {
        company: "Techzen Company Limited",
        role: "Fullstack Developer",
        project: "Enterprise Work Management System",
        period: "Jun 2025 — Present",
        highlights: [
            "Developed and maintained a production system using FastAPI, Vue.js, and PostgreSQL for task management and team collaboration workflows.",
            "Built and maintained CI/CD pipelines using Jenkins and GitLab CI for backend services, frontend builds, and environment-based deployments.",
            "Integrated SonarQube quality gates and automated tests (Pytest) to improve release quality and catch regressions before deployment.",
            "Implemented file and asset delivery with MinIO, Amazon S3, and CloudFront to improve reliability and delivery performance.",
            "Developed scheduled background jobs for operational automation (data cleanup and notification emails), improving system stability.",
            "Optimized API and database performance with indexing and caching, reducing average response time by 40%.",
        ],
        technologies: ["FastAPI", "Vue.js", "PostgreSQL", "Jenkins", "GitLab CI", "SonarQube", "Docker", "MinIO", "AWS S3", "CloudFront"],
    },
    {
        company: "VKU Training Department",
        role: "Intern Developer",
        project: "Academic Management System",
        period: "Feb 2025 — May 2025",
        highlights: [
            "Developed secure Spring Boot REST APIs with Spring Security, JWT, and OAuth2-based authentication flows.",
            "Containerized frontend/backend services using Docker and Nginx, improving environment consistency across development and deployment.",
            "Implemented account security and recovery features: email verification, password reset, token refresh, and role-based authorization.",
            "Documented APIs with Swagger/OpenAPI, improving developer onboarding and collaboration with frontend teams.",
        ],
        technologies: ["Spring Boot", "Spring Security", "JWT", "OAuth2", "Docker", "Nginx", "Swagger"],
        repoUrl: "https://github.com/PT-LoiX86/GradingWeb",
    },
];

// ====== Skills ======
export const SkillsInfo = [
    {
        title: "DevSecOps & CI/CD",
        skills: [
            { name: "Jenkins", logo: jenkins },
            { name: "GitHub Actions", logo: github },
            { name: "GitLab CI", logo: gitlab },
            { name: "Docker", logo: docker },
            { name: "Kubernetes", logo: kubernetes },
            { name: "Rancher", logo: rancher },
            { name: "Prometheus", logo: prometheus },
            { name: "Grafana", logo: grafana },
            { name: "Loki", logo: loki },
        ],
    },
    {
        title: "Cloud & Infrastructure",
        skills: [
            { name: "AWS", logo: aws },
            { name: "GCP", logo: gcp },
            { name: "Azure", logo: azure },
            { name: "Linux", logo: linux },
            { name: "DigitalOcean", logo: digitalocean },
            { name: "Terraform", logo: terraform },
            { name: "Nginx", logo: nginx },
        ],
    },
    {
        title: "Backend & Systems",
        skills: [
            { name: "Spring Boot", logo: spring },
            { name: "FastAPI", logo: fastapi },
            { name: "Node.js", logo: nodejs },
            { name: "Express.js", logo: expressjs },
            { name: "Django", logo: django },
            { name: "Redis", logo: redis },
            { name: "Kafka", logo: kafka },
        ],
    },
    {
        title: "Programming Languages",
        skills: [
            { name: "Java", logo: java },
            { name: "Python", logo: python },
            { name: "TypeScript", logo: typescript },
            { name: "JavaScript", logo: javascript },
            { name: "C", logo: c },
            { name: "C++", logo: cPlusPlus },
        ],
    },
    {
        title: "Frontend",
        skills: [
            { name: "React", logo: react },
            { name: "Next.js", logo: nextjs },
            { name: "Vue", logo: vue },
            { name: "Nuxt.js", logo: nuxt },
            { name: "Tailwind CSS", logo: tailwindcss },
            { name: "SCSS", logo: scss },
            { name: "HTML", logo: html },
            { name: "CSS", logo: css },
            { name: "Bootstrap", logo: boostrap },
        ],
    },
    {
        title: "Databases & Tools",
        skills: [
            { name: "PostgreSQL", logo: postgresql },
            { name: "MySQL", logo: mysql },
            { name: "MongoDB", logo: mongodb },
            { name: "Firebase", logo: firebase },
            { name: "Supabase", logo: supabase },
            { name: "SonarQube", logo: sonarqube },
            { name: "Git", logo: git },
            { name: "Bitbucket", logo: bitbucket },
            { name: "Jira", logo: jira },
        ],
    },
];

// ====== Technical Skills (text-based for About section) ======
export const TechnicalSkillsText = [
    { category: "DevSecOps & CI/CD", items: "Jenkins, GitHub Actions, GitLab CI, SonarQube, Docker" },
    { category: "Cloud & Infrastructure", items: "AWS (EC2, ECR, S3, CloudFront, Route53, ALB), K8s, Terraform, Rancher, Nginx, MinIO" },
    { category: "Monitoring & Logging", items: "Prometheus, Grafana, Loki, AWS CloudWatch, SNS" },
    { category: "Security", items: "OAuth 2.0/OIDC, JWT, RBAC, Keycloak, AWS IAM, WAF" },
    { category: "Backend & Systems", items: "FastAPI, Spring Boot, Spring Cloud, Redis, MySQL, PostgreSQL" },
    { category: "Languages", items: "Python, Java, TypeScript, SQL, Bash" },
];

// ====== Projects ======
export const ProjectsInfo = [
    {
        title: "ORALIE - Cloud-Native E-commerce Platform",
        description:
            "Designed a microservices-based platform with independently deployable services for user, product, order, payment, and inventory domains. Established Jenkins CI/CD pipelines, deployed on Kubernetes cluster managed via Rancher with 20 Deployments, 4 StatefulSets, 24 Services, 2 Ingresses. Implemented monitoring with Prometheus, Grafana, and Loki. Applied centralized auth with Keycloak and OAuth 2.0/OIDC.",
        image: { PicProject1 },
        technologies: [
            "Spring Boot",
            "Spring Cloud",
            "Kafka",
            "Redis",
            "PostgreSQL",
            "Keycloak",
            "Docker",
            "Kubernetes",
            "Jenkins",
            "Rancher",
            "Prometheus",
            "Grafana",
            "Loki",
            "Nginx Ingress",
            "Next.js",
            "Tailwind CSS",
        ],
        link: "https://github.com/vietviet08/Oralie",
        period: "Dec 2024 — Apr 2025",
    },
    {
        title: "DENTISTRY-WP - AWS Deployment & IaC",
        description:
            "Built GitHub Actions pipelines for linting, testing, and CI/CD for Docker image build/push to AWS ECR followed by deployment to AWS ECS Fargate. Provisioned AWS infrastructure using Terraform modules: VPC, ALB, ECS auto-scaling, RDS PostgreSQL, ElastiCache Redis, and S3. Implemented CloudFront + Route53 + ACM + WAF, and monitoring via CloudWatch, SNS.",
        image: { PicProject3 },
        technologies: [
            "GitHub Actions",
            "AWS ECS Fargate",
            "AWS ECR",
            "Terraform",
            "Docker",
            "Laravel",
            "PostgreSQL",
            "Redis",
            "CloudFront",
            "Route53",
            "WAF",
            "CloudWatch",
            "SNS",
        ],
        link: "https://github.com/vietviet08/dentistry-wp",
        period: "Oct 2025 — Dec 2025",
    },
    {
        title: "BOTTOM CV - Job Portal Platform",
        description:
            "Deployed services on AWS EC2 using Docker and Nginx reverse proxy for consistent delivery. Automated build and deployment with Jenkins; integrated AWS S3 for scalable file storage. Implemented observability with Prometheus and Grafana, and documented APIs via Swagger/OpenAPI.",
        image: { PicProject4 },
        technologies: [
            "Spring Boot",
            "Docker",
            "Jenkins",
            "AWS EC2",
            "AWS S3",
            "Nginx",
            "Prometheus",
            "Grafana",
            "Swagger",
        ],
        link: "https://github.com/vku-k23/bottom-cv",
        period: "May 2025 — Aug 2025",
    },
    {
        title: "Clothing Store - Catcosy",
        description:
            "A full-stack clothing store application with user authentication, product management, and order processing. Built with Spring Boot and Thymeleaf, featuring JWT authentication, AWS S3 file storage, and VN Pay payment integration.",
        image: { PicProject2 },
        technologies: [
            "Spring Boot",
            "Spring Security",
            "JWT",
            "AWS S3",
            "VN Pay",
            "MySQL",
            "Thymeleaf",
            "Bootstrap",
            "Docker",
        ],
        link: "https://github.com/vietviet08/CATCOSY",
        period: "2024",
    },
];

// ====== Contact ======
export const ContactInfo = {
    email: "viezquoc.dev@gmail.com",
    phone: "+84 767 524 805",
    location: "Da Nang, Vietnam",
    socialLinks: {
        github: "https://github.com/vietviet08",
        linkedin: "https://www.linkedin.com/in/viequoc08/",
        facebook: "https://www.facebook.com/viequoc24.08/",
        twitter: "",
        instagram: "",
        youtube: "",
    },
};
