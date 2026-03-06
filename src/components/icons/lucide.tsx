import * as React from "react";

import { AppIcon, type AppIconName } from "@/components/icons/AppIcon";

export type LucideProps = Omit<React.SVGProps<SVGSVGElement>, "name"> & {
  color?: string;
  size?: number | string;
  strokeWidth?: number;
};

function createLucideIcon(name: AppIconName) {
  const Comp = React.forwardRef<SVGSVGElement, LucideProps>(
    ({ color, size, strokeWidth, className, ...props }, ref) => {
      return (
        <AppIcon
          ref={ref}
          name={name}
          className={className}
          primaryColor={color}
          size={size}
          strokeWidth={strokeWidth}
          {...props}
        />
      );
    },
  );

  Comp.displayName = `LucideShim(${name})`;
  return Comp;
}

// Named exports to match legacy icon imports
export const Plus = createLucideIcon("Plus");
export const Search = createLucideIcon("Search");
export const MessageSquare = createLucideIcon("MessageSquare");
export const SquarePen = createLucideIcon("SquarePen");

// New/alias exports requested by the app UI
export const FlipLeftIcon = createLucideIcon("FlipLeftIcon");
export const FlipRightIcon = createLucideIcon("FlipRightIcon");
export const PencilEdit02Icon = createLucideIcon("PencilEdit02Icon");
export const LibraryIcon = createLucideIcon("LibraryIcon");
export const DatabaseIcon = createLucideIcon("DatabaseIcon");


export const ChevronDown = createLucideIcon("ChevronDown");
export const ChevronUp = createLucideIcon("ChevronUp");
export const ChevronLeft = createLucideIcon("ChevronLeft");
export const ChevronRight = createLucideIcon("ChevronRight");

export const ArrowUp = createLucideIcon("ArrowUp");
export const ArrowUp02Icon = createLucideIcon("ArrowUp02Icon");
export const ArrowLeft = createLucideIcon("ArrowLeft");
export const ArrowRight = createLucideIcon("ArrowRight");
export const ArrowUpRightIcon = createLucideIcon("ArrowUpRightIcon");

export const PanelLeft = createLucideIcon("PanelLeft");
export const PanelLeftOpen = createLucideIcon("PanelLeftOpen");
export const PanelLeftClose = createLucideIcon("PanelLeftClose");

export const Share2 = createLucideIcon("Share2");
export const Sparkles = createLucideIcon("Sparkles");
export const MoreHorizontal = createLucideIcon("MoreHorizontal");

export const X = createLucideIcon("X");
export const Check = createLucideIcon("Check");
export const Circle = createLucideIcon("Circle");
export const Dot = createLucideIcon("Dot");

export const BarChart3 = createLucideIcon("BarChart3");
export const CalendarClock = createLucideIcon("CalendarClock");
export const Compass = createLucideIcon("Compass");
export const Mic = createLucideIcon("Mic");
export const MessageCircle = createLucideIcon("MessageCircle");
export const MessageCircleQuestion = createLucideIcon("MessageCircleQuestion");
export const ClipboardList = createLucideIcon("ClipboardList");
export const ListChecks = createLucideIcon("ListChecks");
export const Pencil = createLucideIcon("Pencil");
export const PencilLine = createLucideIcon("PencilLine");

export const SlidersHorizontal = createLucideIcon("SlidersHorizontal");
export const Paperclip = createLucideIcon("Paperclip");
export const Camera = createLucideIcon("Camera");
export const Highlighter = createLucideIcon("Highlighter");
export const Puzzle = createLucideIcon("Puzzle");

export const User = createLucideIcon("User");
export const Paintbrush = createLucideIcon("Paintbrush");
export const Palette = createLucideIcon("Palette");
export const CreditCard = createLucideIcon("CreditCard");
export const Star = createLucideIcon("Star");
export const CircleHelp = createLucideIcon("CircleHelp");
export const HelpCircle = createLucideIcon("HelpCircle");
export const Settings = createLucideIcon("Settings");
export const LogOut = createLucideIcon("LogOut");

export const ThumbsUp = createLucideIcon("ThumbsUp");
export const ThumbsDown = createLucideIcon("ThumbsDown");
export const Copy = createLucideIcon("Copy");

export const ExternalLink = createLucideIcon("ExternalLink");
export const RotateCcw = createLucideIcon("RotateCcw");
export const Lightbulb = createLucideIcon("Lightbulb");
export const Play = createLucideIcon("Play");
export const Zap = createLucideIcon("Zap");
export const Table2 = createLucideIcon("Table2");
export const GripVertical = createLucideIcon("GripVertical");

// Extra exports used in demo/example components and a few app screens
export const ArrowUpRight = createLucideIcon("ArrowUpRight");
export const LibraryBig = createLucideIcon("LibraryBig");
export const Layers = createLucideIcon("Layers");
export const ListTodo = createLucideIcon("ListTodo");
export const FileText = createLucideIcon("FileText");
export const Presentation = createLucideIcon("Presentation");
export const History = createLucideIcon("History");

export const CheckCircle2Icon = createLucideIcon("CheckCircle2Icon");
export const BadgeCheck = createLucideIcon("BadgeCheck");
export const BookmarkIcon = createLucideIcon("BookmarkIcon");

export const ArchiveIcon = createLucideIcon("ArchiveIcon");
export const ArrowLeftIcon = createLucideIcon("ArrowLeftIcon");
export const ArrowUpIcon = createLucideIcon("ArrowUpIcon");
export const CalendarPlusIcon = createLucideIcon("CalendarPlusIcon");
export const CircleFadingArrowUpIcon = createLucideIcon("CircleFadingArrowUpIcon");
export const ClockIcon = createLucideIcon("ClockIcon");
export const GitBranchIcon = createLucideIcon("GitBranchIcon");
export const ListFilterIcon = createLucideIcon("ListFilterIcon");
export const MailCheckIcon = createLucideIcon("MailCheckIcon");
export const MoreHorizontalIcon = createLucideIcon("MoreHorizontalIcon");
export const TagIcon = createLucideIcon("TagIcon");
export const Trash2Icon = createLucideIcon("Trash2Icon");
