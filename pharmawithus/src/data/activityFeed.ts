export interface ActivityItem {
  name: string;
  action: string;
  location: string;
  timeAgo: string;
}

export const activityItems: ActivityItem[] = [
  { name: 'Sarah', action: 'just enrolled in', location: 'Pre-Reg Exam Mastery', timeAgo: '2 min ago' },
  { name: 'Ahmed', action: 'just purchased', location: 'Complete Bundle', timeAgo: '5 min ago' },
  { name: 'Priya', action: 'just started', location: 'Pharmacy Calculations', timeAgo: '8 min ago' },
  { name: 'James', action: 'just enrolled in', location: 'Clinical Pharmacy', timeAgo: '12 min ago' },
  { name: 'Fatima', action: 'just completed', location: 'Pre-Reg Exam Mastery', timeAgo: '15 min ago' },
  { name: 'David', action: 'just purchased', location: 'Complete Bundle', timeAgo: '18 min ago' },
  { name: 'Aisha', action: 'just enrolled in', location: 'Pharmacy Calculations', timeAgo: '22 min ago' },
  { name: 'Tom', action: 'just started', location: 'Pre-Reg Exam Mastery', timeAgo: '25 min ago' },
  { name: 'Nadia', action: 'just purchased', location: 'Complete Bundle', timeAgo: '28 min ago' },
  { name: 'Chris', action: 'just enrolled in', location: 'Clinical Pharmacy', timeAgo: '30 min ago' },
];
