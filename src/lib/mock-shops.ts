export interface MockReview {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  date: string;
  comment: string;
}

export interface MockShop {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  distanceMiles: number;
  open: boolean;
  promoted?: boolean;
  description: string;
  address: string;
  hours: { day: string; hours: string }[];
  reviews: MockReview[];
  ratingBreakdown: [number, number, number, number, number]; // 5-star .. 1-star, percentages
}

export const mockShops: MockShop[] = [
  {
    id: "corner-market",
    name: "Corner Market",
    category: "Grocery · Convenience",
    rating: 4.8,
    reviewCount: 212,
    distance: "0.4 mi",
    distanceMiles: 0.4,
    open: true,
    promoted: true,
    description:
      "Your neighborhood grocery stop for fresh produce, dairy, and pantry staples — family-run since 1998.",
    address: "214 Maple Street, Springfield",
    hours: [
      { day: "Mon – Fri", hours: "7:00 AM – 10:00 PM" },
      { day: "Saturday", hours: "8:00 AM – 10:00 PM" },
      { day: "Sunday", hours: "8:00 AM – 8:00 PM" },
    ],
        reviews: [
      { id: "r1", authorName: "Priya S.", authorInitials: "PS", rating: 5, date: "2d ago", comment: "Fast delivery and everything was fresh. My go-to for weekly groceries now." },
      { id: "r2", authorName: "Marcus T.", authorInitials: "MT", rating: 4, date: "1w ago", comment: "Great selection, wish they had more organic options." },
      { id: "r3", authorName: "Alicia T.", authorInitials: "AT", rating: 5, date: "3w ago", comment: "Comparing prices across shops before ordering saves me real money every week." },
    ],
    ratingBreakdown: [78, 15, 4, 2, 1],
  },
  {
    id: "rivera-bakery",
    name: "Rivera Bakery",
    category: "Bakery · Cafe",
    rating: 4.6,
    reviewCount: 98,
    distance: "0.7 mi",
    distanceMiles: 0.7,
    open: true,
    description: "Wood-fired sourdough, pastries, and coffee baked fresh every morning.",
    address: "88 Birch Avenue, Springfield",
    hours: [
      { day: "Mon – Sat", hours: "6:30 AM – 6:00 PM" },
      { day: "Sunday", hours: "7:00 AM – 2:00 PM" },
    ],
        reviews: [
      { id: "r1", authorName: "Marcus Rivera", authorInitials: "MR", rating: 5, date: "4d ago", comment: "Happy Store brought in customers who'd never have found our bakery otherwise." },
      { id: "r2", authorName: "Devon K.", authorInitials: "DK", rating: 4, date: "2w ago", comment: "Croissants are excellent, occasionally sell out early." },
    ],
    ratingBreakdown: [70, 20, 6, 3, 1],
  },
  {
    id: "green-leaf-pharmacy",
    name: "Green Leaf Pharmacy",
    category: "Pharmacy",
    rating: 4.4,
    reviewCount: 54,
    distance: "1.1 mi",
    distanceMiles: 1.1,
    open: false,
    description: "Full-service pharmacy with same-day delivery on prescriptions and health essentials.",
    address: "500 Oak Court, Springfield",
    hours: [
      { day: "Mon – Fri", hours: "8:00 AM – 9:00 PM" },
      { day: "Saturday", hours: "9:00 AM – 7:00 PM" },
      { day: "Sunday", hours: "Closed" },
    ],
        reviews: [
      { id: "r1", authorName: "Nora J.", authorInitials: "NJ", rating: 4, date: "5d ago", comment: "Quick prescription pickup, staff is always helpful." },
    ],
    ratingBreakdown: [60, 25, 10, 4, 1],
  },
  {
    id: "sunny-side-cafe",
    name: "Sunny Side Cafe",
    category: "Cafe · Breakfast",
    rating: 4.7,
    reviewCount: 143,
    distance: "0.9 mi",
    distanceMiles: 0.9,
    open: true,
    description: "All-day breakfast and specialty coffee in a cozy corner spot.",
    address: "12 Elm Street, Springfield",
    hours: [{ day: "Every day", hours: "6:00 AM – 3:00 PM" }],
        reviews: [
      { id: "r1", authorName: "Sam O.", authorInitials: "SO", rating: 5, date: "1w ago", comment: "Best flat white in the neighborhood, hands down." },
    ],
    ratingBreakdown: [82, 12, 4, 1, 1],
  },
  {
    id: "harbor-general",
    name: "Harbor General Store",
    category: "General · Convenience",
    rating: 4.2,
    reviewCount: 67,
    distance: "1.4 mi",
    distanceMiles: 1.4,
    open: true,
    description: "A little bit of everything — household goods, snacks, and local gifts.",
    address: "301 Harbor Way, Springfield",
    hours: [{ day: "Every day", hours: "8:00 AM – 10:00 PM" }],
        reviews: [
      { id: "r1", authorName: "Elena V.", authorInitials: "EV", rating: 4, date: "3d ago", comment: "Convenient for last-minute essentials." },
    ],
    ratingBreakdown: [55, 25, 12, 5, 3],
  },
  {
    id: "maple-diner",
    name: "Maple Street Diner",
    category: "Dining",
    rating: 4.5,
    reviewCount: 189,
    distance: "1.6 mi",
    distanceMiles: 1.6,
    open: false,
    description: "Classic comfort food and daily specials since 1985.",
    address: "45 Maple Street, Springfield",
    hours: [{ day: "Every day", hours: "11:00 AM – 9:00 PM" }],
        reviews: [
      { id: "r1", authorName: "Tom B.", authorInitials: "TB", rating: 5, date: "6d ago", comment: "Portions are huge and the pie is unbeatable." },
    ],
    ratingBreakdown: [72, 18, 6, 3, 1],
  },
];

export function getShopById(id: string) {
  return mockShops.find((s) => s.id === id);
}
