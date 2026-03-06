import fs from 'fs';
const filePath = 'src/pages/Pricing.tsx';
let content = fs.readFileSync(filePath, 'utf8');

/**
 * STANDARD ALIGNMENT AND THEME SUPPORT
 */
const getIconTag = (label, assetPath) => {
    // Shared filters for transparency and theme support
    const baseClasses = "w-full h-full object-contain object-left grayscale brightness-110 contrast-150 mix-blend-multiply dark:invert dark:mix-blend-screen transition-all";

    // Normalize based on PNG padding
    // Free (Sprout) has very large padding, so it needs a bigger container to look the same size
    let wrapperSize = "w-20 h-20 -ml-2";
    if (label === 'Creator') {
        wrapperSize = "w-32 h-24 -ml-6 -mt-2";
    }

    return `<div className="${wrapperSize} mb-2 overflow-visible">
                                <img 
                                    src="/src/assets/${assetPath}" 
                                    alt="${label}" 
                                    className="${baseClasses}" 
                                />
                            </div>`;
};

// Pricing.tsx markers in AppPricing structure:
const replaceIconSvg = (label, assetPath) => {
    const searchStr = `<h3 className="text-2xl font-semibold mb-1 dark:text-white">${label}</h3>`;
    const headingIdx = content.indexOf(searchStr);
    if (headingIdx === -1) {
        console.log(`Heading not found: ${label}`);
        return;
    }

    // Search backward for the SVG container
    const svgEnd = content.lastIndexOf('</svg>', headingIdx);
    const svgStart = content.lastIndexOf('<div className="mb-6', svgEnd);

    if (svgStart !== -1 && svgEnd !== -1) {
        const fullSvgContainerEnd = content.indexOf('</div>', svgEnd) + 6;
        const newPart = getIconTag(label, assetPath);
        content = content.slice(0, svgStart) + newPart + content.slice(fullSvgContainerEnd);
    }
};

// Apply
replaceIconSvg('Creator', 'icon_free_raw.png');
replaceIconSvg('Strategist', 'icon_pro_raw.png');
replaceIconSvg('Authority', 'icon_team_raw.png');

fs.writeFileSync(filePath, content);
console.log('Final alignment: Standardized sizes and far-left alignment applied to restored layout.');
