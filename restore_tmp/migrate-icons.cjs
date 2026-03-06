const fs = require("fs");
const path = require("path");

const files = [
    "src/pages/workspace/Workspace.tsx",
    "src/components/examples/ButtonDemos.tsx",
    "src/components/chat/UserAvatarDropdown.tsx",
    "src/components/chat/ExplorePromptPanel.tsx",
    "src/components/chat/ChatSidebarDrawer.tsx",
    "src/components/chat/ChatComposer.tsx",
];

const root = "c:/Users/udite/Documents/GitHub/opendraft";

const iconNames = [
    "Plus", "Search", "MessageSquare", "SquarePen", "FlipLeftIcon", "FlipRightIcon", "PencilEdit02Icon",
    "LibraryIcon", "DatabaseIcon", "ChevronDown", "ChevronUp", "ChevronLeft", "ChevronRight",
    "ArrowUp", "ArrowUp02Icon", "ArrowLeft", "ArrowRight", "ArrowUpRightIcon",
    "PanelLeft", "PanelLeftOpen", "PanelLeftClose", "Share2", "Sparkles", "MoreHorizontal",
    "X", "Check", "Circle", "Dot", "BarChart3", "CalendarClock", "Compass", "Mic",
    "MessageCircle", "MessageCircleQuestion", "ClipboardList", "ListChecks", "Pencil", "PencilLine",
    "SlidersHorizontal", "Paperclip", "Camera", "Highlighter", "Puzzle",
    "User", "Paintbrush", "Palette", "CreditCard", "Star", "CircleHelp", "HelpCircle", "Settings", "LogOut",
    "ThumbsUp", "ThumbsDown", "Copy", "ExternalLink", "RotateCcw", "Lightbulb", "Play", "Zap", "Table2", "GripVertical",
    "ArrowUpRight", "LibraryBig", "Layers", "ListTodo", "FileText", "Presentation", "History",
    "CheckCircle2Icon", "BadgeCheck", "BookmarkIcon",
    "ArchiveIcon", "ArrowLeftIcon", "ArrowUpIcon", "CalendarPlusIcon", "CircleFadingArrowUpIcon",
    "ClockIcon", "GitBranchIcon", "ListFilterIcon", "MailCheckIcon", "MoreHorizontalIcon", "TagIcon", "Trash2Icon",
];

let updated = 0;
for (const file of files) {
    const fullPath = path.join(root, file);
    let content = fs.readFileSync(fullPath, "utf-8");
    const original = content;

    // Step 1: Replace multiline lucide import with AppIcon import
    // Matches: import {\n  Icon1,\n  Icon2,\n} from "@/components/icons/lucide";
    const importRegex = /import\s*\{[\s\S]*?\}\s*from\s*["']@\/components\/icons\/lucide["'];?/g;
    if (importRegex.test(content)) {
        if (!content.includes('from "@/components/icons/AppIcon"') && !content.includes("from '@/components/icons/AppIcon'")) {
            content = content.replace(importRegex, 'import { AppIcon } from "@/components/icons/AppIcon";');
        } else {
            // Remove the lucide import since AppIcon already imported
            content = content.replace(importRegex, "");
        }
    }

    // Step 2: Replace icon component usages
    for (const name of iconNames) {
        const selfClosingRegex = new RegExp("<" + name + "(\\s[^>]*)?\\/\\s*>", "g");
        content = content.replace(selfClosingRegex, (match, attrs) => {
            if (!attrs || attrs.trim() === "") return '<AppIcon name="' + name + '" />';
            return '<AppIcon name="' + name + '"' + attrs + "/>";
        });
    }

    if (content !== original) {
        fs.writeFileSync(fullPath, content, "utf-8");
        updated++;
        console.log("Updated: " + file);
    } else {
        console.log("No changes: " + file);
    }
}

console.log("\nTotal updated: " + updated + " files");
