export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  FREE_USER = 'FREE_USER' // Novo perfil
}

export interface User {
  username: string;
  role: UserRole;
  name: string;
  email?: string; // Novo
  phone?: string; // Novo
}

export type ViewState = 'landing' | 'login' | 'dashboard' | 'hidden-captain';

export interface GeneratedContent {
  subject: string;
  body: string;
}

export interface Page {
  id: number;
  title: string;
  thumbnail: string;
  url: string;
  status: 'published' | 'draft';
  lastModified: string;
  config?: PageConfig;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  color: string;
  popular: boolean;
  active: boolean;
}

// Interfaces para o Editor de Página
export interface PageColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export interface HeroSection {
  enabled: boolean;
  badge: string;
  headline: string;
  subheadline: string;
  headlineSize: number; 
  subheadlineSize: number; 
  ctaButton: string;
  ctaLink: string;
  demoButton: string;
  demoLink: string;
}

export interface AboutSection {
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  checklist: string[];
}

export interface TargetAudienceItem {
  title: string;
  description: string;
  active?: boolean;
}

export interface TargetAudienceSection {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: TargetAudienceItem[];
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface FeaturesSection {
  enabled: boolean;
  badge: string;
  title: string;
  items: FeatureItem[];
}

export interface ModuleItem {
  title: string;
  duration: string;
  lessons: string[];
}

export interface CurriculumSection {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  items: ModuleItem[];
}

export interface BonusItem {
  title: string;
  description: string;
  value: string;
}

export interface BonusSection {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: BonusItem[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  image: string;
}

export interface TestimonialsSection {
  enabled: boolean;
  title: string;
  subtitle: string;
  items: TestimonialItem[];
}

export interface PricingSection {
  enabled: boolean;
  title: string;
  subtitle: string;
  price: string;
  buttonText: string;
  buttonLink: string;
  guarantee: string;
}

export interface PageConfig {
  colors: PageColors;
  hero: HeroSection;
  about: AboutSection;
  targetAudience: TargetAudienceSection;
  features: FeaturesSection;
  curriculum: CurriculumSection;
  bonus: BonusSection;
  testimonials: TestimonialsSection;
  pricing: PricingSection;
}
