import fs from 'fs';
let data = fs.readFileSync('public/gist_hero_latest.svg', 'utf8');

let newPaths = [];
let re = /<path\s+fill="([^"]+)"[\s\S]*?d="([^"]+)"[\s\S]*?\/>/ig;
let match;
while ((match = re.exec(data)) !== null) {
    let fill = match[1].toUpperCase();
    if (fill === '#3E768D') {
        newPaths.push(match[0]);
    } else if (fill === '#FCFCFC') {
        let d = match[2];
        let subpaths = d.split('M').filter(p => p.trim().length > 0);
        console.log('Found ' + subpaths.length + ' subpaths in #FCFCFC');
        subpaths.forEach((p, i) => console.log(i, p.length));

        // Find the longest subpath
        let longest = '';
        subpaths.forEach(p => {
            if (p.length > longest.length) longest = p;
        });

        console.log('Longest is ' + longest.length);

        // Reconstruct just the longest one
        let newD = 'M' + longest;
        let newPath = match[0].replace(/fill="[^"]+"/, 'fill="currentColor"').replace(/d="[^"]+"/, 'd="' + newD + '"');
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
