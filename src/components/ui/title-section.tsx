import React from "react";

export default interface TitleSectionProps {
    id: string;
    className?: string;
    title: string;
    description?: string;
    children?: React.ReactNode;
}

export const TitleSection = (props: TitleSectionProps) => {
    return (
        <section
            id={props.id}
            className={`relative min-h-[calc(100vh)] py-24 pb-24 px-[5vw] md:px-[7vw] lg:px-[20vw] font-sans bg-skills-gradient clip-path-custom ${props.className}`}
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold ">
                    {props.title}
                </h2>

                <p className="text-gray-400 mt-4 text-lg font-semibold">
                    {props.description}
                </p>
            </div>
            {props.children}
        </section>
    );
};
