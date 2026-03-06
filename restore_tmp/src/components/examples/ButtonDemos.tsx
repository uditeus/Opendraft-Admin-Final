import * as React from "react";
import { AppIcon } from "@/components/icons/AppIcon";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

export function ButtonSize() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" className="h-8 px-2 text-xs">
        Extra Small <AppIcon name="ArrowUpRightIcon" />
      </Button>
      <Button size="sm">
        Small <AppIcon name="ArrowUpRightIcon" />
      </Button>
      <Button>
        Default <AppIcon name="ArrowUpRightIcon" />
      </Button>
      <Button size="lg">
        Large <AppIcon name="ArrowUpRightIcon" />
      </Button>
    </div>
  );
}

export function ButtonDefault() {
  return <Button>Button</Button>;
}

export function ButtonOutline() {
  return <Button variant="outline">Outline</Button>;
}

export function ButtonSecondary() {
  return <Button variant="secondary">Secondary</Button>;
}

export function ButtonGhost() {
  return <Button variant="ghost">Ghost</Button>;
}

export function ButtonDestructive() {
  return <Button variant="destructive">Destructive</Button>;
}

export function ButtonLink() {
  return <Button variant="link">Link</Button>;
}

export function ButtonIcon() {
  return (
    <Button variant="outline" size="icon" aria-label="Action">
      <AppIcon name="CircleFadingArrowUpIcon" />
    </Button>
  );
}

export function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <AppIcon name="GitBranchIcon" /> New Branch
    </Button>
  );
}

export function ButtonRounded() {
  return (
    <Button className="rounded-full" variant="outline">
      <AppIcon name="ArrowUpIcon" /> Rounded
    </Button>
  );
}

export function ButtonSpinner() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" disabled className="gap-2">
        <Spinner /> Generating
      </Button>
      <Button variant="outline" disabled className="gap-2">
        <Spinner /> Downloading
      </Button>
    </div>
  );
}

export function ButtonGroupDemo() {
  const [label, setLabel] = React.useState("personal");

  return (
    <ButtonGroup className="flex flex-wrap gap-2">
      <ButtonGroup className="hidden sm:inline-flex">
        <Button variant="outline" size="icon" aria-label="Go Back">
          <AppIcon name="ArrowLeftIcon" />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More Options">
              <AppIcon name="MoreHorizontalIcon" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2">
                <AppIcon name="MailCheckIcon" /> Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <AppIcon name="ArchiveIcon" /> Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2">
                <AppIcon name="ClockIcon" /> Snooze
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <AppIcon name="CalendarPlusIcon" /> Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <AppIcon name="ListFilterIcon" /> Add to List
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2">
                  <AppIcon name="TagIcon" /> Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={label} onValueChange={setLabel}>
                    <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                <AppIcon name="Trash2Icon" /> Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  );
}
