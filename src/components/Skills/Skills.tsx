import React from "react";
import Image from "next/image";
import { SkillsInfo } from "@/app/constants/constant";

export const Skills = () => {
    return (
        <section
            id="skills"
            className="relative min-h-[calc(100vh-64px)] py-24 pb-24 px-[5vw] md:px-[7vw] lg:px-[20vw] font-sans bg-skills-gradient clip-path-custom"
        >
            {/* Section Title */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold ">Skills</h2>

                <p className="text-gray-400 mt-4 text-lg font-semibold">
                    The skills, tools and technologies I am really good at:
                </p>
            </div>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SkillsInfo.map((skillCategory, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                    >
                        <h3 className="text-2xl text-center font-semibold mb-4">
                            {skillCategory.title}
                        </h3>
                        <div className="flex items-center justify-center flex-wrap gap-4">
                            {skillCategory.skills.map((skill, skillIndex) => (
                                <Image
                                    key={skillIndex}
                                    src={skill.logo}
                                    alt={skill.name}
                                    className="h-14 w-14 object-contain"
                                    width={60}
                                    height={60}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
