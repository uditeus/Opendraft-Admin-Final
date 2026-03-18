
import Jimp from 'jimp';

async function main() {
    try {
        // Jimp 1.0+ changed its API
        // Let's use the simplest CommonJS style if possible, but we are in ESM
        const image = await Jimp.read('public/favicon-light.png');
        image.invert();
        await image.write('public/favicon-light.png');
        console.log('Invertido com sucesso');
    } catch (err) {
        console.error(err);
    }
}

main();
