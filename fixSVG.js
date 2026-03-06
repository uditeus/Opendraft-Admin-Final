const fs = require('fs');

const data = fs.readFileSync('public/hero_temp.svg', 'utf8');

const blueMatch = data.match(/<path fill="#3E768D"[\s\S]*?\/>/);
const whiteMatch = data.match(/<path fill="#FCFCFC"[\s\S]*?\/>/);

if (!blueMatch || !whiteMatch) {
    throw new Error("Could not find paths");
}

let blueStr = blueMatch[0];
let whiteStr = whiteMatch[0];

whiteStr = whiteStr.replace('fill="#FCFCFC"', 'fill="currentColor"');

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
            {/* Blue Circle */}
            ${blueStr}
            
            {/* Drawing Lines */}
            ${whiteStr}
        </svg>
    );
};

export default HeroIllustration;
`;

fs.writeFileSync('src/components/HeroIllustration.tsx', tsx);
console.log("Written successfully");
