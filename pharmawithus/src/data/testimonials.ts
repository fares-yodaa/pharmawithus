export interface Testimonial {
  id: string;
  name: string;
  university: string;
  score: string;
  quote: string;
  avatar: string;
  rating: number;
  course: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah A.',
    university: 'UCL School of Pharmacy',
    score: 'Passed with 82%',
    quote: "I was panicking 3 weeks before my exam. Found PharmaWithUs through Insta and honestly it saved me. The calculations course alone was worth 10x the price. Can't recommend enough! 💊",
    avatar: 'SA',
    rating: 5,
    course: 'Complete Bundle',
  },
  {
    id: '2',
    name: 'Mohammed K.',
    university: 'University of Manchester',
    score: 'Passed first attempt',
    quote: "After failing once, I was terrified of the resit. PharmaWithUs broke everything down so simply. The practice questions were almost identical to the real thing. Passed with confidence! 🎉",
    avatar: 'MK',
    rating: 5,
    course: 'Pre-Reg Exam Mastery',
  },
  {
    id: '3',
    name: 'Priya S.',
    university: 'King\'s College London',
    score: 'Passed with 88%',
    quote: "The clinical pharmacy course is incredible. Real case scenarios that actually came up in my exam. I went from stressed to confident in 2 weeks. Best investment I've made.",
    avatar: 'PS',
    rating: 5,
    course: 'Clinical Pharmacy',
  },
  {
    id: '4',
    name: 'James O.',
    university: 'University of Bath',
    score: 'Passed with 79%',
    quote: "I tried YouTube videos, textbooks, everything. Nothing clicked until PharmaWithUs. The way they structure the content just makes sense. My exam felt easy afterwards 💪",
    avatar: 'JO',
    rating: 5,
    course: 'Complete Bundle',
  },
  {
    id: '5',
    name: 'Amira H.',
    university: 'University of Nottingham',
    score: 'Passed first attempt',
    quote: "Calculations were my worst nightmare. This course turned them into my strongest area. 97% pass rate is NOT a lie — their methods actually work. Tell everyone!",
    avatar: 'AH',
    rating: 5,
    course: 'Pharmacy Calculations',
  },
  {
    id: '6',
    name: 'Daniel R.',
    university: 'Cardiff University',
    score: 'Passed with 85%',
    quote: "Got this 2 days before my exam as a last resort. Even in that short time, the mock exams and quick-reference guides were game-changers. Worth every single penny.",
    avatar: 'DR',
    rating: 5,
    course: 'Pre-Reg Exam Mastery',
  },
];
