export interface SavedAddress {
  id: string;
  label: string;
  detail: string;
  isDefault?: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault?: boolean;
}

export const defaultProfile = {
  fullName: "Jordan Rivera",
  email: "jordan@example.com",
  phone: "(555) 012-4488",
  initials: "JR",
  memberSince: "March 2023",
};

export const defaultAddresses: SavedAddress[] = [
  { id: "home", label: "Home", detail: "214 Maple Street, Springfield", isDefault: true },
  { id: "work", label: "Work", detail: "88 Commerce Plaza, Springfield" },
];

export const defaultPaymentMethods: SavedPaymentMethod[] = [
  { id: "visa-4242", brand: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
  { id: "mc-8891", brand: "Mastercard", last4: "8891", expiry: "02/26" },
];
