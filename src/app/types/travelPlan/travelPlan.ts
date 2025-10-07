import { BaseEntity, BaseQueryParams, DateRangeQueryParams, CreateInput, UpdateInput, WithRelations, FilterParams, PaginatedResponse } from '../common';
import { User } from '../user/auth';

export type TransportMode = 
  | "bus" 
  | "car" 
  | "train" 
  | "plane" 
  | "motorcycle" 
  | "bicycle" 
  | "walking";

export interface TravelPlan extends BaseEntity {
  id: number;
  travelerId: string;
  origin: string;
  destination: string;
  departureTime: Date;
  transportMode: TransportMode;
}

// Using utility types
export type CreateTravelPlan = CreateInput<TravelPlan>;
export type UpdateTravelPlan = UpdateInput<TravelPlan>;

// Using WithRelations utility type
export type TravelPlanWithTraveler = WithRelations<TravelPlan, {
  traveler: User;
}>;

// Enhanced query parameters
export interface TravelPlanQueryParams extends BaseQueryParams, DateRangeQueryParams {
  filters?: FilterParams<Pick<TravelPlan, 'origin' | 'destination' | 'transportMode' | 'travelerId'>>;
}

// Paginated response
export type PaginatedTravelPlans = PaginatedResponse<TravelPlanWithTraveler>;
