import React from 'react';
import { 
  // Navigation & Interface
  Home,
  Settings,
  User,
  Menu,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  Minus,
  Edit,
  Trash2,
  MoreHorizontal,
  MoreVertical,
  Bell,
  
  // Financial
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  PiggyBank,
  Receipt,
  Calculator,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  
  // Categories
  ShoppingCart,
  Car,
  Home as HouseBase,
  Utensils,
  Coffee,
  Gamepad2,
  Plane,
  Heart,
  GraduationCap,
  Briefcase,
  
  // Actions
  Check,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Eye,
  EyeOff,
  Download,
  Upload,
  Share,
  Copy,
  
  // Authentication
  Lock,
  Unlock,
  LogIn,
  LogOut,
  UserPlus,
  Mail,
  Phone,
  Shield,
  
  // Time & Date
  Calendar,
  Clock,
  Clock3,
  
  // Status
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  
} from 'lucide-react-native';
import { colors } from '../../design-system/tokens';

// Tamanhos padronizados dos ícones
type IconSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';

// Cores disponíveis para ícones
type IconColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'white';

interface IconProps {
  size?: IconSize | number;
  color?: IconColor | string;
  strokeWidth?: number;
}

// Mapeamento de tamanhos
const iconSizes: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  base: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
};

// Cores de ícones disponíveis
const iconColors: Record<IconColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  accent: colors.primary[500],
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  white: colors.neutral[0],
};

// Função helper para criar componentes de ícone
const createIcon = (LucideIcon: any) => {
  return ({ size = 'base', color = 'primary', strokeWidth = 2, ...props }: IconProps) => {
    const iconSize = typeof size === 'number' ? size : iconSizes[size];
    const iconColor = typeof color === 'string' && color.startsWith('#') ? color : iconColors[color as IconColor];
    
    return (
      <LucideIcon
        size={iconSize}
        color={iconColor}
        strokeWidth={strokeWidth}
        {...props}
      />
    );
  };
};

// ==================== NAVIGATION & INTERFACE ====================
export const HomeIcon = createIcon(Home);
export const SettingsIcon = createIcon(Settings);
export const UserIcon = createIcon(User);
export const MenuIcon = createIcon(Menu);
export const SearchIcon = createIcon(Search);
export const FilterIcon = createIcon(Filter);
export const ArrowLeftIcon = createIcon(ArrowLeft);
export const ArrowRightIcon = createIcon(ArrowRight);
export const ArrowUpIcon = createIcon(ArrowUp);
export const ArrowDownIcon = createIcon(ArrowDown);
export const ChevronLeftIcon = createIcon(ChevronLeft);
export const ChevronRightIcon = createIcon(ChevronRight);
export const ChevronUpIcon = createIcon(ChevronUp);
export const ChevronDownIcon = createIcon(ChevronDown);
export const CloseIcon = createIcon(X);
export const PlusIcon = createIcon(Plus);
export const MinusIcon = createIcon(Minus);
export const EditIcon = createIcon(Edit);
export const DeleteIcon = createIcon(Trash2);
export const MoreHorizontalIcon = createIcon(MoreHorizontal);
export const MoreVerticalIcon = createIcon(MoreVertical);
export const BellIcon = createIcon(Bell);

// ==================== FINANCIAL ====================
export const DollarIcon = createIcon(DollarSign);
export const TrendingUpIcon = createIcon(TrendingUp);
export const TrendingDownIcon = createIcon(TrendingDown);
export const CreditCardIcon = createIcon(CreditCard);
export const WalletIcon = createIcon(Wallet);
export const PiggyBankIcon = createIcon(PiggyBank);
export const ReceiptIcon = createIcon(Receipt);
export const CalculatorIcon = createIcon(Calculator);
export const TargetIcon = createIcon(Target);
export const BarChartIcon = createIcon(BarChart3);
export const PieChartIcon = createIcon(PieChart);
export const LineChartIcon = createIcon(LineChart);

// ==================== CATEGORIES ====================
export const ShoppingIcon = createIcon(ShoppingCart);
export const CarIcon = createIcon(Car);
export const HouseIcon = createIcon(HouseBase);
export const FoodIcon = createIcon(Utensils);
export const CoffeeIcon = createIcon(Coffee);
export const EntertainmentIcon = createIcon(Gamepad2);
export const TravelIcon = createIcon(Plane);
export const HealthIcon = createIcon(Heart);
export const EducationIcon = createIcon(GraduationCap);
export const WorkIcon = createIcon(Briefcase);

// ==================== ACTIONS ====================
export const CheckIcon = createIcon(Check);
export const CheckCircleIcon = createIcon(CheckCircle);
export const AlertIcon = createIcon(AlertCircle);
export const WarningIcon = createIcon(AlertTriangle);
export const InfoIcon = createIcon(Info);
export const HelpIcon = createIcon(HelpCircle);
export const EyeIcon = createIcon(Eye);
export const EyeOffIcon = createIcon(EyeOff);
export const DownloadIcon = createIcon(Download);
export const UploadIcon = createIcon(Upload);
export const ShareIcon = createIcon(Share);
export const CopyIcon = createIcon(Copy);

// ==================== AUTHENTICATION ====================
export const LockIcon = createIcon(Lock);
export const UnlockIcon = createIcon(Unlock);
export const LoginIcon = createIcon(LogIn);
export const LogoutIcon = createIcon(LogOut);
export const UserPlusIcon = createIcon(UserPlus);
export const MailIcon = createIcon(Mail);
export const PhoneIcon = createIcon(Phone);
export const ShieldIcon = createIcon(Shield);

// ==================== TIME & DATE ====================
export const CalendarIcon = createIcon(Calendar);
export const ClockIcon = createIcon(Clock);

// ==================== STATUS ====================
export const WifiIcon = createIcon(Wifi);
export const WifiOffIcon = createIcon(WifiOff);
export const BatteryIcon = createIcon(Battery);
export const SignalIcon = createIcon(Signal);

// ==================== MAPEAMENTO DE CATEGORIAS ====================
// Helper para ícones de categoria financeira
export const categoryIcons = {
  food: FoodIcon,
  transport: CarIcon,
  shopping: ShoppingIcon,
  entertainment: EntertainmentIcon,
  health: HealthIcon,
  education: EducationIcon,
  work: WorkIcon,
  travel: TravelIcon,
  home: HouseIcon,
  coffee: CoffeeIcon,
} as const;

// Helper para ícones de status financeiro
export const statusIcons = {
  income: TrendingUpIcon,
  expense: TrendingDownIcon,
  savings: PiggyBankIcon,
  investment: TargetIcon,
} as const;

export type CategoryIconType = keyof typeof categoryIcons;
export type StatusIconType = keyof typeof statusIcons;