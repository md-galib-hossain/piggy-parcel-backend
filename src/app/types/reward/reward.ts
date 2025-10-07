import { BaseEntity, BaseQueryParams, CreateInput, UpdateInput } from '../common';
import { User } from '../user/auth';

export type BadgeType = 
  | "eco_warrior" 
  | "reliable_sender" 
  | "trusted_traveler" 
  | "quick_deliverer" 
  | "community_helper" 
  | "carbon_saver" 
  | "frequent_user";

export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Reward extends BaseEntity {
  id: number;
  userId: string;
  greenPoints: number;
  badges: string; // JSON string of Badge[]
}

// Using utility types
export type CreateReward = CreateInput<Reward>;
export type UpdateReward = UpdateInput<Reward>;

// Using intersection types
export interface RewardWithUser extends Reward {
  user: User;
}

// Enhanced interfaces using utility types
export interface UserRewardStats extends Pick<Reward, 'userId'> {
  totalGreenPoints: number;
  badges: Badge[];
  rank: number;
  pointsToNextLevel: number;
}

export interface LeaderboardEntry {
  user: User;
  greenPoints: number;
  badges: Badge[];
  rank: number;
}

// Query parameters
export interface RewardQueryParams extends BaseQueryParams {
  userId?: string;
  minPoints?: number;
  maxPoints?: number;
  hasBadges?: boolean;
}
