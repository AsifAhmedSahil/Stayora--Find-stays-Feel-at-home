import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Eye,
  EyeOff,
  Heart,
  House,
  Info,
  List,
  LockKeyhole,
  Mail,
  Map,
  MapPin,
  Minus,
  Plus,
  Search,
  Share,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Sun,
  Trees,
  TriangleAlert,
  UserRound,
  Waves,
  X,
} from "lucide-react-native";

export const icons = {
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  bell: Bell,
  bookmark: Bookmark,
  calendar: CalendarDays,
  check: Check,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  help: CircleHelp,
  creditCard: CreditCard,
  eye: Eye,
  eyeOff: EyeOff,
  heart: Heart,
  home: House,
  info: Info,
  list: List,
  lock: LockKeyhole,
  mail: Mail,
  map: Map,
  mapPin: MapPin,
  minus: Minus,
  plus: Plus,
  search: Search,
  share: Share,
  settings: Settings,
  shield: ShieldCheck,
  sliders: SlidersHorizontal,
  star: Star,
  sun: Sun,
  trees: Trees,
  warning: TriangleAlert,
  user: UserRound,
  waves: Waves,
  close: X,
} as const;

export type IconName = keyof typeof icons;
export type IconTone =
  | "default"
  | "secondary"
  | "accent"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "onBrand"
  | "onMedia";
