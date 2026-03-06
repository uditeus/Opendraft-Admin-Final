import { AspectRatio } from "@/components/ui/aspect-ratio";
import { GLOBAL_IMAGE_URL } from "@/lib/constants";

const demoImageSrc = GLOBAL_IMAGE_URL;

function DemoImage(props: { alt: string }) {
  return (
    <img
      src={demoImageSrc}
      alt={props.alt}
      className="h-full w-full rounded-md object-cover"
      loading="lazy"
    />
  );
}

export function AspectRatioDemo() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9}>
        <DemoImage alt="Imagem demo em proporção 16:9" />
      </AspectRatio>
    </div>
  );
}

export function AspectRatioSquare() {
  return (
    <div className="w-full max-w-[320px]">
      <AspectRatio ratio={1}>
        <DemoImage alt="Imagem demo em proporção 1:1" />
      </AspectRatio>
    </div>
  );
}

export function AspectRatioPortrait() {
  return (
    <div className="w-full max-w-[320px]">
      <AspectRatio ratio={3 / 4}>
        <DemoImage alt="Imagem demo em proporção 3:4" />
      </AspectRatio>
    </div>
  );
}
