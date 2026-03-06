import fs from 'fs';
let data = fs.readFileSync('public/gist_hero_latest.svg', 'utf8');

let newPaths = [];
let re = /<path\s+fill="([^"]+)"[\s\S]*?\/>/ig;
let match;
while ((match = re.exec(data)) !== null) {
    let fill = match[1].toUpperCase();
    if (fill === '#3E768D') {
        newPaths.push(match[0]);
    } else if (fill === '#FCFCFC') {
        let newPath = match[0].replace(/fill="[^"]+"/, 'fill="currentColor"');
        newPaths.push(newPath);
    }
}

const tsx = `import React from 'react';
import { cn } from "@/lib/utils";

interface HeroIllustrationProps {
    className?: string;
}

const HeroIllustration: React.FC<HeroIllustrationProps> = ({ className }) => {
    return (
        <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 1920 1080"
            enableBackground="new 0 0 1920 1080"
            xmlSpace="preserve"
            className={cn("w-full h-auto", className)}
        >
            <g style={{ color: 'currentColor' }}>
            ${newPaths.join('\n            ')}
            </g>
        </svg>
    );
};

export default HeroIllustration;
`;

fs.writeFileSync('src/components/HeroIllustration.tsx', tsx);
console.log("Updated HeroIllustration.tsx successfully.");
