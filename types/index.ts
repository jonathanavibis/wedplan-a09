export type Role = 'Customer' | 'Vendor' | 'Admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
  isBlocked?: boolean;
  businessName?: string;
  subscriptionPlan?: 'free' | 'premium';
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceItem {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  isActive: boolean;
  vendorId?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
    businessName?: string;
    subscriptionPlan?: string;
  };
  createdAt?: string;
}

export interface BookingItem {
  _id: string;
  serviceId: ServiceItem;
  vendorId: User;
  customerId: User;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';
  createdAt: string;
}

export interface TransactionItem {
  _id: string;
  vendorId: User;
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: string;
  createdAt: string;
}
