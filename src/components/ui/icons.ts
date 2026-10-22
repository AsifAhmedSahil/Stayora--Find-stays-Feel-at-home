import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Heart,
  House,
  Info,
  List,
  LockKeyhole,
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
  chevronRight: ChevronRight,
  help: CircleHelp,
  creditCard: CreditCard,
  heart: Heart,
  home: House,
  info: Info,
  list: List,
  lock: LockKeyhole,
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
  | "onBrand";
