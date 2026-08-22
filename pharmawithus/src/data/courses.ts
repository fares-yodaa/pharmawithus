export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  anchorPrice: number;
  currency: string;
  lessonCount: number;
  duration: string;
  passRate: number;
  badge?: string;
  features: string[];
  popular?: boolean;
  pictureUrl?: string;
}

export const courses: Course[] = [
  {
    id: 'pre-reg',
    title: 'Pre-Reg Exam Mastery',
    subtitle: 'GPhC Registration Assessment',
    description: 'Everything you need to pass your pre-registration exam on the first attempt. Comprehensive coverage of all GPhC domains.',
    price: 29,
    anchorPrice: 0,
    currency: '$',
    lessonCount: 48,
    duration: '12 hours',
    passRate: 94,
    badge: 'Most Popular',
    popular: true,
    features: [
      'Full GPhC syllabus coverage',
      '500+ practice questions',
      'Mock exam simulations',
      'Quick-reference drug charts',
      'Exam strategy guide',
    ],
  },
  {
    id: 'calculations',
    title: 'Pharmacy Calculations',
    subtitle: 'Master Every Calculation Type',
    description: 'From dilutions to infusion rates — never lose marks on calculations again. Step-by-step methods that actually stick.',
    price: 19,
    anchorPrice: 0,
    currency: '$',
    lessonCount: 32,
    duration: '8 hours',
    passRate: 97,
    badge: 'Best Value',
    features: [
      'All calculation types covered',
      '300+ worked examples',
      'Speed-solving techniques',
      'Common pitfall alerts',
      'Practice worksheets',
    ],
  },
  {
    id: 'clinical',
    title: 'Clinical Pharmacy Essentials',
    subtitle: 'Therapeutics & Patient Care',
    description: 'Deep-dive into clinical therapeutics. Learn to think like a clinical pharmacist and ace your assessments.',
    price: 24,
    anchorPrice: 0,
    currency: '$',
    lessonCount: 40,
    duration: '10 hours',
    passRate: 92,
    features: [
      'Therapeutics by condition',
      'Drug interaction mastery',
      'Case-based scenarios',
      'BNF navigation shortcuts',
      'Clinical decision frameworks',
    ],
  },
  {
    id: 'bundle',
    title: 'Complete Pharmacy Bundle',
    subtitle: 'All 3 Courses + Bonus Materials',
    description: 'Get everything. All three courses plus exclusive bonus materials, priority support, and lifetime updates.',
    price: 49,
    anchorPrice: 0,
    currency: '$',
    lessonCount: 120,
    duration: '30 hours',
    passRate: 96,
    badge: 'Save 86%',
    features: [
      'All 3 courses included',
      '1,100+ practice questions',
      'Priority WhatsApp support',
      'Lifetime access & updates',
      'Exclusive study group access',
      'Bonus: Exam day checklist',
    ],
  },
];
