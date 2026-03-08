"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  AlertTriangle,
  AlertCircle,
  GripVertical,
  Plus,
  Pencil,
  Copy,
  Trash2,
  Eye,
  Save,
  Send,
  Menu,
  X,
  Shield,
  Terminal,
  FileText,
  HelpCircle,
  BookOpen,
  Layers,
  Settings,
  Monitor,
  PlayCircle,
  Image,
  ChevronUp,
  Radio,
  Tag,
  Zap,
  MoreHorizontal,
  ArrowLeft,
  Check,
  Info,
  Clock,
  Star,
  FlaskConical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItemState = "complete" | "incomplete" | "warning" | "active";

type ActiveSection =
  | "basics"
  | "classification"
  | "environment"
  | "wt1-overview"
  | "wt1-content"
  | "wt1-steps"
  | "wt1-step1"
  | "wt1-step2"
  | "wt1-question"
  | "wt2-overview"
  | "wt2-content"
  | "wt2-steps"
  | "validation";

// ─── State helpers ────────────────────────────────────────────────────────────

function StateIcon({ state, size = 14 }: { state: NavItemState; size?: number }) {
  if (state === "complete")
    return <CheckCircle2 size={size} className="text-success shrink-0" />;
  if (state === "warning")
    return <AlertTriangle size={size} className="text-warning shrink-0" />;
  if (state === "incomplete")
    return <Circle size={size} className="text-muted-foreground shrink-0" />;
  return <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />;
}

function StatusBadge({ state }: { state: NavItemState }) {
  if (state === "complete")
    return (
      <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
    );
  if (state === "warning")
    return (
      <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block" />
    );
  if (state === "incomplete")
    return (
      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground inline-block" />
    );
  return <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />;
}

// ─── Sidebar outline ─────────────────────────────────────────────────────────

const navData = [
  { id: "basics", label: "Basics", state: "complete" as NavItemState },
  { id: "classification", label: "Classification", state: "complete" as NavItemState },
  { id: "environment", label: "Environment", state: "warning" as NavItemState },
  {
    id: "walkthroughs",
    label: "Walkthroughs",
    state: "incomplete" as NavItemState,
    children: [
      {
        id: "wt1",
        label: "Walkthrough 1: Web Recon",
        state: "warning" as NavItemState,
        steps: 3,
        children: [
          { id: "wt1-overview", label: "Overview", state: "complete" as NavItemState },
          { id: "wt1-content", label: "Content", state: "complete" as NavItemState },
          {
            id: "wt1-steps",
            label: "Steps",
            state: "warning" as NavItemState,
            children: [
              { id: "wt1-step1", label: "Step 1", state: "complete" as NavItemState },
              { id: "wt1-step2", label: "Step 2", state: "complete" as NavItemState },
              { id: "wt1-question", label: "Question", state: "warning" as NavItemState },
            ],
          },
        ],
      },
      {
        id: "wt2",
        label: "Walkthrough 2: Linux Basics",
        state: "incomplete" as NavItemState,
        steps: 2,
        children: [
          { id: "wt2-overview", label: "Overview", state: "incomplete" as NavItemState },
          { id: "wt2-content", label: "Content", state: "incomplete" as NavItemState },
          { id: "wt2-steps", label: "Steps", state: "incomplete" as NavItemState },
        ],
      },
    ],
  },
  { id: "validation", label: "Validation & Publish", state: "incomplete" as NavItemState },
];

interface NavItem {
  id: string;
  label: string;
  state: NavItemState;
  steps?: number;
  children?: NavItem[];
}

