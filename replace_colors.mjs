import fs from 'fs';
let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');
content = content.replace(/#d97757/g, '#3E768D').replace(/#c6684a/g, '#2c5a6b');
fs.writeFileSync('src/pages/Index.tsx', content);
console.log('Replaced colors in Index.tsx');
