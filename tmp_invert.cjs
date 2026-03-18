
const { Jimp } = require('jimp');

async function main() {
    try {
        const image = await Jimp.read('public/favicon-light.png');
        image.invert();
        await image.write('public/favicon-light.png');
        console.log('Invertido com sucesso');
    } catch (err) {
        console.error(err);
    }
}

main();
