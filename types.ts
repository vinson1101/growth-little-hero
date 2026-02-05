
export type ViewType = 'HOME' | 'MANAGEMENT' | 'REWARDS';

export interface Task {
  id: string;
  title: string;
  points: number;
  isPublished: boolean;
  isCompleted: boolean;
  isDaily: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  icon?: string;
}

export interface GachaItem {
  id: string;
  title: string;
}

export interface Redemption {
  id: string;
  title: string;
  timestamp: string;
  isUsed: boolean;
  source: 'SHOP' | 'GACHA';
}

export interface AppState {
  score: number;
  tasks: Task[];
  shopRewards: RewardItem[];
  gachaPool: GachaItem[];
  redemptions: Redemption[];
  lastActiveDate: string; // Used for daily reset check
}
