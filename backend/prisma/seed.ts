import { PrismaClient, Role, ShopStatus, OrderStatus, OrderMethod, NotificationTone, TransactionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // --- Categories ---
  await prisma.category.createMany({
    data: [
      { slug: 'groceries', label: 'Groceries' },
      { slug: 'bakery',    label: 'Bakery'    },
      { slug: 'cafe',      label: 'Cafe'      },
      { slug: 'pharmacy',  label: 'Pharmacy'  },
      { slug: 'general',   label: 'General'   },
      { slug: 'dining',    label: 'Dining'    },
    ],
    skipDuplicates: true,
  });
  console.log('Categories seeded');

  // --- Password Hashes ---
  const defaultPassword     = await bcrypt.hash('Password123!', 10);
  const devAdminPassword    = await bcrypt.hash('HappyStore_Admin@2026', 10);
  const devOwnerPassword    = await bcrypt.hash('HappyStore_Owner@2026', 10);
  const devCustomerPassword = await bcrypt.hash('HappyStore_Customer@2026', 10);

  // --- Existing Seed Users ---
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@happystore.com' },
    update: {},
    create: {
      fullName:    'Admin User',
      email:       'admin@happystore.com',
      password:    defaultPassword,
      initials:    'AU',
      role:        Role.ADMIN,
      status:      'ACTIVE',
      memberSince: new Date('2024-01-01'),
    },
  });

  const shopOwner1 = await prisma.user.upsert({
    where: { email: 'owner.rivera@happystore.com' },
    update: {},
    create: {
      fullName:    'Maria Rivera',
      email:       'owner.rivera@happystore.com',
      password:    defaultPassword,
      initials:    'MR',
      phone:       '+1 (555) 100-2000',
      role:        Role.SHOP_OWNER,
      status:      'ACTIVE',
      memberSince: new Date('2024-03-15'),
    },
  });

  const shopOwner2 = await prisma.user.upsert({
    where: { email: 'owner.chen@happystore.com' },
    update: {},
    create: {
      fullName:    'James Chen',
      email:       'owner.chen@happystore.com',
      password:    defaultPassword,
      initials:    'JC',
      phone:       '+1 (555) 200-3000',
      role:        Role.SHOP_OWNER,
      status:      'ACTIVE',
      memberSince: new Date('2024-04-01'),
    },
  });

  const shopOwner3 = await prisma.user.upsert({
    where: { email: 'owner.kapoor@happystore.com' },
    update: {},
    create: {
      fullName:    'Priya Kapoor',
      email:       'owner.kapoor@happystore.com',
      password:    defaultPassword,
      initials:    'PK',
      phone:       '+1 (555) 300-4000',
      role:        Role.SHOP_OWNER,
      status:      'ACTIVE',
      memberSince: new Date('2024-05-20'),
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'alex.morgan@email.com' },
    update: {},
    create: {
      fullName:    'Alex Morgan',
      email:       'alex.morgan@email.com',
      password:    defaultPassword,
      initials:    'AM',
      phone:       '+1 (555) 123-4567',
      role:        Role.CUSTOMER,
      status:      'ACTIVE',
      memberSince: new Date('2024-06-01'),
    },
  });

  // --- Dev Test Accounts (development only) ---
  // These accounts use .local domains so they are trivially distinguishable
  // from real accounts and can never collide with production email addresses.
  const devAdmin = await prisma.user.upsert({
    where: { email: 'admin@happystore.local' },
    update: {},
    create: {
      fullName:    'Dev Admin',
      email:       'admin@happystore.local',
      password:    devAdminPassword,
      initials:    'DA',
      role:        Role.ADMIN,
      status:      'ACTIVE',
      memberSince: new Date('2024-01-01'),
    },
  });

  const devOwner = await prisma.user.upsert({
    where: { email: 'owner@happystore.local' },
    update: {},
    create: {
      fullName:    'Dev Shop Owner',
      email:       'owner@happystore.local',
      password:    devOwnerPassword,
      initials:    'DO',
      phone:       '+1 (555) 000-0001',
      role:        Role.SHOP_OWNER,
      status:      'ACTIVE',
      memberSince: new Date('2024-02-01'),
    },
  });

  const devCustomer = await prisma.user.upsert({
    where: { email: 'customer@happystore.local' },
    update: {},
    create: {
      fullName:    'Dev Customer',
      email:       'customer@happystore.local',
      password:    devCustomerPassword,
      initials:    'DC',
      phone:       '+1 (555) 000-0002',
      role:        Role.CUSTOMER,
      status:      'ACTIVE',
      memberSince: new Date('2024-03-01'),
    },
  });

  console.log('Users seeded (including dev test accounts)');

  // --- Shops ---
  const cornerMarket = await prisma.shop.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id:          '11111111-1111-1111-1111-111111111111',
      name:        'Corner Market',
      category:    'groceries',
      rating:      4.7,
      reviewCount: 238,
      open:        true,
      promoted:    true,
      description: 'Your neighborhood grocery store with fresh produce, dairy, and pantry essentials sourced from local farms.',
      address:     '123 Main St, Springfield',
      latitude:    37.7749,
      longitude:   -122.4194,
      hours:       [{ day: 'Mon-Fri', hours: '7am - 9pm' }, { day: 'Sat-Sun', hours: '8am - 8pm' }],
      status:      ShopStatus.APPROVED,
      ownerId:     shopOwner1.id,
    },
  });

  const riveraBakery = await prisma.shop.upsert({
    where: { id: '22222222-2222-2222-2222-222222222222' },
    update: {},
    create: {
      id:          '22222222-2222-2222-2222-222222222222',
      name:        'Rivera Bakery',
      category:    'bakery',
      rating:      4.9,
      reviewCount: 412,
      open:        true,
      promoted:    false,
      description: 'Artisan sourdough and French pastries baked fresh daily using traditional techniques and locally sourced ingredients.',
      address:     '45 Baker Ave, Springfield',
      latitude:    37.7750,
      longitude:   -122.4185,
      hours:       [{ day: 'Tue-Sun', hours: '6am - 2pm' }, { day: 'Mon', hours: 'Closed' }],
      status:      ShopStatus.APPROVED,
      ownerId:     shopOwner2.id,
    },
  });

  const sunnySideCafe = await prisma.shop.upsert({
    where: { id: '33333333-3333-3333-3333-333333333333' },
    update: {},
    create: {
      id:          '33333333-3333-3333-3333-333333333333',
      name:        'Sunny Side Cafe',
      category:    'cafe',
      rating:      4.6,
      reviewCount: 187,
      open:        true,
      promoted:    false,
      description: 'Cozy neighborhood cafe offering specialty coffee, fresh bagels, and a warm atmosphere to start your day right.',
      address:     '88 Sunridge Rd, Springfield',
      latitude:    37.7730,
      longitude:   -122.4175,
      hours:       [{ day: 'Mon-Fri', hours: '6:30am - 5pm' }, { day: 'Sat-Sun', hours: '7am - 3pm' }],
      status:      ShopStatus.APPROVED,
      ownerId:     shopOwner3.id,
    },
  });

  const greenLeafPharmacy = await prisma.shop.upsert({
    where: { id: '44444444-4444-4444-4444-444444444444' },
    update: {},
    create: {
      id:          '44444444-4444-4444-4444-444444444444',
      name:        'Green Leaf Pharmacy',
      category:    'pharmacy',
      rating:      4.5,
      reviewCount: 95,
      open:        true,
      promoted:    false,
      description: 'Community pharmacy providing medications, vitamins, wellness products, and professional pharmacist consultations.',
      address:     '210 Wellness Blvd, Springfield',
      latitude:    37.7760,
      longitude:   -122.4210,
      hours:       [{ day: 'Mon-Fri', hours: '8am - 8pm' }, { day: 'Sat', hours: '9am - 6pm' }, { day: 'Sun', hours: '10am - 4pm' }],
      status:      ShopStatus.APPROVED,
      ownerId:     shopOwner1.id,
    },
  });

  const harborGeneral = await prisma.shop.upsert({
    where: { id: '55555555-5555-5555-5555-555555555555' },
    update: {},
    create: {
      id:          '55555555-5555-5555-5555-555555555555',
      name:        'Harbor General Store',
      category:    'general',
      rating:      4.3,
      reviewCount: 64,
      open:        true,
      promoted:    false,
      description: 'A curated general store with eco-friendly products, handmade goods, and unique home items sourced from local artisans.',
      address:     '5 Harbor Dr, Springfield',
      latitude:    37.7745,
      longitude:   -122.4220,
      hours:       [{ day: 'Mon-Sat', hours: '10am - 7pm' }, { day: 'Sun', hours: '11am - 5pm' }],
      status:      ShopStatus.APPROVED,
      ownerId:     shopOwner2.id,
    },
  });

  const mapleDiner = await prisma.shop.upsert({
    where: { id: '66666666-6666-6666-6666-666666666666' },
    update: {},
    create: {
      id:          '66666666-6666-6666-6666-666666666666',
      name:        'Maple Street Diner',
      category:    'dining',
      rating:      4.7,
      reviewCount: 310,
      open:        true,
      promoted:    true,
      description: 'Classic American diner serving hearty breakfasts, comfort lunches, and family-style dinners since 1987.',
      address:     '102 Maple St, Springfield',
      latitude:    37.7740,
      longitude:   -122.4198,
      hours:       [{ day: 'Daily', hours: '7am - 10pm' }],
      status:      ShopStatus.APPROVED,
      ownerId:     shopOwner3.id,
    },
  });

  // Dev owner's shop
  const happyFreshMarket = await prisma.shop.upsert({
    where: { id: '77777777-7777-7777-7777-777777777777' },
    update: {},
    create: {
      id:          '77777777-7777-7777-7777-777777777777',
      name:        'Happy Fresh Market',
      category:    'groceries',
      rating:      4.6,
      reviewCount: 52,
      open:        true,
      promoted:    false,
      description: 'A vibrant neighborhood market stocking premium organic produce, artisan cheeses, fresh-baked bread, and specialty pantry items.',
      address:     '301 Green Valley Rd, Springfield',
      latitude:    37.7755,
      longitude:   -122.4165,
      hours:       [{ day: 'Mon-Sat', hours: '7am - 9pm' }, { day: 'Sun', hours: '8am - 7pm' }],
      status:      ShopStatus.APPROVED,
      ownerId:     devOwner.id,
    },
  });

  console.log('Shops seeded');

  // --- Products ---
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      // Corner Market
      { id: 'aaaa0001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Organic Whole Milk, 1 Gal',   description: 'Fresh organic whole milk from local dairy farms, pasteurized and vitamin D fortified.', price: 4.29, unit: 'gal',    rating: 4.7, reviewCount: 64, shopId: cornerMarket.id,      categorySlug: 'groceries' },
      { id: 'aaaa0002-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Cold Brew Concentrate',        description: 'Slow-steeped for 18 hours, smooth and low-acid. Makes up to 6 servings.',             price: 8.99,               rating: 4.5, reviewCount: 31, shopId: cornerMarket.id,      categorySlug: 'groceries' },
      { id: 'aaaa0003-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Cage-Free Eggs, Dozen',        description: 'Large brown eggs from cage-free hens, grade A.',                                       price: 5.49,               rating: 4.8, reviewCount: 52, shopId: cornerMarket.id,      categorySlug: 'groceries' },
      { id: 'aaaa0004-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Avocados, 4-pack',             description: 'Ripe and ready Hass avocados, perfect for guacamole or toast.',                        price: 6.50,               rating: 4.4, reviewCount: 22, shopId: cornerMarket.id,      categorySlug: 'groceries' },
      { id: 'aaaa0005-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Sparkling Water, 12-pack',     description: 'Naturally carbonated spring water, unflavored.',                                       price: 7.99, outOfStock: true, rating: 4.3, reviewCount: 18, shopId: cornerMarket.id, categorySlug: 'groceries' },
      // Rivera Bakery
      { id: 'bbbb0001-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Sourdough Loaf',               description: 'Naturally leavened, wood-fired sourdough with a crisp crust and open crumb.',         price: 6.50, compareAtPrice: 7.50, rating: 4.9, reviewCount: 87, shopId: riveraBakery.id, categorySlug: 'bakery' },
      { id: 'bbbb0002-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Croissant, 4-pack',            description: 'Butter croissants laminated in-house, baked fresh daily.',                            price: 7.20,               rating: 4.8, reviewCount: 45, shopId: riveraBakery.id,     categorySlug: 'bakery' },
      { id: 'bbbb0003-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Cinnamon Roll',                description: 'Soft-baked roll with brown sugar filling and cream cheese glaze.',                    price: 3.75,               rating: 4.7, reviewCount: 39, shopId: riveraBakery.id,     categorySlug: 'bakery' },
      { id: 'bbbb0004-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Baguette',                     description: 'Classic French baguette, crisp crust and airy interior.',                             price: 4.00,               rating: 4.6, reviewCount: 28, shopId: riveraBakery.id,     categorySlug: 'bakery' },
      // Sunny Side Cafe
      { id: 'cccc0001-cccc-cccc-cccc-cccccccccccc', name: 'House Blend Coffee, 12oz Bag', description: 'Medium roast blend with notes of cocoa and toasted almond.',                          price: 11.00,              rating: 4.8, reviewCount: 56, shopId: sunnySideCafe.id,     categorySlug: 'cafe'     },
      { id: 'cccc0002-cccc-cccc-cccc-cccccccccccc', name: 'Everything Bagel, 4-pack',     description: 'Hand-rolled and topped generously with everything seasoning.',                        price: 6.00,               rating: 4.6, reviewCount: 24, shopId: sunnySideCafe.id,     categorySlug: 'cafe'     },
      // Green Leaf Pharmacy
      { id: 'dddd0001-dddd-dddd-dddd-dddddddddddd', name: 'Allergy Relief, 30ct',         description: '24-hour non-drowsy allergy relief tablets.',                                          price: 12.99,              rating: 4.5, reviewCount: 19, shopId: greenLeafPharmacy.id, categorySlug: 'pharmacy' },
      { id: 'dddd0002-dddd-dddd-dddd-dddddddddddd', name: 'Vitamin D3, 90ct',             description: '2000 IU softgels to support bone and immune health.',                                 price: 9.49,               rating: 4.7, reviewCount: 33, shopId: greenLeafPharmacy.id, categorySlug: 'pharmacy' },
      { id: 'dddd0003-dddd-dddd-dddd-dddddddddddd', name: 'Digital Thermometer',          description: 'Fast 10-second readings with fever alert.',                                           price: 14.00,              rating: 4.4, reviewCount: 12, shopId: greenLeafPharmacy.id, categorySlug: 'pharmacy' },
      // Harbor General
      { id: 'eeee0001-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Reusable Tote Bag',           description: 'Heavy-duty canvas tote, holds up to 30 lbs.',                                         price: 8.00,               rating: 4.3, reviewCount: 9,  shopId: harborGeneral.id,     categorySlug: 'general'  },
      { id: 'eeee0002-eeee-eeee-eeee-eeeeeeeeeeee', name: 'Soy Candle, Set of 2',        description: 'Hand-poured soy candles in cedar and sea salt scents.',                               price: 16.00,              rating: 4.6, reviewCount: 14, shopId: harborGeneral.id,     categorySlug: 'general'  },
      // Maple Diner
      { id: 'ffff0001-ffff-ffff-ffff-ffffffffffff', name: 'Family Meal Combo',            description: 'Serves 4 - choice of two entrees, two sides, and dessert.',                          price: 28.00,              rating: 4.7, reviewCount: 41, shopId: mapleDiner.id,        categorySlug: 'dining'   },
      { id: 'ffff0002-ffff-ffff-ffff-ffffffffffff', name: 'Classic Breakfast Platter',    description: 'Two eggs any style, hash browns, toast, and choice of meat.',                        price: 11.50,              rating: 4.5, reviewCount: 37, shopId: mapleDiner.id,        categorySlug: 'dining'   },
      // Happy Fresh Market (dev owner shop)
      { id: 'gggg0001-gggg-gggg-gggg-gggggggggggg', name: 'Organic Strawberries, 1 lb', description: 'Sun-ripened organic strawberries from local farms. No pesticides.',                   price: 5.99,               rating: 4.8, reviewCount: 17, shopId: happyFreshMarket.id,  categorySlug: 'groceries' },
      { id: 'gggg0002-gggg-gggg-gggg-gggggggggggg', name: 'Artisan Sourdough Bread',    description: 'Stone-milled flour, 24-hour ferment. Perfect crust every time.',                     price: 7.50, compareAtPrice: 9.00, rating: 4.9, reviewCount: 22, shopId: happyFreshMarket.id, categorySlug: 'groceries' },
      { id: 'gggg0003-gggg-gggg-gggg-gggggggggggg', name: 'Raw Honey, 12oz',            description: 'Unfiltered wildflower honey harvested from local apiaries.',                          price: 11.00,              rating: 4.7, reviewCount: 9,  shopId: happyFreshMarket.id,  categorySlug: 'groceries' },
      { id: 'gggg0004-gggg-gggg-gggg-gggggggggggg', name: 'Mixed Salad Greens, 5oz',    description: 'Pre-washed blend of arugula, spinach, and baby kale.',                               price: 3.49,               rating: 4.5, reviewCount: 11, shopId: happyFreshMarket.id,  categorySlug: 'groceries' },
    ],
  });
  console.log('Products seeded');

  // --- Orders ---
  const order1 = await prisma.order.upsert({
    where: { id: 'HS-10501' },
    update: {},
    create: {
      id:          'HS-10501',
      shopId:      cornerMarket.id,
      customerId:  customer.id,
      subtotal:    16.27,
      deliveryFee: 1.99,
      tax:         1.46,
      total:       19.72,
      status:      OrderStatus.DELIVERED,
      method:      OrderMethod.DELIVERY,
      address:     '42 Maple Lane, Springfield',
      etaMinutes:  30,
      placedAt:    new Date('2024-07-10T10:30:00Z'),
    },
  });

  await prisma.orderLineItem.createMany({
    skipDuplicates: true,
    data: [
      { orderId: order1.id, productId: 'aaaa0003-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Cage-Free Eggs, Dozen',     price: 5.49, quantity: 1             },
      { orderId: order1.id, productId: 'aaaa0001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Organic Whole Milk, 1 Gal', price: 4.29, quantity: 2, unit: 'gal' },
      { orderId: order1.id, productId: 'aaaa0004-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Avocados, 4-pack',          price: 6.50, quantity: 1             },
    ],
  });

  const order2 = await prisma.order.upsert({
    where: { id: 'HS-10502' },
    update: {},
    create: {
      id:          'HS-10502',
      shopId:      riveraBakery.id,
      customerId:  customer.id,
      subtotal:    13.70,
      deliveryFee: 0,
      tax:         1.23,
      total:       14.93,
      status:      OrderStatus.OUT_FOR_DELIVERY,
      method:      OrderMethod.PICKUP,
      etaMinutes:  15,
      placedAt:    new Date(),
    },
  });

  await prisma.orderLineItem.createMany({
    skipDuplicates: true,
    data: [
      { orderId: order2.id, productId: 'bbbb0001-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Sourdough Loaf', price: 6.50, quantity: 1 },
      { orderId: order2.id, productId: 'bbbb0003-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Cinnamon Roll',  price: 3.75, quantity: 2 },
    ],
  });

  // Dev customer order from Happy Fresh Market
  const order3 = await prisma.order.upsert({
    where: { id: 'HS-10503' },
    update: {},
    create: {
      id:          'HS-10503',
      shopId:      happyFreshMarket.id,
      customerId:  devCustomer.id,
      subtotal:    24.98,
      deliveryFee: 2.50,
      tax:         2.25,
      total:       29.73,
      status:      OrderStatus.PREPARING,
      method:      OrderMethod.DELIVERY,
      address:     '14 Birchwood Ave, Springfield',
      etaMinutes:  40,
      placedAt:    new Date(),
    },
  });

  await prisma.orderLineItem.createMany({
    skipDuplicates: true,
    data: [
      { orderId: order3.id, productId: 'gggg0001-gggg-gggg-gggg-gggggggggggg', name: 'Organic Strawberries, 1 lb', price: 5.99,  quantity: 2 },
      { orderId: order3.id, productId: 'gggg0002-gggg-gggg-gggg-gggggggggggg', name: 'Artisan Sourdough Bread',    price: 7.50,  quantity: 1 },
      { orderId: order3.id, productId: 'gggg0003-gggg-gggg-gggg-gggggggggggg', name: 'Raw Honey, 12oz',            price: 11.00, quantity: 1 },
    ],
  });

  console.log('Orders seeded');

  // --- Reviews ---
  await prisma.review.createMany({
    skipDuplicates: true,
    data: [
      // Shop reviews
      {
        id:             'rev00001-0000-0000-0000-000000000001',
        shopId:         cornerMarket.id,
        authorId:       customer.id,
        authorName:     'Alex Morgan',
        authorInitials: 'AM',
        rating:         5,
        comment:        'Best neighborhood grocery store I have found. Always fresh produce and the staff is incredibly friendly. The organic section is excellent.',
        date:           new Date('2024-07-08T09:00:00Z'),
      },
      {
        id:             'rev00001-0000-0000-0000-000000000002',
        shopId:         cornerMarket.id,
        authorId:       devCustomer.id,
        authorName:     'Dev Customer',
        authorInitials: 'DC',
        rating:         4,
        comment:        'Great selection and fair prices. Could use more variety in the international foods aisle, but overall a solid go-to for weekly shopping.',
        date:           new Date('2024-07-15T14:30:00Z'),
      },
      {
        id:             'rev00001-0000-0000-0000-000000000003',
        shopId:         riveraBakery.id,
        authorId:       customer.id,
        authorName:     'Alex Morgan',
        authorInitials: 'AM',
        rating:         5,
        comment:        'The sourdough here is absolutely life-changing. I drive 20 minutes out of my way just to pick one up every Tuesday. Worth every penny.',
        reply:          'Thank you so much, Alex! We put a lot of love into every loaf. See you Tuesday!',
        date:           new Date('2024-07-12T08:00:00Z'),
      },
      {
        id:             'rev00001-0000-0000-0000-000000000004',
        shopId:         happyFreshMarket.id,
        authorId:       devCustomer.id,
        authorName:     'Dev Customer',
        authorInitials: 'DC',
        rating:         5,
        comment:        'Happy Fresh Market is a hidden gem. The strawberries were incredibly sweet and the sourdough bread is top-notch. Will definitely be back.',
        reply:          'We are so glad you enjoyed it! We source everything locally - freshness is our promise.',
        date:           new Date('2024-07-18T11:00:00Z'),
      },
      // Product reviews
      {
        id:             'rev00001-0000-0000-0000-000000000005',
        productId:      'bbbb0001-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        authorId:       customer.id,
        authorName:     'Alex Morgan',
        authorInitials: 'AM',
        rating:         5,
        comment:        'Perfectly sour, beautifully open crumb. This is the best sourdough I have had outside of San Francisco. Highly recommend.',
        date:           new Date('2024-07-13T10:00:00Z'),
      },
      {
        id:             'rev00001-0000-0000-0000-000000000006',
        productId:      'aaaa0003-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        authorId:       devCustomer.id,
        authorName:     'Dev Customer',
        authorInitials: 'DC',
        rating:         4,
        comment:        'Good quality cage-free eggs. Yolks are very orange and rich - you can tell these hens are well-fed. Great for baking and cooking.',
        date:           new Date('2024-07-11T07:30:00Z'),
      },
    ],
  });
  console.log('Reviews seeded');

  // --- Conversations + Messages ---
  const conv1 = await prisma.conversation.upsert({
    where: { id: 'conv0001-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id:         'conv0001-0000-0000-0000-000000000001',
      shopId:     cornerMarket.id,
      customerId: customer.id,
      createdAt:  new Date('2024-07-10T09:00:00Z'),
      updatedAt:  new Date('2024-07-10T09:18:00Z'),
    },
  });

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      {
        id:             'msg00001-0000-0000-0000-000000000001',
        conversationId: conv1.id,
        senderId:       customer.id,
        fromShop:       false,
        text:           'Hi! Do you carry oat milk? I did not see it on the app.',
        createdAt:      new Date('2024-07-10T09:00:00Z'),
      },
      {
        id:             'msg00001-0000-0000-0000-000000000002',
        conversationId: conv1.id,
        senderId:       shopOwner1.id,
        fromShop:       true,
        text:           'Hey Alex! Yes, we carry Oatly and Minor Figures. They are in the refrigerated aisle, bottom shelf. We will add them to the app listing soon!',
        createdAt:      new Date('2024-07-10T09:06:00Z'),
      },
      {
        id:             'msg00001-0000-0000-0000-000000000003',
        conversationId: conv1.id,
        senderId:       customer.id,
        fromShop:       false,
        text:           'Perfect, thanks! I will stop by this afternoon.',
        createdAt:      new Date('2024-07-10T09:18:00Z'),
      },
    ],
  });

  const conv2 = await prisma.conversation.upsert({
    where: { id: 'conv0001-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id:         'conv0001-0000-0000-0000-000000000002',
      shopId:     happyFreshMarket.id,
      customerId: devCustomer.id,
      createdAt:  new Date('2024-07-18T10:00:00Z'),
      updatedAt:  new Date('2024-07-18T10:25:00Z'),
    },
  });

  await prisma.message.createMany({
    skipDuplicates: true,
    data: [
      {
        id:             'msg00001-0000-0000-0000-000000000004',
        conversationId: conv2.id,
        senderId:       devCustomer.id,
        fromShop:       false,
        text:           'Hi, I placed order HS-10503. Is it possible to add a 4th item - the mixed salad greens - to the same order?',
        createdAt:      new Date('2024-07-18T10:00:00Z'),
      },
      {
        id:             'msg00001-0000-0000-0000-000000000005',
        conversationId: conv2.id,
        senderId:       devOwner.id,
        fromShop:       true,
        text:           'Hi! Absolutely, we can add that for you. Your order has been updated - the salad greens are now included at $3.49. New total is $33.22.',
        createdAt:      new Date('2024-07-18T10:10:00Z'),
      },
      {
        id:             'msg00001-0000-0000-0000-000000000006',
        conversationId: conv2.id,
        senderId:       devCustomer.id,
        fromShop:       false,
        text:           'That is amazing, thank you! You guys are the best.',
        createdAt:      new Date('2024-07-18T10:15:00Z'),
      },
      {
        id:             'msg00001-0000-0000-0000-000000000007',
        conversationId: conv2.id,
        senderId:       devOwner.id,
        fromShop:       true,
        text:           'Our pleasure! Your order will be ready in about 35 minutes. We will send a notification when it is on its way.',
        createdAt:      new Date('2024-07-18T10:25:00Z'),
      },
    ],
  });
  console.log('Conversations and Messages seeded');

  // --- Notifications ---
  await prisma.notification.createMany({
    skipDuplicates: true,
    data: [
      // Existing customer (Alex Morgan)
      { userId: customer.id,    title: 'Order Delivered!',        description: 'Your order HS-10501 from Corner Market has been delivered. Enjoy!',                       tone: NotificationTone.SUCCESS, read: true  },
      { userId: customer.id,    title: 'Order On The Way',         description: 'Your order HS-10502 from Rivera Bakery is on the way. ETA 15 min.',                       tone: NotificationTone.INFO,    read: false },
      // Dev customer
      { userId: devCustomer.id, title: 'Order Confirmed!',         description: 'Your order HS-10503 from Happy Fresh Market has been confirmed and is being prepared.',    tone: NotificationTone.SUCCESS, read: false },
      { userId: devCustomer.id, title: 'New Message',              description: 'Happy Fresh Market replied to your message about order HS-10503.',                         tone: NotificationTone.INFO,    read: false },
      { userId: devCustomer.id, title: 'Welcome to Happy Store!',  description: 'Discover local shops and businesses near you. Start exploring now.',                       tone: NotificationTone.ACCENT,  read: true  },
      // Shop owners
      { userId: shopOwner1.id,  title: 'New Order Received',       description: 'You have a new order #HS-10504 for $32.10. Tap to view details.',                         tone: NotificationTone.ACCENT,  read: false },
      { userId: devOwner.id,    title: 'New Order Received',       description: 'Order #HS-10503 placed by Dev Customer for $29.73. Please prepare within 40 min.',        tone: NotificationTone.ACCENT,  read: false },
      { userId: devOwner.id,    title: 'New Review Posted',        description: 'Dev Customer left a 5-star review for Happy Fresh Market. Check it out!',                 tone: NotificationTone.SUCCESS, read: false },
      { userId: devOwner.id,    title: 'Weekly Payout Processed',  description: 'Your weekly payout of $284.50 has been sent to your bank account.',                      tone: NotificationTone.INFO,    read: true  },
      { userId: devOwner.id,    title: 'Shop Approved',            description: 'Happy Fresh Market has been approved and is now live on the Happy Store platform.',       tone: NotificationTone.SUCCESS, read: true  },
      // Admin
      { userId: adminUser.id,   title: 'New Shop Registration',    description: 'Happy Fresh Market has been submitted for approval. Please review.',                      tone: NotificationTone.INFO,    read: true  },
      { userId: devAdmin.id,    title: 'System Health Alert',      description: 'Database replication lag detected on replica-2. Current lag: 1.2s. Monitoring closely.', tone: NotificationTone.WARNING, read: false },
      { userId: devAdmin.id,    title: 'New User Registrations',   description: '14 new users registered in the last 24 hours. Platform growing steadily.',               tone: NotificationTone.SUCCESS, read: false },
      { userId: devAdmin.id,    title: 'Platform Revenue Update',  description: 'July platform revenue is tracking 18% above forecast. Strong month.',                    tone: NotificationTone.INFO,    read: true  },
    ],
  });
  console.log('Notifications seeded');

  // --- Transactions ---
  await prisma.transaction.createMany({
    skipDuplicates: true,
    data: [
      { shopId: cornerMarket.id,     description: 'Order #HS-10490', type: TransactionType.SALE,   amount:    42.30 },
      { shopId: cornerMarket.id,     description: 'Weekly Payout',   type: TransactionType.PAYOUT, amount:  -280.00 },
      { shopId: riveraBakery.id,     description: 'Order #HS-10501', type: TransactionType.SALE,   amount:    19.72 },
      { shopId: riveraBakery.id,     description: 'Platform Fee',    type: TransactionType.FEE,    amount:    -2.50 },
      { shopId: happyFreshMarket.id, description: 'Order #HS-10503', type: TransactionType.SALE,   amount:    29.73 },
      { shopId: happyFreshMarket.id, description: 'Platform Fee',    type: TransactionType.FEE,    amount:    -2.97 },
      { shopId: happyFreshMarket.id, description: 'Weekly Payout',   type: TransactionType.PAYOUT, amount:  -284.50 },
    ],
  });
  console.log('Transactions seeded');

  // --- Summary ---
  console.log('\nSeed complete!\n');
  console.log('-- Existing Accounts --');
  console.log('  Admin:       admin@happystore.com            / Password123!');
  console.log('  Shop Owner:  owner.rivera@happystore.com     / Password123!');
  console.log('  Customer:    alex.morgan@email.com            / Password123!');
  console.log('');
  console.log('-- Dev Test Accounts (development only) --');
  console.log('  Admin:       admin@happystore.local           / HappyStore_Admin@2026');
  console.log('  Shop Owner:  owner@happystore.local           / HappyStore_Owner@2026    (shop: Happy Fresh Market)');
  console.log('  Customer:    customer@happystore.local         / HappyStore_Customer@2026');
  console.log('');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
