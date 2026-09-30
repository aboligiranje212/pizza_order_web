// Mock Pizza Database with Original Branding

export const SIZES = [
  { id: 'regular', name: 'Regular (Classic 8")', priceMultiplier: 1.0, description: 'Serves 1' },
  { id: 'medium', name: 'Medium (Sharing 10")', priceMultiplier: 1.5, description: 'Serves 2' },
  { id: 'large', name: 'Large (Party 12")', priceMultiplier: 2.1, description: 'Serves 3-4' }
];

export const CRUSTS = [
  { id: 'classic', name: 'New Hand Tossed', extraPrice: 0, description: 'Crispy on the outside, soft on the inside' },
  { id: 'wheat', name: 'Wheat Thin Crust', extraPrice: 1.50, description: 'Light, crispy and nutritious' },
  { id: 'cheese-burst', name: 'Liquid Cheese Burst', extraPrice: 2.99, description: 'Loaded with rich liquid cheese inside the crust' },
  { id: 'pan', name: 'Fresh Pan Crust', extraPrice: 1.99, description: 'Thick, buttery and baked to golden perfection' }
];

export const TOPPINGS = [
  { id: 'extra-cheese', name: 'Extra Mozzarella', price: 1.49, type: 'veg' },
  { id: 'mushrooms', name: 'Button Mushrooms', price: 0.99, type: 'veg' },
  { id: 'olives', name: 'Black Olives', price: 0.89, type: 'veg' },
  { id: 'jalapenos', name: 'Pickled Jalapeños', price: 0.89, type: 'veg' },
  { id: 'onions', name: 'Red Onions', price: 0.79, type: 'veg' },
  { id: 'peppers', name: 'Bell Peppers', price: 0.79, type: 'veg' },
  { id: 'sweet-corn', name: 'Sweet Corn', price: 0.79, type: 'veg' },
  { id: 'pepperoni', name: 'Premium Pepperoni', price: 1.99, type: 'non-veg' },
  { id: 'chicken-sausage', name: 'Spicy Chicken Sausage', price: 1.79, type: 'non-veg' },
  { id: 'smoked-chicken', name: 'Smoked Chicken Chunks', price: 1.79, type: 'non-veg' }
];

