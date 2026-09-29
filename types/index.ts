export type UserRole = "admin" | "user" | null;

export interface Pet {
  _id: string;
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other" | string;
  category: "Dog" | "Cat" | "Bird" | "Rabbit" | string;
  location: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  isAdopted: boolean;
  isFeatured?: boolean;
  tags?: string[];
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhoto?: string;
  dateAdded?: string | Date;
  createdAt?: string | Date;
}

export interface CampaignUpdate {
  message: string;
  date: string | Date;
}

export interface Campaign {
  _id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  goalAmount: number;
  collectedAmount: number;
  location: string;
  createdAt: string | Date;
  deadline: string | Date;
  tags: string[];
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhoto?: string;
  isFeatured?: boolean;
  donations?: Array<{
    amount: number;
    donorId: string;
    donorName?: string;
    donorEmail?: string;
    createdAt?: string | Date;
  }>;
  supporters?: number;
  updates?: CampaignUpdate[];
  isOpen: boolean;
  petName?: string;
  dateAdded?: string | Date;
  category?: string;
}

export interface AdoptionRequest {
  _id: string;
  petId?: string;
  petName: string;
  petImage?: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  phone?: string;
  address: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  createdAt?: string | Date;
}

export interface DonationRecord {
  _id: string;
  amount: number;
  campaignId: string;
  donorId: string;
  paymentId?: string;
  campaignSnapshot: {
    title: string;
    image: string;
    petName?: string;
  };
  isRefunded?: boolean;
  createdAt: string | Date;
}

export interface AppUser {
  _id: string;
  uid: string;
  name: string;
  email: string;
  image?: string;
  photoURL?: string;
  role: "admin" | "user";
  banned?: boolean;
  createdAt?: string | Date;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface DashboardNavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles: Array<"admin" | "user">;
}

export interface FaqItem {
  itemNo: number;
  title: string;
  content: string;
}

export interface TestimonialItem {
  id: number;
  starsCount: number;
  quote: string;
  img: string | { src: string; height: number; width: number };
  adopterName: string;
  adopterDesignation: string;
}
