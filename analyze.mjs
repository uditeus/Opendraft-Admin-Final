import fs from 'fs';
let data = fs.readFileSync('public/gist_hero_latest.svg', 'utf8');

let re = /<path\s+fill="([^"]+)"[\s\S]*?d="([^"]+)"[\s\S]*?\/>/ig;
let match;
while ((match = re.exec(data)) !== null) {
    if (match[1].toUpperCase() === '#FCFCFC') {
        let d = match[2];
        let subpaths = d.split('M').filter(p => p.trim().length > 0);
        subpaths.forEach((p, i) => {
            let pts = p.split(/[\s,C]+/).filter(x => x).map(Number);
            let xMin = 9999, xMax = -9999, yMin = 9999, yMax = -9999;
            for (let j = 0; j < pts.length; j += 2) {
                if (pts[j] < xMin) xMin = pts[j];
                if (pts[j] > xMax) xMax = pts[j];
                if (pts[j + 1] < yMin) yMin = pts[j + 1];
                if (pts[j + 1] > yMax) yMax = pts[j + 1];
            }
            console.log(`[${i}] len:${p.length} coords: x(${xMin.toFixed(1)}-${xMax.toFixed(1)}) y(${yMin.toFixed(1)}-${yMax.toFixed(1)})`);
        });
    }
}
