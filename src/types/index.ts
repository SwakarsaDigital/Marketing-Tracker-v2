export interface DailyLog {
  id: number;
  rowNumber: number; 
  date: string; 
  rawDateIso: string; 
  leadName: string;
  profileUrl: string;
  industry: string;
  source: string;
  template: string;
  interactionType: string;
  tagged: boolean;
  responseTime: string;
  status: string;
  notes: string;
  marketer: string;
  email: string;
  approvalStatus: 'None' | 'Pending' | 'Approved' | 'Declined';
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
}