export const PIZZAS = [
  {
    id: 'p1',
    name: 'Margherita Classic',
    category: 'veg',
    description: 'A timeless Italian masterpiece with organic tomato sauce, premium mozzarella, and fresh basil oil drizzle.',
    basePrice: 9.99,
    rating: 4.8,
    reviewsCount: 142,
    isPopular: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
    ],
    nutrition: { calories: '250 kcal/slice', protein: '11g', carbs: '28g', fat: '9g' },
    ingredients: ['Fresh Mozzarella', 'Classic Marinara', 'Basil Infused Oil', 'Extra Virgin Olive Oil', 'Parmigiano']
  },
  {
    id: 'p2',
    name: 'Garden Harvest Supreme',
    category: 'veg',
    description: 'Rich combination of crispy bell peppers, red onions, sweet corn, button mushrooms, and black olives.',
    basePrice: 12.99,
    rating: 4.7,
    reviewsCount: 88,
    isPopular: false,
    isVeg: true,
    image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg',
    images: [
      'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg'
    ],
    nutrition: { calories: '235 kcal/slice', protein: '9g', carbs: '31g', fat: '8g' },
    ingredients: ['Bell Peppers', 'Red Onion', 'Button Mushroom', 'Sweet Corn', 'Black Olives', 'Mozzarella', 'Oregano Crust']
  },
  {
    id: 'p3',
    name: 'Double Cheesy Truffle',
    category: 'veg',
    description: 'Indulgent layer of signature white truffle oil, double gooey mozzarella, sharp white cheddar, and garlic bits.',
    basePrice: 14.99,
    rating: 4.9,
    reviewsCount: 215,
    isPopular: true,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80'
    ],
    nutrition: { calories: '290 kcal/slice', protein: '14g', carbs: '26g', fat: '14g' },
    ingredients: ['White Truffle Oil', 'Mozzarella', 'Cheddar Cheese', 'Roasted Garlic', 'Cream Cheese Base']
  },
  {
    id: 'p4',
    name: 'Spicy Paneer Tikka',
    category: 'veg',
    description: 'Golden roasted paneer cubes marinated in yogurt spices, sprinkled with green chillies, onions, and capsicum.',
    basePrice: 13.49,
    rating: 4.6,
    reviewsCount: 76,
    isPopular: false,
    isVeg: true,
    image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg',
    images: [
      'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg'
    ],
    nutrition: { calories: '275 kcal/slice', protein: '13g', carbs: '29g', fat: '11g' },
    ingredients: ['Tandoori Paneer', 'Green Chillies', 'Capsicum', 'Red Onions', 'Mint Chutney Drizzle', 'Mozzarella']
  },
  {
    id: 'p5',
    name: 'Pesto Paradise',
    category: 'veg',
    description: 'Herbaceous basil pesto cream base topped with sweet sun-dried tomatoes, baby spinach, feta cheese crumbles, and pine nuts.',
    basePrice: 13.99,
    rating: 4.7,
    reviewsCount: 54,
    isPopular: false,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1474600056930-615c3d706456?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1474600056930-615c3d706456?auto=format&fit=crop&w=800&q=80'
    ],
    nutrition: { calories: '260 kcal/slice', protein: '10g', carbs: '27g', fat: '12g' },
    ingredients: ['Basil Pesto', 'Sun-dried Tomatoes', 'Baby Spinach', 'Feta Cheese', 'Pine Nuts', 'Mozzarella']
  },
  {
    id: 'p6',
    name: 'Fiery Pepper Chicken',
    category: 'non-veg',
    description: 'Spicy shredded chicken chunks, fiery red paprika flakes, green bell peppers, and jalapeños on a hot chili marinara.',
    basePrice: 13.99,
    rating: 4.8,
    reviewsCount: 189,
    isPopular: true,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
    ],
    nutrition: { calories: '280 kcal/slice', protein: '16g', carbs: '28g', fat: '10g' },
    ingredients: ['Spicy Chicken Chunks', 'Red Paprika', 'Pickled Jalapeños', 'Green Peppers', 'Spicy Tomato Sauce', 'Mozzarella']
  },
  {
    id: 'p7',
    name: 'Smoked Chicken BBQ',
    category: 'non-veg',
    description: 'Hickory smoked roasted chicken, sweet caramelized red onions, fresh cilantro, and a premium BBQ sauce drizzle.',
    basePrice: 14.49,
    rating: 4.7,
    reviewsCount: 92,
    isPopular: false,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80'
    ],
    nutrition: { calories: '270 kcal/slice', protein: '15g', carbs: '32g', fat: '8g' },
    ingredients: ['Hickory Smoked Chicken', 'Caramelized Onion', 'Sweet BBQ Sauce Drizzle', 'Cilantro', 'Mozzarella']
  },
  {
    id: 'p8',
    name: 'Meat Lovers Feast',
    category: 'non-veg',
    description: 'The ultimate carnivore combo: crispy beef pepperoni, spicy Italian sausage, and smoked chicken ham on a herb-crusted dough.',
    basePrice: 15.99,
    rating: 4.9,
    reviewsCount: 310,
    isPopular: true,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80'
    ],
    nutrition: { calories: '315 kcal/slice', protein: '18g', carbs: '27g', fat: '15g' },
    ingredients: ['Beef Pepperoni', 'Italian Chicken Sausage', 'Smoked Chicken Ham', 'Marinara', 'Mozzarella', 'Parmesan']
  },
  {
    id: 'p9',
    name: 'Chicken Tikka Delight',
    category: 'non-veg',
    description: 'Juicy spiced clay oven chicken tikka bites, capsicum, red onions, fresh coriander, and mint-mayo spirals.',
    basePrice: 13.99,
    rating: 4.6,
    reviewsCount: 65,
    isPopular: false,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
    ],
    nutrition: { calories: '285 kcal/slice', protein: '15g', carbs: '30g', fat: '10g' },
    ingredients: ['Chicken Tikka', 'Green Peppers', 'Red Onion', 'Mint Mayo Drizzle', 'Mozzarella', 'Spicy Marinara']
  },
  {
    id: 'p10',
    name: 'Pepperoni Obsession',
    category: 'non-veg',
    description: 'Classic double pepperoni slices loaded from edge to edge with a blanket of premium bubbling mozzarella cheese.',
    basePrice: 14.99,
    rating: 4.9,
    reviewsCount: 420,
    isPopular: true,
    isVeg: false,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80'
    ],
    nutrition: { calories: '310 kcal/slice', protein: '16g', carbs: '26g', fat: '14g' },
    ingredients: ['Double Beef Pepperoni', 'Premium Mozzarella', 'Classic Tomato Sauce', 'Italian Seasoning']
  },
  
  // Sides
  {
    id: 's1',
    name: 'Garlic Bread Stix',
    category: 'sides',
    description: 'Freshly baked buttery breadsticks infused with garlic seasoning, served with a creamy cheese dip.',
    basePrice: 4.99,
    rating: 4.6,
    reviewsCount: 95,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80',
    nutrition: { calories: '180 kcal/piece', protein: '4g', carbs: '22g', fat: '8g' },
    ingredients: ['Baked Dough', 'Garlic Butter Spread', 'Parsley', 'Oregano']
  },
  {
    id: 's2',
    name: 'Stuffed Cheesy Pockets',
    category: 'sides',
    description: 'Crispy golden parcels stuffed with gooey liquid cheese, jalapeño bits, and sweet corn kernels.',
    basePrice: 5.99,
    rating: 4.7,
    reviewsCount: 110,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80',
    nutrition: { calories: '210 kcal/piece', protein: '6g', carbs: '24g', fat: '9g' },
    ingredients: ['Cheddar Cheese filling', 'Jalapeño slices', 'Golden Corn', 'Bread Crumbs Coating']
  },
  
  // Drinks
  {
    id: 'd1',
    name: 'Zesty Lemon Fizz',
    category: 'drinks',
    description: 'Sparkling lemon beverage with mint extracts and a pinch of black salt to quench your thirst.',
    basePrice: 2.49,
    rating: 4.4,
    reviewsCount: 30,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    nutrition: { calories: '90 kcal', protein: '0g', carbs: '22g', fat: '0g' },
    ingredients: ['Carbonated Water', 'Lemon Juice Concentrate', 'Mint Extract', 'Cane Sugar']
  },
  {
    id: 'd2',
    name: 'Classic Cola',
    category: 'drinks',
    description: 'Ice-cold bubbly carbonated cola, the perfect companion for your hot slices.',
    basePrice: 1.99,
    rating: 4.8,
    reviewsCount: 430,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    nutrition: { calories: '140 kcal', protein: '0g', carbs: '35g', fat: '0g' },
    ingredients: ['Carbonated Water', 'Cola Extract', 'Caramel Color', 'Sugar']
  },
  
  // Desserts
  {
    id: 'de1',
    name: 'Choco Lava Cake',
    category: 'desserts',
    description: 'Indulgent, warm chocolate cake with a rich molten chocolate center that bursts open with your first spoonful.',
    basePrice: 4.49,
    rating: 4.9,
    reviewsCount: 520,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    nutrition: { calories: '350 kcal', protein: '5g', carbs: '45g', fat: '16g' },
    ingredients: ['Dark Chocolate', 'Butter', 'Wheat Flour', 'Cocoa Powder', 'Sugar']
  },
  {
    id: 'de2',
    name: 'Red Velvet Brownie',
    category: 'desserts',
    description: 'Chewy red velvet fudge brownie layers swirls with sweet premium cream cheese icing.',
    basePrice: 3.99,
    rating: 4.7,
    reviewsCount: 140,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=800&q=80',
    nutrition: { calories: '310 kcal', protein: '4g', carbs: '38g', fat: '15g' },
    ingredients: ['Red Velvet Batter', 'Cream Cheese Frosting', 'White Chocolate Chips', 'Vanilla Extract']
  }
];

