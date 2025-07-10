import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Eye,
  Download,
  User,
  Settings,
  Home,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Bell,
  Shield,
  Lock,
  Unlock,
  Star,
  Heart,
  Share,
  Copy,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart,
  PieChart,
  Zap,
  Lightbulb,
  Target,
  Award,
  Flag,
  Tag,
  Bookmark,
  Archive,
  Trash,
  Edit,
  Plus,
  Minus,
  MoreHorizontal,
  MoreVertical,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  type LucideIcon
} from 'lucide-react';

// Icon components for easy use throughout the app
export const Icons = {
  // File operations
  upload: Upload,
  fileText: FileText,
  eye: Eye,
  download: Download,
  
  // Status indicators
  checkCircle: CheckCircle,
  alertTriangle: AlertTriangle,
  xCircle: XCircle,
  info: Info,
  
  // Navigation
  home: Home,
  user: User,
  settings: Settings,
  bookOpen: BookOpen,
  helpCircle: HelpCircle,
  
  // UI elements
  menu: Menu,
  x: X,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  
  // Actions
  search: Search,
  filter: Filter,
  bell: Bell,
  share: Share,
  copy: Copy,
  externalLink: ExternalLink,
  
  // Security
  shield: Shield,
  lock: Lock,
  unlock: Unlock,
  
  // Social
  star: Star,
  heart: Heart,
  
  // Contact
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  
  // Time
  calendar: Calendar,
  clock: Clock,
  
  // Finance
  dollarSign: DollarSign,
  
  // Analytics
  trendingUp: TrendingUp,
  barChart: BarChart,
  pieChart: PieChart,
  
  // Features
  zap: Zap,
  lightbulb: Lightbulb,
  target: Target,
  award: Award,
  flag: Flag,
  
  // Organization
  tag: Tag,
  bookmark: Bookmark,
  archive: Archive,
  trash: Trash,
  
  // Editing
  edit: Edit,
  plus: Plus,
  minus: Minus,
  
  // More
  moreHorizontal: MoreHorizontal,
  moreVertical: MoreVertical,
  
  // Actions
  refresh: RefreshCw,
  
  // Arrows
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
} as const;

// Icon wrapper component for consistent styling
export interface IconProps {
  name: keyof typeof Icons;
  className?: string;
  size?: number;
}

export function Icon({ name, className, size = 16 }: IconProps) {
  const IconComponent = Icons[name] as LucideIcon;
  return <IconComponent className={className} size={size} />;
}

// Status icon component with predefined styles
export interface StatusIconProps {
  status: 'success' | 'warning' | 'error' | 'info';
  className?: string;
  size?: number;
}

export function StatusIcon({ status, className, size = 16 }: StatusIconProps) {
  const iconMap = {
    success: Icons.checkCircle,
    warning: Icons.alertTriangle,
    error: Icons.xCircle,
    info: Icons.info,
  };
  
  const colorMap = {
    success: 'text-lease-success',
    warning: 'text-lease-warning',
    error: 'text-lease-error',
    info: 'text-lease-info',
  };
  
  const IconComponent = iconMap[status];
  
  return (
    <IconComponent 
      className={`${colorMap[status]} ${className}`} 
      size={size} 
    />
  );
}