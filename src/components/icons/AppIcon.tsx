import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Add01Icon,
  AlarmClockIcon,
  Archive01Icon,
  Archive03Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowUp01Icon,
  ArrowUp02Icon,
  ArrowUpRight01Icon,
  Attachment01Icon,
  Bookmark01Icon,
  BulbIcon,
  Calendar01Icon,
  CalendarAdd01Icon,
  Camera01Icon,
  Cancel01Icon,
  Bug02Icon,
  Brain03Icon,
  Chat01Icon,
  ChatQuestionIcon,
  CheckListIcon,
  CheckmarkBadge01Icon,
  CheckmarkCircle01Icon,
  ChartUpIcon,
  CircleIcon,
  Clock01Icon,
  Compass01Icon,
  Copy01Icon,
  CreditCardIcon,
  Delete01Icon,
  FavouriteIcon,
  File01Icon,
  FlipLeftIcon,
  FlipRightIcon,
  GitBranchIcon,
  HandGripIcon,
  HelpCircleIcon,
  HighlighterIcon,
  LibraryIcon,
  LibrariesIcon,
  DatabaseIcon,
  LinkSquare01Icon,
  Logout01Icon,
  MailValidation01Icon,
  MenuTwoLineIcon,
  Mic01Icon,
  Mic02Icon,
  MoreHorizontalIcon,
  PaintBoardIcon,
  PaintBrush01Icon,
  PauseIcon,
  PencilEdit01Icon,
  PencilEdit02Icon,
  PencilIcon,
  Pen01Icon,
  Note01Icon,
  PlayIcon,
  Presentation01Icon,
  PuzzleIcon,
  RotateRight01Icon,
  Search01Icon,
  SidebarLeftIcon,
  SidebarRightIcon,
  Settings01Icon,
  Share01Icon,
  SlidersHorizontalIcon,
  Square01Icon,
  StarIcon,
  StarsIcon,
  Table02Icon,
  Tag01Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Tick01Icon,
  UserIcon,
  ZapIcon,
  BookOpen01Icon,
  QuillWrite01Icon,
  QuillWrite02Icon,
  CellsIcon,
  PackageIcon,
  Building02Icon,
  Saturn01Icon,
  GiftIcon,
  Download01Icon,
  Refresh01Icon,
  Book02Icon,
  LayoutLeftIcon,
  Edit04Icon,
  HotspotIcon,
  Notification01Icon,
  UndoIcon,
  Tick02Icon,
  CreativeMarketIcon,
  AlignBoxMiddleCenterIcon,
  FilterIcon,
  Idea01Icon,
  InstagramIcon,
  Linkedin01Icon,
  YoutubeIcon,
  NewTwitterIcon,
  Sun01Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

