import { CreateInput, UpdateInput, BaseEntity } from '../common';
import { User } from '../user/auth';

export interface ParcelDetails {
  size: string;
  weight: number;
  contents: string;
  fragile?: boolean;
  value?: number;
}

export type DeliveryStatus = 
  | "pending" 
  | "accepted" 
  | "picked_up" 
  | "in_transit" 
  | "delivered" 
  | "cancelled";

export interface DeliveryRequest extends BaseEntity {
  id: number;
  senderId: string;
  travelerId?: string | null;
  origin: string;
  destination: string;
  parcelDetails: ParcelDetails;
  urgency?: boolean;
  proposedFee?: string | null;
  status: DeliveryStatus;
  pickupPoint?: string | null;
  dropOffPoint?: string | null;
  trackingId?: string | null;
  
}

// Using utility types for cleaner interfaces
export type CreateDeliveryRequest = CreateInput<DeliveryRequest>;
export type UpdateDeliveryRequest = UpdateInput<DeliveryRequest>;