function NavLeaf({
  item,
  active,
  onSelect,
  depth,
}: {
  item: NavItem;
  active: ActiveSection;
  onSelect: (id: ActiveSection) => void;
  depth: number;
}) {
  const isActive = active === item.id;
  return (
    <button
      onClick={() => onSelect(item.id as ActiveSection)}
      className={`
        w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm leading-tight transition-colors
        ${isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}
      `}
      style={{ paddingLeft: `${depth * 12 + 8}px` }}
    >
      <StateIcon state={isActive ? "active" : item.state} size={12} />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

function NavGroup({
  item,
  active,
  onSelect,
  depth,
}: {
  item: NavItem;
  active: ActiveSection;
  onSelect: (id: ActiveSection) => void;
  depth: number;
}) {
  const [open, setOpen] = useState(true);
  const isActive = active === item.id;

  return (
    <div>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (item.id !== "walkthroughs") onSelect(item.id as ActiveSection);
        }}
        className={`
          w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm leading-tight font-medium transition-colors
          ${isActive ? "bg-primary/15 text-primary" : "text-foreground hover:bg-accent"}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {open ? (
          <ChevronDown size={12} className="shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight size={12} className="shrink-0 text-muted-foreground" />
        )}
        <StateIcon state={isActive ? "active" : item.state} size={12} />
        <span className="truncate flex-1">{item.label}</span>
        {item.steps !== undefined && (
          <span className="text-xs text-muted-foreground shrink-0">
            {item.steps} steps
          </span>
        )}
      </button>

      {open && item.children && (
        <div className="mt-0.5 space-y-0.5">
          {item.children.map((child) =>
            child.children ? (
              <NavGroup
                key={child.id}
                item={child}
                active={active}
                onSelect={onSelect}
                depth={depth + 1}
              />
            ) : (
              <NavLeaf
                key={child.id}
                item={child}
                active={active}
                onSelect={onSelect}
                depth={depth + 1}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

function SidebarNav({
  active,
  onSelect,
}: {
  active: ActiveSection;
  onSelect: (id: ActiveSection) => void;
}) {
  return (
    <nav className="space-y-0.5 p-3">
      {navData.map((item) =>
        item.children ? (
          <NavGroup
            key={item.id}
            item={item}
            active={active}
            onSelect={onSelect}
            depth={0}
          />
        ) : (
          <NavLeaf
            key={item.id}
            item={item}
            active={active}
            onSelect={onSelect}
            depth={0}
          />
        )
      )}
    </nav>
  );
}

// ─── Form section label ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 mt-6 first:mt-0">
      {children}
    </p>
  );
}

function FieldGroup({
  label,
  helper,
  required,
  children,
}: {
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {helper && (
        <p className="text-xs text-muted-foreground leading-relaxed">{helper}</p>
      )}
    </div>
  );
}

// ─── Tags input mock ──────────────────────────────────────────────────────────

const INITIAL_TAGS = ["recon", "web", "beginner"];

function TagsInput() {
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [value, setValue] = useState("");
  const remove = (t: string) => setTags((prev) => prev.filter((x) => x !== t));
  return (
    <div className="flex flex-wrap gap-1.5 p-2 min-h-10 rounded-md border border-input bg-input/30 focus-within:ring-1 focus-within:ring-ring">
      {tags.map((t) => (
        <Badge
          key={t}
          variant="secondary"
          className="gap-1 text-xs py-0.5 h-6"
        >
          <Tag size={10} />
          {t}
          <button
            onClick={() => remove(t)}
            className="ml-0.5 opacity-60 hover:opacity-100"
          >
            <X size={10} />
          </button>
        </Badge>
      ))}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            setTags((prev) => [...prev, value.trim()]);
            setValue("");
          }
        }}
        placeholder="Add tag…"
        className="flex-1 min-w-20 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
    </div>
  );
}

// ─── Journey Basics editor ────────────────────────────────────────────────────

function JourneyBasicsEditor() {
  const [active, setActive] = useState(true);
  return (
    <div className="space-y-5">
      <SectionLabel>Identity</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldGroup label="Journey Name" required helper="This is displayed to learners in the catalog.">
          <Input defaultValue="Web Application Recon" className="bg-input/30" />
        </FieldGroup>
        <FieldGroup label="Type" required>
          <Select defaultValue="lab">
            <SelectTrigger className="bg-input/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lab">Lab Journey</SelectItem>
              <SelectItem value="guided">Guided Path</SelectItem>
              <SelectItem value="challenge">Challenge</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
      </div>

      <FieldGroup label="Short Description" required helper="Shown in search results. Keep under 160 characters.">
        <Input
          defaultValue="Learn how to perform passive and active web reconnaissance using common OSINT tools."
          className="bg-input/30"
        />
      </FieldGroup>

      <FieldGroup label="Full Description">
        <Textarea
          defaultValue={`This journey walks through the full web reconnaissance methodology used in professional penetration testing engagements. Learners will use tools like Amass, Subfinder, and nuclei to enumerate subdomains, identify exposed services, and fingerprint tech stacks.`}
          className="bg-input/30 min-h-28 leading-relaxed"
        />
      </FieldGroup>

      <Separator />
      <SectionLabel>Configuration</SectionLabel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FieldGroup label="Difficulty" required>
          <Select defaultValue="beginner">
            <SelectTrigger className="bg-input/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>

        <FieldGroup label="Icon" helper="Used in the catalog card.">
          <Select defaultValue="shield">
            <SelectTrigger className="bg-input/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shield">Shield</SelectItem>
              <SelectItem value="terminal">Terminal</SelectItem>
              <SelectItem value="flask">Flask</SelectItem>
              <SelectItem value="layers">Layers</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>

        <FieldGroup label="Base XP" helper="Awarded on completion.">
          <Input defaultValue="250" type="number" className="bg-input/30" />
        </FieldGroup>
      </div>

      <FieldGroup label="Tags">
        <TagsInput />
      </FieldGroup>

      <div className="flex items-center justify-between rounded-md border border-border bg-card p-4">
        <div>
          <p className="text-sm font-medium">Active</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Inactive journeys are hidden from all learners.
          </p>
        </div>
        <Switch checked={active} onCheckedChange={setActive} />
      </div>

      <Separator />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-2">
          <Save size={14} />
          Save Draft
        </Button>
      </div>
    </div>
  );
}

// ─── Classification editor ────────────────────────────────────────────────────

function ClassificationEditor() {
  return (
    <div className="space-y-5">
      <SectionLabel>Skills & Domains</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="Primary Domain" required>
          <Select defaultValue="web">
            <SelectTrigger className="bg-input/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Web Security</SelectItem>
              <SelectItem value="network">Network Security</SelectItem>
              <SelectItem value="cloud">Cloud Security</SelectItem>
              <SelectItem value="malware">Malware Analysis</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label="Secondary Domain">
          <Select defaultValue="osint">
            <SelectTrigger className="bg-input/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="osint">OSINT</SelectItem>
              <SelectItem value="recon">Reconnaissance</SelectItem>
              <SelectItem value="pentest">Penetration Testing</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
      </div>
      <FieldGroup label="MITRE ATT&CK Techniques" helper="Comma-separated technique IDs (e.g. T1595.001)">
        <Input defaultValue="T1595.001, T1596.005, T1046" className="bg-input/30 font-mono text-sm" />
      </FieldGroup>
      <FieldGroup label="Skill Level Prerequisites">
        <div className="space-y-2 mt-1">
          {["Basic Linux CLI", "HTTP fundamentals", "TCP/IP networking"].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <Checkbox id={s} defaultChecked />
              <label htmlFor={s} className="text-sm">{s}</label>
            </div>
          ))}
        </div>
      </FieldGroup>
      <Separator />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-2">
          <Save size={14} />Save Draft
        </Button>
      </div>
    </div>
  );
}

// ─── Environment editor ───────────────────────────────────────────────────────

function EnvironmentEditor() {
  return (
    <div className="space-y-5">
      <Alert className="border-warning/40 bg-warning/10">
        <AlertTriangle size={14} className="text-warning" />
        <AlertDescription className="text-warning/90 text-sm ml-1">
          No environment template selected. A VM environment is required for lab-type journeys.
        </AlertDescription>
      </Alert>
      <SectionLabel>Lab Environment</SectionLabel>
      <FieldGroup label="Environment Template" required>
        <Select>
          <SelectTrigger className="bg-input/30"><SelectValue placeholder="Select a template…" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="kali-2024">Kali Linux 2024.1</SelectItem>
            <SelectItem value="ubuntu-22">Ubuntu 22.04 LTS</SelectItem>
            <SelectItem value="web-goat">WebGoat + Kali</SelectItem>
            <SelectItem value="dvwa">DVWA Stack</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="CPU Allocation">
          <Select defaultValue="2">
            <SelectTrigger className="bg-input/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 vCPU</SelectItem>
              <SelectItem value="2">2 vCPU</SelectItem>
              <SelectItem value="4">4 vCPU</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label="Memory">
          <Select defaultValue="4">
            <SelectTrigger className="bg-input/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 GB</SelectItem>
              <SelectItem value="4">4 GB</SelectItem>
              <SelectItem value="8">8 GB</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
      </div>
      <FieldGroup label="Max Lab Duration (minutes)" helper="Learner session will terminate after this time.">
        <Input defaultValue="90" type="number" className="bg-input/30" />
      </FieldGroup>
      <Separator />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-2"><Save size={14} />Save Draft</Button>
      </div>
    </div>
  );
}

// ─── Walkthrough overview editor ──────────────────────────────────────────────

function WalkthroughOverviewEditor({ title }: { title: string }) {
  return (
    <div className="space-y-5">
      <SectionLabel>Walkthrough Metadata</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="Walkthrough Name" required>
          <Input defaultValue={title} className="bg-input/30" />
        </FieldGroup>
        <FieldGroup label="Order" helper="Display order within the journey.">
          <Input defaultValue="1" type="number" className="bg-input/30" />
        </FieldGroup>
      </div>
      <FieldGroup label="Description">
        <Textarea
          defaultValue="Learners will enumerate subdomains, fingerprint web technologies, and identify open ports on the target host using passive and active recon techniques."
          className="bg-input/30 min-h-24 leading-relaxed"
        />
      </FieldGroup>
      <FieldGroup label="Primary Content Type" required>
        <Select defaultValue="vm">
          <SelectTrigger className="bg-input/30"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="vm">Virtual Machine</SelectItem>
            <SelectItem value="slides">Slide Deck</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>
      <Separator />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-2"><Save size={14} />Save Draft</Button>
      </div>
    </div>
  );
}

// ─── Content editor ───────────────────────────────────────────────────────────

function ContentEditor() {
  const [contentType, setContentType] = useState("vm");
  return (
    <div className="space-y-5">
      <SectionLabel>Content Configuration</SectionLabel>
      <FieldGroup label="Content Type" required>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { value: "vm", label: "Virtual Machine", icon: <Monitor size={16} /> },
            { value: "slides", label: "Slide Deck", icon: <Layers size={16} /> },
            { value: "video", label: "Video", icon: <PlayCircle size={16} /> },
            { value: "image", label: "Image", icon: <Image size={16} /> },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setContentType(opt.value)}
              className={`flex flex-col items-center gap-2 p-3 rounded-md border text-sm font-medium transition-colors ${
                contentType === opt.value
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </FieldGroup>

      {contentType === "vm" && (
        <div className="space-y-4 rounded-md border border-border/60 bg-accent/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Virtual Machine Fields</p>
          <FieldGroup label="Content Name" required>
            <Input defaultValue="Web Recon VM" className="bg-input/30" />
          </FieldGroup>
          <FieldGroup label="Description">
            <Textarea defaultValue="Kali Linux instance with pre-installed recon tools." className="bg-input/30 min-h-20" />
          </FieldGroup>
          <FieldGroup label="VM Template" required>
            <Select defaultValue="kali-2024">
              <SelectTrigger className="bg-input/30"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kali-2024">Kali Linux 2024.1</SelectItem>
                <SelectItem value="ubuntu-22">Ubuntu 22.04 LTS</SelectItem>
                <SelectItem value="dvwa">DVWA Stack</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>
          <FieldGroup label="Launch Instructions" helper="Displayed before the learner starts the lab.">
            <Textarea defaultValue={`1. Open a terminal window\n2. Navigate to /opt/recon\n3. Run the pre-configured enumeration scripts`} className="bg-input/30 font-mono text-sm min-h-24 leading-relaxed" />
          </FieldGroup>
        </div>
      )}

      {contentType === "slides" && (
        <div className="space-y-4 rounded-md border border-border/60 bg-accent/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Slide Deck Fields</p>
          <FieldGroup label="Deck Name" required>
            <Input placeholder="Enter slide deck name" className="bg-input/30" />
          </FieldGroup>
          <FieldGroup label="Slide Deck URL" helper="Embed link from Google Slides or PowerPoint Online.">
            <Input placeholder="https://docs.google.com/presentation/..." className="bg-input/30" />
          </FieldGroup>
        </div>
      )}

      {contentType === "video" && (
        <div className="space-y-4 rounded-md border border-border/60 bg-accent/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Video Fields</p>
          <FieldGroup label="Video Title" required>
            <Input placeholder="Enter video title" className="bg-input/30" />
          </FieldGroup>
          <FieldGroup label="Video URL" helper="Supports YouTube, Vimeo, or direct MP4 links.">
            <Input placeholder="https://..." className="bg-input/30" />
          </FieldGroup>
        </div>
      )}

      {contentType === "image" && (
        <div className="space-y-4 rounded-md border border-border/60 bg-accent/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Image Fields</p>
          <FieldGroup label="Image Title" required>
            <Input placeholder="Enter image title" className="bg-input/30" />
          </FieldGroup>
          <FieldGroup label="Image URL">
            <Input placeholder="https://..." className="bg-input/30" />
          </FieldGroup>
          <FieldGroup label="Alt Text" helper="Describe the image for accessibility.">
            <Input placeholder="Describe the image…" className="bg-input/30" />
          </FieldGroup>
        </div>
      )}

      <Separator />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-2"><Save size={14} />Save Draft</Button>
      </div>
    </div>
  );
}

// ─── Steps list ───────────────────────────────────────────────────────────────

const MOCK_STEPS = [
  { id: 1, name: "Intro to the task", type: "Instruction", preview: "Overview of web recon methodology and toolchain.", complete: true },
  { id: 2, name: "Run hostname and whoami", type: "Terminal", preview: "Execute basic system enumeration commands.", complete: true },
  { id: 3, name: "Identify the active user", type: "Terminal", preview: "Use id and whoami to determine current privileges.", complete: false },
];

function TypeBadge({ type }: { type: string }) {
  const color =
    type === "Instruction" ? "text-info border-info/40 bg-info/10" :
    type === "Terminal" ? "text-primary border-primary/40 bg-primary/10" :
    "text-warning border-warning/40 bg-warning/10";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded border ${color}`}>
      {type}
    </span>
  );
}

function StepsList({ onEditStep }: { onEditStep: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">3 steps in this walkthrough</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={14} />
              Add Step
              <ChevronDown size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><FileText size={14} className="mr-2" />Instruction</DropdownMenuItem>
            <DropdownMenuItem><Terminal size={14} className="mr-2" />Terminal Command</DropdownMenuItem>
            <DropdownMenuItem><HelpCircle size={14} className="mr-2" />Question</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        {MOCK_STEPS.map((step) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-3 rounded-md border transition-colors group cursor-pointer
              ${step.complete ? "border-border bg-card hover:border-border/80" : "border-warning/40 bg-warning/5 hover:bg-warning/10"}`}
          >
            <GripVertical size={16} className="mt-0.5 text-muted-foreground/40 shrink-0 cursor-grab" />
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs font-bold text-secondary-foreground shrink-0 mt-0.5">
              {step.id}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{step.name}</span>
                <TypeBadge type={step.type} />
                {!step.complete && (
                  <span className="text-xs text-warning flex items-center gap-1">
                    <AlertTriangle size={11} />
                    Incomplete
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{step.preview}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onEditStep}>
                      <Pencil size={13} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <Copy size={13} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive">
                      <Trash2 size={13} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step editor ─────────────────────────────────────────────────────────────

function StepEditor() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span>Walkthrough 1: Web Recon</span>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium">Step 2 — Terminal Command</span>
      </div>
      <SectionLabel>Step Configuration</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2">
        <FieldGroup label="Step Type" required>
          <Select defaultValue="terminal">
            <SelectTrigger className="bg-input/30"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="instruction">Instruction</SelectItem>
              <SelectItem value="terminal">Terminal Command</SelectItem>
              <SelectItem value="question">Question</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label="Order">
          <Input defaultValue="2" type="number" className="bg-input/30" />
        </FieldGroup>
      </div>
      <FieldGroup label="Step Name" required>
        <Input defaultValue="Run hostname and whoami" className="bg-input/30" />
      </FieldGroup>
      <FieldGroup label="Description" helper="Shown to the learner above the terminal input.">
        <Textarea defaultValue="Execute basic system enumeration commands to identify the target hostname and current user context." className="bg-input/30 min-h-20 leading-relaxed" />
      </FieldGroup>
      <SectionLabel>Terminal Configuration</SectionLabel>
      <FieldGroup label="Command" helper="The exact command the learner must run.">
        <Input defaultValue="hostname && whoami" className="bg-input/30 font-mono text-sm" />
      </FieldGroup>
      <FieldGroup label="Expected Output" helper="Used to validate correct execution.">
        <Textarea defaultValue={`target-host\nroot`} className="bg-input/30 font-mono text-sm min-h-20" />
      </FieldGroup>
      <FieldGroup label="Hint" helper="Shown after 2 failed attempts.">
        <Textarea defaultValue="Make sure you are running as root. Use `sudo su` if needed." className="bg-input/30 min-h-16 leading-relaxed" />
      </FieldGroup>
      <Separator />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-2"><Save size={14} />Save Step</Button>
      </div>
    </div>
  );
}

// ─── Question editor ──────────────────────────────────────────────────────────

const INITIAL_OPTIONS = [
  { id: "a", text: "root", correct: true },
  { id: "b", text: "admin", correct: false },
  { id: "c", text: "www-data", correct: false },
  { id: "d", text: "daemon", correct: false },
];

function QuestionEditor() {
  const [options, setOptions] = useState(INITIAL_OPTIONS);
  const [correct, setCorrect] = useState("a");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span>Walkthrough 1: Web Recon</span>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium">Question Step</span>
      </div>
      <SectionLabel>Question Settings</SectionLabel>
      <FieldGroup label="Step Name" required>
        <Input defaultValue="Active User Quiz" className="bg-input/30" />
      </FieldGroup>
      <FieldGroup label="Question Prompt" required>
        <Textarea defaultValue="Based on the output of your whoami command, what is the current user running on the target machine?" className="bg-input/30 min-h-20 leading-relaxed" />
      </FieldGroup>
      <FieldGroup label="Question Type">
        <Select defaultValue="mcq">
          <SelectTrigger className="bg-input/30"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mcq">Multiple Choice (single)</SelectItem>
            <SelectItem value="mcq-multi">Multiple Choice (multi)</SelectItem>
            <SelectItem value="text">Free Text</SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>

      <SectionLabel>Answer Options</SectionLabel>
      <div className="space-y-2">
        <RadioGroup value={correct} onValueChange={setCorrect}>
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`flex items-center gap-3 p-2.5 rounded-md border transition-colors ${
                correct === opt.id ? "border-success/50 bg-success/10" : "border-border bg-card"
              }`}
            >
              <RadioGroupItem value={opt.id} id={`opt-${opt.id}`} />
              <Input
                value={opt.text}
                onChange={(e) =>
                  setOptions((prev) =>
                    prev.map((o) => (o.id === opt.id ? { ...o, text: e.target.value } : o))
                  )
                }
                className="flex-1 bg-transparent border-0 p-0 h-auto text-sm focus-visible:ring-0 shadow-none"
              />
              {correct === opt.id && (
                <Badge variant="outline" className="text-success border-success/40 bg-success/10 text-xs">
                  Correct
                </Badge>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() =>
                  setOptions((prev) => prev.filter((o) => o.id !== opt.id))
                }
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </RadioGroup>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 mt-2"
          onClick={() =>
            setOptions((prev) => [
              ...prev,
              { id: `opt-${Date.now()}`, text: "New option", correct: false },
            ])
          }
        >
          <Plus size={13} />
          Add Option
        </Button>
      </div>

      <FieldGroup label="Explanation / Feedback" helper="Shown after the learner submits an answer.">
        <Textarea defaultValue="The correct answer is root. Running whoami as root confirms the highest privilege level on a Unix system." className="bg-input/30 min-h-20 leading-relaxed" />
      </FieldGroup>
      <Separator />
      <div className="flex justify-end">
        <Button size="sm" variant="outline" className="gap-2"><Save size={14} />Save Question</Button>
      </div>
    </div>
  );
}