const ICON_MAP = {
  // Step 3 Roles Support
  Pencil01Icon: PencilIcon,
  PackageIcon: PackageIcon,
  Camera01Icon: Camera01Icon,
  ChartBarIcon: ChartUpIcon,
  Share04Icon: Share01Icon,
  Building02Icon: Building02Icon,
  UserIcon: UserIcon,

  // navigation / common
  Plus: Add01Icon,
  Search: Search01Icon,
  MessageSquare: Chat01Icon,
  MessageCircle: Chat01Icon,
  SquarePen: PencilEdit01Icon,
  QuillWrite: QuillWrite01Icon,
  Feather: QuillWrite02Icon,
  Cells: CellsIcon,
  BrainIcon: Brain03Icon,

  // Hugeicons direct names
  FlipLeftIcon: FlipLeftIcon,
  FlipRightIcon: FlipRightIcon,
  PencilEdit02Icon: PencilEdit02Icon,
  LibraryIcon: LibraryIcon,
  LibrariesIcon: LibrariesIcon,
  DatabaseIcon: DatabaseIcon,

  // library / files / documents
  LibraryBig: LibraryIcon,
  Layers: Table02Icon,
  ListTodo: CheckListIcon,
  History: Clock01Icon,
  FileText: Pen01Icon,
  Pen01Icon: Pen01Icon,
  Presentation: Presentation01Icon,

  // chevrons
  ChevronDown: ArrowDown01Icon,
  ChevronUp: ArrowUp01Icon,
  ChevronLeft: ArrowLeft01Icon,
  ChevronRight: ArrowRight01Icon,

  // arrows
  ArrowUp: ArrowUp01Icon,
  ArrowUp02Icon: ArrowUp02Icon,
  ArrowRight02Icon: ArrowRight02Icon,
  ArrowLeft: ArrowLeft01Icon,
  ArrowRight: ArrowRight01Icon,
  ArrowUpRight: ArrowUpRight01Icon,
  ArrowUpRightIcon: ArrowUpRight01Icon,

  // lucide "...Icon" aliases
  ArrowLeftIcon: ArrowLeft01Icon,
  ArrowUpIcon: ArrowUp01Icon,

  // panel / sidebar
  PanelLeft: MenuTwoLineIcon,
  PanelLeftOpen: SidebarLeftIcon,
  PanelRightOpen: SidebarRightIcon,
  PanelLeftOpenIcon: SidebarLeftIcon,
  PanelRightOpenIcon: SidebarRightIcon,
  PanelLeftClose: MenuTwoLineIcon,
  Download: Download01Icon,
  RefreshCw: Refresh01Icon,
  Refresh: Refresh01Icon,

  // misc actions
  MoreHorizontal: MoreHorizontalIcon,
  MoreHorizontalIcon: MoreHorizontalIcon,
  Sparkles: StarsIcon,
  Share2: Share01Icon,

  // status / marks
  X: Cancel01Icon,
  Check: Tick02Icon,
  Tick02Icon: Tick02Icon,
  CheckCircle2Icon: CheckmarkCircle01Icon,
  BadgeCheck: CheckmarkBadge01Icon,
  Circle: CircleIcon,
  Dot: CircleIcon,

  // data / scheduling
  BarChart3: ChartUpIcon,
  CalendarClock: Calendar01Icon,
  CalendarPlusIcon: CalendarAdd01Icon,
  ClockIcon: Clock01Icon,
  Saturn01Icon: Saturn01Icon,
  Compass: Compass01Icon,
  Mic: Mic02Icon,
  MessageCircleQuestion: ChatQuestionIcon,
  ClipboardList: CheckListIcon,
  ListChecks: CheckListIcon,
  Pencil: PencilIcon,
  PencilLine: PencilIcon,

  // toolbar / input
  SlidersHorizontal: SlidersHorizontalIcon,
  Paperclip: Attachment01Icon,
  Camera: Camera01Icon,
  Highlighter: HighlighterIcon,
  Puzzle: PuzzleIcon,

  // user / settings
  User: UserIcon,
  Paintbrush: PaintBrush01Icon,
  Palette: PaintBoardIcon,
  CreditCard: CreditCardIcon,
  Star: StarIcon,
  BookmarkIcon: Bookmark01Icon,
  CircleHelp: HelpCircleIcon,
  HelpCircle: HelpCircleIcon,
  Settings: Settings01Icon,
  LogOut: Logout01Icon,

  // help / info
  BookOpen: BookOpen01Icon,
  Bug: Bug02Icon,
  Keyboard: PencilEdit02Icon,

  // feedback
  ThumbsUp: ThumbsUpIcon,
  ThumbsDown: ThumbsDownIcon,
  Copy: Copy01Icon,
  ExternalLink: LinkSquare01Icon,
  RotateCcw: UndoIcon,
  Regenerate: UndoIcon,
  PencilEdit01Icon: PencilEdit01Icon,

  // idea / action
  Lightbulb: BulbIcon,
  ArchiveIcon: Archive03Icon,
  Play: PlayIcon,
  Pause: PauseIcon,
  Stop: Square01Icon,
  Zap: ZapIcon,
  Table2: Table02Icon,
  GripVertical: HandGripIcon,

  // extra aliases for demos/examples
  GitBranchIcon: GitBranchIcon,
  ListFilterIcon: SlidersHorizontalIcon,
  MailCheckIcon: MailValidation01Icon,
  TagIcon: Tag01Icon,
  Trash2Icon: Delete01Icon,
  CircleFadingArrowUpIcon: ArrowUp01Icon,
  Gift: GiftIcon,
  Heart: FavouriteIcon,
  Gitbook: Book02Icon,
  NoteIcon: Note01Icon,
  Archive03Icon: Archive03Icon,
  LayoutLeftIcon: LayoutLeftIcon,
  Edit04Icon: Edit04Icon,
  PlanMode: Saturn01Icon,
  Notification: Notification01Icon,
  Edit2: PencilEdit01Icon,
  Trash2: Delete01Icon,
  CreativeMarket: CreativeMarketIcon,
  AlignBoxMiddleCenter: AlignBoxMiddleCenterIcon,
  Filter: FilterIcon,
  Idea01: Idea01Icon,
  Instagram: InstagramIcon,
  Linkedin: Linkedin01Icon,
  Youtube: YoutubeIcon,
  NewTwitter: NewTwitterIcon,
  Sun: Sun01Icon,
  Moon: Moon02Icon,
} as const;

export type AppIconName = keyof typeof ICON_MAP;

export type AppIconProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon"> & {
  name: AppIconName;
};

export const AppIcon = React.forwardRef<SVGSVGElement, AppIconProps>(
  (
    {
      name,
      className,
      // Guideline (rounded): 18px / 1.7
      size = 18,
      strokeWidth = 1.7,
      primaryColor,
      strokeLinecap = "round",
      strokeLinejoin = "round",
      ...props
    },
    ref,
  ) => {
    const icon = ICON_MAP[name];
    return (
      <HugeiconsIcon
        ref={ref}
        icon={icon}
        size={size}
        strokeWidth={strokeWidth}
        primaryColor={primaryColor}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        className={cn("inline-block", className)}
        {...props}
      />
    );
  },
);
AppIcon.displayName = "AppIcon";

/**
 * Create a standalone icon component from an AppIcon name.
 * Useful when you need to pass an icon as a component prop (e.g. `Icon: createAppIcon("Search")`).
 */
export function createAppIcon(name: AppIconName) {
  const Comp = React.forwardRef<SVGSVGElement, Omit<AppIconProps, "name">>((props, ref) => (
    <AppIcon ref={ref} name={name} {...props} />
  ));
  Comp.displayName = `AppIcon(${name})`;
  return Comp;
}

export function makeIcon(name: AppIconName) {
  return function Icon({ className }: { className?: string }) {
    return <AppIcon name={name} className={className} />;
  };
}
