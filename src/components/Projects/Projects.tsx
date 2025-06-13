import { TitleSection } from "@/components/ui/title-section";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import PicProject from "@/assets/pic-project.png";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { ProjectsInfo } from "@/app/constants/constant";

export const Projects = () => {
    return (
        <TitleSection
            className="bg-gray-50 dark:bg-[#111827]"
            id={"projects"}
            title={"Projects"}
            description="Here are some of my projects that showcase my skills and creativity. Each project reflects my passion for coding and problem-solving."
        >
            <div className="grid grid-cols-1 gap-8">
                {ProjectsInfo.map((project, index) => (
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                        key={index}
                    >
                        <div
                            className={cn("flex flex-col", {
                                "md:flex-row-reverse": index % 2 === 0,
                                "md:flex-row": index % 2 !== 0,
                            })}
                        >
                            <div className="w-full md:w-1/2 p-4">
                                <div className="overflow-hidden rounded-md">
                                    <Image
                                        src={Object.values(project.image)[0]}
                                        alt="Project Thumbnail"
                                        width={500}
                                        height={300}
                                        className="w-full h-auto object-cover rounded-md hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-gray-50 dark:bg-gray-900/30">
                                <div>
                                    <h3 className="text-2xl font-semibold mb-3">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-4">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.technologies.map(
                                            (tech, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="secondary"
                                                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                                >
                                                    {tech}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-primary hover:underline font-medium"
                                    >
                                        <ExternalLink />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </TitleSection>
    );
};
