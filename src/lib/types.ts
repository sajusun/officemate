export type EmailTone = 
  | 'polite_pushback'
  | 'executive_status'
  | 'formal_confirmation'
  | 'friendly_followup'
  | 'meeting_reschedule'
  | 'custom';

export interface TabItem {
  title: string;
  url: string;
  favIconUrl?: string;
}

export interface ProjectWorkspace {
  id: string;
  name: string;
  color: string;
  tabs: TabItem[];
  createdAt: number;
  updatedAt: number;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee?: string;
  dueDate?: string;
  completed: boolean;
}

export interface MeetingNote {
  id: string;
  meetingTitle: string;
  date: string;
  notes: string;
  actionItems: ActionItem[];
  timestamp: number;
}

export interface OfficeMateSettings {
  isPro: boolean;
  proLicenseKey?: string;
  aiProvider: 'offline' | 'openai' | 'gemini';
  aiApiKey?: string;
  aiModel?: string;
  userFullName: string;
  userJobTitle: string;
  companyName: string;
  emailSignature: string;
  freeDraftsUsedToday: number;
  lastDraftDate: string;
}