// ─── Validation & Publish ─────────────────────────────────────────────────────

const CHECKLIST = [
  { label: "Journey name set", done: true },
  { label: "Description complete", done: true },
  { label: "At least 1 walkthrough", done: true },
  { label: "Content assigned", done: true },
  { label: "All steps valid", done: false },
  { label: "Tags added", done: false },
  { label: "Environment template selected", done: false },
];

const BLOCKING_ISSUES = [
  "Environment template not selected",
  "Step 3 — Identify the active user — is incomplete",
];

const WARNINGS = [
  "Tags are missing — journey may be hard to discover",
  "No hint set for Step 1",
];

function ValidationPanel({ mode = "full" }: { mode?: "full" | "sidebar" }) {
  const doneCount = CHECKLIST.filter((c) => c.done).length;
  const pct = Math.round((doneCount / CHECKLIST.length) * 100);

  return (
    <div className={`space-y-5 ${mode === "full" ? "" : ""}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Readiness</span>
          <span className="text-muted-foreground">{doneCount}/{CHECKLIST.length}</span>
        </div>
        <Progress value={pct} className="h-2" />
        <div className="space-y-1.5 mt-3">
          {CHECKLIST.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {item.done ? (
                <CheckCircle2 size={13} className="text-success shrink-0" />
              ) : (
                <Circle size={13} className="text-muted-foreground shrink-0" />
              )}
              <span className={`text-xs ${item.done ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <AlertCircle size={12} className="text-destructive" />
          Blocking Issues
        </p>
        {BLOCKING_ISSUES.map((issue) => (
          <div
            key={issue}
            className="flex items-start gap-2 p-2.5 rounded-md border border-destructive/30 bg-destructive/5"
          >
            <AlertCircle size={12} className="text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-foreground flex-1 leading-relaxed">{issue}</p>
            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-primary shrink-0">
              Fix
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-warning" />
          Warnings
        </p>
        {WARNINGS.map((w) => (
          <div
            key={w}
            className="flex items-start gap-2 p-2.5 rounded-md border border-warning/30 bg-warning/5"
          >
            <AlertTriangle size={12} className="text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground flex-1 leading-relaxed">{w}</p>
          </div>
        ))}
      </div>

      {mode === "full" && (
        <>
          <Separator />
          <div className="rounded-md border border-border bg-accent/40 p-3 text-center text-sm text-muted-foreground space-y-1">
            <Eye size={20} className="mx-auto opacity-40" />
            <p>Learner preview placeholder</p>
            <Button size="sm" variant="outline" className="gap-1.5 mt-2">
              <Eye size={13} />
              View Learner Preview
            </Button>
          </div>
        </>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2.5 rounded-md border border-destructive/30 bg-destructive/5">
          <AlertCircle size={13} className="text-destructive shrink-0" />
          <p className="text-xs font-medium text-destructive">Not ready to publish</p>
        </div>
        <Button size="sm" variant="outline" className="w-full gap-2">
          <Save size={13} />
          Save Draft
        </Button>
        <Button
          size="sm"
          disabled
          className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          <Send size={13} />
          Publish Journey
        </Button>
      </div>

      {mode === "sidebar" && (
        <Button size="sm" variant="outline" className="w-full gap-1.5">
          <Eye size={13} />
          View Learner Preview
        </Button>
      )}
    </div>
  );
}

// ─── Main editor dispatcher ───────────────────────────────────────────────────

function EditorContent({ section }: { section: ActiveSection }) {
  const [editingStep, setEditingStep] = useState(false);

  const getTitle = (): { title: string; subtitle?: string } => {
    const map: Record<ActiveSection, { title: string; subtitle?: string }> = {
      basics: { title: "Journey Basics", subtitle: "Core identity and configuration" },
      classification: { title: "Classification", subtitle: "Skills, domains, and MITRE mapping" },
      environment: { title: "Environment", subtitle: "Lab VM configuration" },
      "wt1-overview": { title: "Walkthrough Overview", subtitle: "Web Recon" },
      "wt1-content": { title: "Content Editor", subtitle: "Web Recon" },
      "wt1-steps": { title: "Steps", subtitle: "Web Recon" },
      "wt1-step1": { title: "Step Editor", subtitle: "Web Recon · Step 1" },
      "wt1-step2": { title: "Step Editor", subtitle: "Web Recon · Step 2" },
      "wt1-question": { title: "Question Editor", subtitle: "Web Recon" },
      "wt2-overview": { title: "Walkthrough Overview", subtitle: "Linux Basics" },
      "wt2-content": { title: "Content Editor", subtitle: "Linux Basics" },
      "wt2-steps": { title: "Steps", subtitle: "Linux Basics" },
      validation: { title: "Validation & Publish", subtitle: "Review and go live" },
    };
    return map[section] || { title: "Editor" };
  };

  const { title, subtitle } = getTitle();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground text-balance">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      {section === "basics" && <JourneyBasicsEditor />}
      {section === "classification" && <ClassificationEditor />}
      {section === "environment" && <EnvironmentEditor />}
      {(section === "wt1-overview" || section === "wt2-overview") && (
        <WalkthroughOverviewEditor
          title={section === "wt1-overview" ? "Walkthrough 1: Web Recon" : "Walkthrough 2: Linux Basics"}
        />
      )}
      {(section === "wt1-content" || section === "wt2-content") && <ContentEditor />}
      {(section === "wt1-steps" || section === "wt2-steps") && (
        editingStep ? (
          <div>
            <Button size="sm" variant="ghost" className="gap-1.5 mb-4 -ml-2 text-muted-foreground" onClick={() => setEditingStep(false)}>
              <ArrowLeft size={13} />Back to steps
            </Button>
            <StepEditor />
          </div>
        ) : (
          <StepsList onEditStep={() => setEditingStep(true)} />
        )
      )}
      {(section === "wt1-step1" || section === "wt1-step2") && <StepEditor />}
      {section === "wt1-question" && <QuestionEditor />}
      {section === "validation" && (
        <div className="space-y-6">
          <ValidationPanel mode="full" />
        </div>
      )}
    </div>
  );
}

// ─── Walkthroughs Tab within the main panel (additional demo view) ─────────────

function WalkthroughCard({ wt, onNavigate }: { wt: { name: string; steps: number; state: NavItemState; desc: string }; onNavigate: (s: ActiveSection) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <Card className="border-border bg-card">
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/40 rounded-t-md transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <ChevronDown size={15} className="text-muted-foreground shrink-0" /> : <ChevronRight size={15} className="text-muted-foreground shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{wt.name}</span>
            <StateIcon state={wt.state} size={13} />
            <span className="text-xs text-muted-foreground">{wt.steps} steps</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{wt.desc}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Pencil size={13} className="mr-2" />Edit</DropdownMenuItem>
            <DropdownMenuItem><Copy size={13} className="mr-2" />Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive"><Trash2 size={13} className="mr-2" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </button>
      {open && (
        <CardContent className="pt-0 pb-4 px-4 space-y-1 border-t border-border">
          {["Overview", "Content", "Steps"].map((item) => (
            <button
              key={item}
              className="w-full flex items-center gap-2 py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors text-left"
              onClick={() => {
                const id = wt.name.includes("Web") ? `wt1-${item.toLowerCase()}` : `wt2-${item.toLowerCase()}`;
                onNavigate(id as ActiveSection);
              }}
            >
              <ChevronRight size={12} className="shrink-0" />
              {item}
            </button>
          ))}
        </CardContent>
      )}
    </Card>
  );
}

// ─── Page root ────────────────────────────────────────────────────────────────

export default function JourneyBuilderPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("basics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saved, setSaved] = useState(true);

  const handleSave = () => {
    setSaved(false);
    setTimeout(() => setSaved(true), 1200);
  };

  const WALKTHROUGHS_DATA = [
    { name: "Walkthrough 1: Web Recon", steps: 3, state: "warning" as NavItemState, desc: "Passive & active web reconnaissance using Amass, Subfinder, and nuclei." },
    { name: "Walkthrough 2: Linux Basics", steps: 2, state: "incomplete" as NavItemState, desc: "Core Linux commands and privilege enumeration for red team operators." },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        {/* ── Top Header ──────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/70">
          <div className="flex h-14 items-center gap-3 px-4">
            {/* Mobile menu trigger */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-8 w-8">
                  <Menu size={16} />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
                <SheetHeader className="px-4 py-3 border-b border-sidebar-border">
                  <SheetTitle className="text-sm font-semibold text-sidebar-foreground flex items-center gap-2">
                    <Shield size={15} className="text-primary" />
                    Journey Outline
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-57px)]">
                  <SidebarNav
                    active={activeSection}
                    onSelect={(id) => {
                      setActiveSection(id);
                      setSidebarOpen(false);
                    }}
                  />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <Shield size={16} className="text-primary" />
              <span className="text-sm font-semibold text-foreground hidden sm:block">CyberTrack</span>
            </div>

            <Separator orientation="vertical" className="h-5 hidden sm:block" />

            {/* Breadcrumbs */}
            <nav aria-label="breadcrumb" className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer">Journeys</span>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium truncate max-w-32">Web App Recon</span>
            </nav>

            {/* Status & meta */}
            <div className="hidden md:flex items-center gap-2 ml-1">
              <Badge variant="outline" className="text-warning border-warning/40 bg-warning/10 text-xs h-5">
                Draft
              </Badge>
              <span className="text-xs text-muted-foreground">Beginner · 2 Walkthroughs · 1 Environment</span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Save state */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              {saved ? (
                <>
                  <Check size={12} className="text-success" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Clock size={12} className="animate-spin" />
                  <span>Saving…</span>
                </>
              )}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleSave}>
                <Eye size={13} />
                Preview
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleSave}>
                <Save size={13} />
                Save Draft
              </Button>
              <Button size="sm" className="gap-1.5 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                <Send size={13} />
                Publish
              </Button>
            </div>

            {/* Mobile actions */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              <Button size="sm" className="gap-1.5 h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                <Send size={13} />
                Publish
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <MoreHorizontal size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSave}><Eye size={13} className="mr-2" />Preview</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSave}><Save size={13} className="mr-2" />Save Draft</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* ── Body ────────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 border-r border-border bg-sidebar">
            <div className="px-4 py-3 border-b border-sidebar-border flex items-center gap-2">
              <BookOpen size={13} className="text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Outline</span>
            </div>
            <ScrollArea className="flex-1">
              <SidebarNav active={activeSection} onSelect={setActiveSection} />
            </ScrollArea>
          </aside>

          {/* Main editor */}
          <main className="flex-1 min-w-0 overflow-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
              {/* Tabs: single-section editing + walkthroughs overview */}
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="mb-6 bg-secondary">
                  <TabsTrigger value="editor" className="text-xs gap-1.5">
                    <Pencil size={12} />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="walkthroughs" className="text-xs gap-1.5">
                    <Layers size={12} />
                    Walkthroughs
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs gap-1.5">
                    <Settings size={12} />
                    Settings
                  </TabsTrigger>
                </TabsList>

                {/* ── Editor tab ─────────────────────────────────── */}
                <TabsContent value="editor">
                  <Card className="border-border bg-card">
                    <CardContent className="p-5 sm:p-6">
                      <EditorContent section={activeSection} />
                    </CardContent>
                  </Card>

                  {/* ── Additional design-system demo sections ─────── */}
                  <div className="mt-8 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
                      All Editor Surfaces
                    </p>

                    {/* Walkthrough Overview demo */}
                    <Card className="border-border bg-card">
                      <CardHeader className="pb-3 px-5 pt-5">
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} className="text-primary" />
                          <CardTitle className="text-sm font-semibold">Walkthrough Overview Editor</CardTitle>
                          <Badge variant="outline" className="text-xs ml-auto">demo</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <WalkthroughOverviewEditor title="Walkthrough 1: Web Recon" />
                      </CardContent>
                    </Card>

                    {/* Content editor demo */}
                    <Card className="border-border bg-card">
                      <CardHeader className="pb-3 px-5 pt-5">
                        <div className="flex items-center gap-2">
                          <Monitor size={14} className="text-primary" />
                          <CardTitle className="text-sm font-semibold">Content Editor</CardTitle>
                          <Badge variant="outline" className="text-xs ml-auto">demo</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <ContentEditor />
                      </CardContent>
                    </Card>

                    {/* Steps list demo */}
                    <Card className="border-border bg-card">
                      <CardHeader className="pb-3 px-5 pt-5">
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-primary" />
                          <CardTitle className="text-sm font-semibold">Steps List</CardTitle>
                          <Badge variant="outline" className="text-xs ml-auto">demo</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <StepsList onEditStep={() => {}} />
                      </CardContent>
                    </Card>

                    {/* Step editor demo */}
                    <Card className="border-border bg-card">
                      <CardHeader className="pb-3 px-5 pt-5">
                        <div className="flex items-center gap-2">
                          <Terminal size={14} className="text-primary" />
                          <CardTitle className="text-sm font-semibold">Step Editor — Terminal Command</CardTitle>
                          <Badge variant="outline" className="text-xs ml-auto">demo</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <StepEditor />
                      </CardContent>
                    </Card>

                    {/* Question editor demo */}
                    <Card className="border-border bg-card">
                      <CardHeader className="pb-3 px-5 pt-5">
                        <div className="flex items-center gap-2">
                          <HelpCircle size={14} className="text-primary" />
                          <CardTitle className="text-sm font-semibold">Question Editor</CardTitle>
                          <Badge variant="outline" className="text-xs ml-auto">demo</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <QuestionEditor />
                      </CardContent>
                    </Card>

                    {/* Validation demo */}
                    <Card className="border-border bg-card">
                      <CardHeader className="pb-3 px-5 pt-5">
                        <div className="flex items-center gap-2">
                          <FlaskConical size={14} className="text-primary" />
                          <CardTitle className="text-sm font-semibold">Validation & Publish Panel</CardTitle>
                          <Badge variant="outline" className="text-xs ml-auto">demo</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <ValidationPanel mode="full" />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* ── Walkthroughs tab ────────────────────────────── */}
                <TabsContent value="walkthroughs" className="space-y-3">
                  {WALKTHROUGHS_DATA.map((wt) => (
                    <WalkthroughCard
                      key={wt.name}
                      wt={wt}
                      onNavigate={(s) => {
                        setActiveSection(s);
                      }}
                    />
                  ))}
                  <Button variant="outline" className="w-full gap-2 border-dashed mt-2">
                    <Plus size={14} />
                    Add Walkthrough
                  </Button>
                </TabsContent>

                {/* ── Settings tab ────────────────────────────────── */}
                <TabsContent value="settings">
                  <Card className="border-border bg-card">
                    <CardContent className="p-5 sm:p-6">
                      <ClassificationEditor />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>

          {/* Right readiness panel — desktop only */}
          <aside className="hidden xl:flex flex-col w-72 shrink-0 border-l border-border bg-card">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Zap size={13} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Readiness</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4">
                {/* Summary counts */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Walkthroughs", value: 2, icon: <Layers size={13} /> },
                    { label: "Steps", value: 3, icon: <FileText size={13} /> },
                    { label: "Issues", value: 1, icon: <AlertCircle size={13} />, warn: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-md border p-2 text-center ${item.warn ? "border-destructive/30 bg-destructive/5" : "border-border bg-secondary/50"}`}
                    >
                      <div className={`flex justify-center mb-1 ${item.warn ? "text-destructive" : "text-muted-foreground"}`}>
                        {item.icon}
                      </div>
                      <p className={`text-lg font-bold leading-none ${item.warn ? "text-destructive" : "text-foreground"}`}>
                        {item.value}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{item.label}</p>
                    </div>
                  ))}
                </div>
                <ValidationPanel mode="sidebar" />
              </div>
            </ScrollArea>
          </aside>
        </div>

        {/* Mobile readiness panel — below main on small screens */}
        <div className="xl:hidden border-t border-border bg-card">
          <details className="group">
            <summary className="flex items-center justify-between px-4 py-3 cursor-pointer list-none">
              <div className="flex items-center gap-2">
                <Zap size={13} className="text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Readiness</span>
                <Badge variant="outline" className="text-destructive border-destructive/40 bg-destructive/10 text-xs h-5">
                  1 issue
                </Badge>
              </div>
              <ChevronDown size={14} className="text-muted-foreground group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-4 pb-4">
              <ValidationPanel mode="sidebar" />
            </div>
          </details>
        </div>
      </div>
    </TooltipProvider>
  );
}
