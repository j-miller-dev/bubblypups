import React from 'react';

interface SectionHeadingProps {
    subtitle: string;
    title: string;
    theme?: 'light' | 'dark';
    className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
                                                           subtitle,
                                                           title,
                                                           theme = 'light',
                                                           className = ""
                                                       }) => {
    const subtitleColors = {
        light: 'text-pink-400',
        dark: 'text-indigo-400'
    };

    const titleColors = {
        light: 'text-gray-950',
        dark: 'text-white'
    };

    return (
        <div className={className}>
            <h2 className={`text-center text-base/7 font-semibold ${subtitleColors[theme]}`}>
                {subtitle}
            </h2>
            <p className={`mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance ${titleColors[theme]} sm:text-5xl`}>
                {title}
            </p>
        </div>
    );
};

export default SectionHeading;
