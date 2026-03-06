import React from 'react';
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface HeroIllustrationProps {
	className?: string;
}

const HeroIllustration: React.FC<HeroIllustrationProps> = ({ className }) => {
	const { resolvedTheme } = useTheme();
	const src = resolvedTheme === 'dark' ? '/hero-v2-dark.png' : '/hero-v2-light.png';

	return (
		<div className={cn("relative flex items-center justify-center md:justify-end", className)}>
			<div className="relative w-full max-w-[1800px] transition-all duration-500">
				<img
					src={src}
					alt="Opendraft Hero Illustration"
					className="w-full h-auto object-contain"
				/>
			</div>
		</div>
	);
};

export default HeroIllustration;
