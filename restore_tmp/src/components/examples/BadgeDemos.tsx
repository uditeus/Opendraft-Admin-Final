import { AppIcon } from "@/components/icons/AppIcon";

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

export function BadgeVariants() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  );
}

export function BadgeWithIconLeft() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className="gap-1.5">
        <AppIcon name="BadgeCheck" className="h-3.5 w-3.5" />
        Verified
      </Badge>

      <Badge variant="secondary" className="gap-1.5">
        <AppIcon name="BookmarkIcon" className="h-3.5 w-3.5" />
        Bookmark
      </Badge>
    </div>
  );
}

export function BadgeWithSpinner() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="destructive" className="gap-1.5">
        <Spinner className="h-3.5 w-3.5" />
        Deleting
      </Badge>
      <Badge variant="secondary" className="gap-1.5">
        <Spinner className="h-3.5 w-3.5" />
        Generating
      </Badge>
    </div>
  );
}

export function BadgeAsLink() {
  return (
    <Badge asChild>
      <a href="#link" className="gap-1.5">
        Open Link <AppIcon name="ArrowUpRightIcon" className="h-3.5 w-3.5" />
      </a>
    </Badge>
  );
}

// Nota: para evitar cores hardcoded, estes exemplos usam apenas tokens semânticos do tema.
export function BadgeCustomColors() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline" className="bg-muted">
        Muted
      </Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}