export const DEALS = [
  {
    id: 'deal1',
    name: 'Gameday Feast Combo',
    description: 'Get 2 Medium Pizzas (Veg/Non-Veg) + 1 Garlic Bread Stix + 1 Bottle of Classic Cola.',
    price: 27.99,
    originalPrice: 38.45,
    saving: 'Save 27%',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    items: ['p1', 'p6', 's1', 'd2']
  },
  {
    id: 'deal2',
    name: 'Solo Delight',
    description: '1 Regular Pizza + 1 Zesty Lemon Fizz + 1 Warm Choco Lava Cake.',
    price: 13.99,
    originalPrice: 18.97,
    saving: 'Save 26%',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=800&q=80',
    items: ['p1', 'd1', 'de1']
  },
  {
    id: 'deal3',
    name: 'Double Cheeseburst Deal',
    description: 'Get any 2 Medium Pizzas upgraded to Liquid Cheese Burst for free!',
    price: 24.99,
    originalPrice: 35.96,
    saving: 'Upgrade Free',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    items: ['p3', 'p8']
  }
];

export const COUPONS = [
  { code: 'SLICECRAFT50', discountType: 'percentage', discountValue: 50, minOrder: 25.0, description: '50% off on your entire order. Min order $25.' },
  { code: 'CHEESY20', discountType: 'fixed', discountValue: 5.0, minOrder: 15.0, description: 'Flat $5 off on orders above $15.' },
  { code: 'FREESHIP', discountType: 'free-delivery', discountValue: 3.99, minOrder: 10.0, description: 'Free delivery on all orders above $10.' }
];

export const MOCK_REVIEWS = [
  { id: 'r1', name: 'Sophia R.', rating: 5, date: 'July 2, 2026', comment: 'The Cheese Burst crust is out of this world! Melted in my mouth instantly. Will order again.' },
  { id: 'r2', name: 'Alex M.', rating: 4, date: 'June 28, 2026', comment: 'Loved the Margherita. Sauce had a nice tangy kick, although it could use slightly more basil.' },
  { id: 'r3', name: 'Jordan K.', rating: 5, date: 'June 25, 2026', comment: 'Super fast delivery! Pizza arrived piping hot and the crust was perfectly crisp.' }
];
