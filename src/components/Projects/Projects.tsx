import { TitleSection } from "@/components/ui/title-section";
import React from "react";

export const Projects = () => {
    return (
        <TitleSection
            className="bg-gray-50 dark:bg-[#111827]"
            id={"projects"}
            title={"Projects"}
            description="Here are some of my projects that showcase my skills and creativity. Each project reflects my passion for coding and problem-solving."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Example Project Card */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-2">
                        Project Title
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Brief description of the project, highlighting its
                        features and technologies used.
                    </p>
                    <a href="#" className="text-primary hover:underline">
                        View Project
                    </a>
                </div>
                {/* Repeat for more projects */}
            </div>
        </TitleSection>
    );
};
