const products = [
  { id: "sf-001", name: "SG Savage Edition Cricket Bat", category: "bats", brand: "SG", price: 149.99, originalPrice: 199.99, discount: 25, rating: 4.8, reviewCount: 128, image: "assets/images/product-bat.svg", images: ["assets/images/product-bat.svg"], tags: ["bestseller", "english-willow"], stock: 12, description: "Professional-grade English Willow bat precision-crafted for power hitters. Premium grade A willow with balanced pick-up.", sizes: ["Short Handle", "Long Handle"] },
  { id: "sf-002", name: "Gray-Nicolls Kaboom Bat", category: "bats", brand: "Gray-Nicolls", price: 179.99, originalPrice: 229.99, discount: 22, rating: 4.9, reviewCount: 96, image: "assets/images/product-bat.svg", images: ["assets/images/product-bat.svg"], tags: ["pro-grade"], stock: 8, description: "The Kaboom delivers explosive power with its thick edge profile. Hand-crafted from prime English Willow.", sizes: ["Short Handle", "Long Handle"] },
  { id: "sf-003", name: "SS Premium Leather Ball", category: "balls", brand: "SS", price: 19.99, originalPrice: 24.99, discount: 20, rating: 4.6, reviewCount: 214, image: "assets/images/product-ball.svg", images: ["assets/images/product-ball.svg"], tags: ["match-ready"], stock: 45, description: "Premium quality leather cricket ball with hand-stitched seam for professional match play. 4-piece construction.", sizes: [] },
  { id: "sf-004", name: "MRF Pro Edition Batting Gloves", category: "gloves", brand: "MRF", price: 59.99, originalPrice: 79.99, discount: 25, rating: 4.7, reviewCount: 88, image: "assets/images/product-gloves.svg", images: ["assets/images/product-gloves.svg"], tags: ["protective"], stock: 20, description: "Professional batting gloves with premium sheep leather palm and high-density foam protection.", sizes: ["S", "M", "L", "XL"] },
  { id: "sf-005", name: "DSC Warrior Knee Pads", category: "pads", brand: "DSC", price: 44.99, originalPrice: 0, discount: 0, rating: 4.5, reviewCount: 67, image: "assets/images/product-pads.svg", images: ["assets/images/product-pads.svg"], tags: ["new-arrival"], stock: 30, description: "Lightweight knee pads with anatomical fit and reinforced impact zones for complete protection.", sizes: ["S", "M", "L"] },
  { id: "sf-006", name: "Kookaburra Helmet Pro", category: "helmets", brand: "Kookaburra", price: 89.99, originalPrice: 119.99, discount: 25, rating: 4.9, reviewCount: 156, image: "assets/images/product-helmet.svg", images: ["assets/images/product-helmet.svg"], tags: ["bestseller", "safety"], stock: 15, description: "Premium cricket helmet with titanium grill, impact-absorbing foam, and ventilation system.", sizes: ["S", "M", "L", "XL"] },
  { id: "sf-007", name: "SG Century Cricket Shoes", category: "shoes", brand: "SG", price: 119.99, originalPrice: 149.99, discount: 20, rating: 4.6, reviewCount: 92, image: "assets/images/product-shoes.svg", images: ["assets/images/product-shoes.svg"], tags: ["footwear"], stock: 22, description: "Professional cricket shoes with spike system, breathable mesh upper, and cushioned sole for all-day comfort.", sizes: ["7", "8", "9", "10", "11"] },
  { id: "sf-008", name: "Elite Cricket Kit Bag Pro", category: "bags", brand: "Gray-Nicolls", price: 139.99, originalPrice: 0, discount: 0, rating: 4.8, reviewCount: 73, image: "assets/images/product-bag.svg", images: ["assets/images/product-bag.svg"], tags: ["new-arrival"], stock: 10, description: "Spacious cricket kit bag with multiple compartments, waterproof base, and padded shoulder strap.", sizes: [] },
  { id: "sf-009", name: "Cricket Sunglasses Polarized", category: "accessories", brand: "SS", price: 34.99, originalPrice: 49.99, discount: 30, rating: 4.4, reviewCount: 48, image: "assets/images/product-eyewear.svg", images: ["assets/images/product-eyewear.svg"], tags: ["eyewear"], stock: 35, description: "Polarized cricket sunglasses with UV400 protection and lightweight TR90 frame for maximum clarity.", sizes: [] },
  { id: "sf-010", name: "Performance Cricket Jersey", category: "apparel", brand: "MRF", price: 49.99, originalPrice: 64.99, discount: 23, rating: 4.3, reviewCount: 135, image: "assets/images/product-jersey.svg", images: ["assets/images/product-jersey.svg"], tags: ["jersey"], stock: 50, description: "Moisture-wicking performance jersey with breathable fabric paneling for maximum comfort during play.", sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: "sf-011", name: "DSC Practice Cricket Net", category: "accessories", brand: "DSC", price: 79.99, originalPrice: 0, discount: 0, rating: 4.2, reviewCount: 34, image: "assets/images/product-net.svg", images: ["assets/images/product-net.svg"], tags: ["practice"], stock: 8, description: "Heavy-duty practice net with reinforced knots, weather-resistant nylon, and easy setup system.", sizes: [] },
  { id: "sf-012", name: "SG Tour Edition Batting Pads", category: "pads", brand: "SG", price: 69.99, originalPrice: 89.99, discount: 22, rating: 4.7, reviewCount: 81, image: "assets/images/product-pads.svg", images: ["assets/images/product-pads.svg"], tags: ["protective"], stock: 18, description: "Tour-grade batting pads with cane and high-density foam construction for superior protection and mobility.", sizes: ["S", "M", "L", "XL"] },
  { id: "sf-013", name: "Kookaburra Turf White Ball", category: "balls", brand: "Kookaburra", price: 22.99, originalPrice: 0, discount: 0, rating: 4.8, reviewCount: 201, image: "assets/images/product-ball.svg", images: ["assets/images/product-ball.svg"], tags: ["match-ready", "bestseller"], stock: 60, description: "Official turf white ball used in premier competitions. Hand-crafted with premium 4-piece leather construction.", sizes: [] },
  { id: "sf-014", name: "Cricket Abdominal Guard", category: "protective", brand: "SS", price: 29.99, originalPrice: 39.99, discount: 25, rating: 4.4, reviewCount: 56, image: "assets/images/product-guard.svg", images: ["assets/images/product-guard.svg"], tags: ["protective"], stock: 40, description: "Lightweight abdominal guard with ergonomic shape and high-impact absorption technology.", sizes: ["S", "M", "L"] },
  { id: "sf-015", name: "Cricket Training Bat (Set of 2)", category: "bats", brand: "MRF", price: 39.99, originalPrice: 0, discount: 0, rating: 4.1, reviewCount: 42, image: "assets/images/product-bat.svg", images: ["assets/images/product-bat.svg"], tags: ["training"], stock: 25, description: "Lightweight training bat set perfect for drills and practice sessions. Includes 2 bats with grip.", sizes: ["Short Handle"] },
];

const categories = [
  { id: "all", name: "All Products" },
  { id: "bats", name: "Bats" },
  { id: "balls", name: "Balls" },
  { id: "gloves", name: "Gloves" },
  { id: "pads", name: "Pads" },
  { id: "helmets", name: "Helmets" },
  { id: "shoes", name: "Shoes" },
  { id: "bags", name: "Bags" },
  { id: "accessories", name: "Accessories" },
  { id: "apparel", name: "Apparel" },
  { id: "protective", name: "Protective" },
];

const brands = ["SG", "SS", "MRF", "DSC", "Kookaburra", "Gray-Nicolls"];

const testimonials = [
  { id: 1, name: "Rahul Sharma", role: "Club Cricketer, Mumbai", avatar: "RS", rating: 5, review: "Best cricket gear I've ever bought. Quality is truly unmatched! The bat feels like an extension of my arm." },
  { id: 2, name: "Priya Mehta", role: "Academy Coach, Delhi", avatar: "PM", rating: 5, review: "Sports Folio Store is my go-to for team equipment. Always premium quality and fast delivery. Highly recommended!" },
  { id: 3, name: "Arjun Singh", role: "State-level Player, Punjab", avatar: "AS", rating: 4, review: "The protective gear is top-notch. I've been using their pads for two seasons now, still as good as new." },
  { id: 4, name: "Vikram Patel", role: "Weekend Warrior, Ahmedabad", avatar: "VP", rating: 5, review: "Finally a store that understands what cricketers need. The bat selection is incredible and the prices are fair." },
  { id: 5, name: "Sneha Reddy", role: "Women's Team Captain, Hyderabad", avatar: "SR", rating: 5, review: "Outstanding quality and excellent customer service. They helped me find the perfect bat for my playing style." },
  { id: 6, name: "Amit Kumar", role: "U-19 Coach, Patna", avatar: "AK", rating: 4, review: "I've ordered multiple times for my academy. Consistent quality, great discounts on bulk orders. A reliable partner." },
  { id: 7, name: "Rohit Desai", role: "Tennis Ball Cricketer, Surat", avatar: "RD", rating: 5, review: "The gear quality is next level. My batting average has gone up since switching to Sports Folio equipment!" },
  { id: 8, name: "Kavita Joshi", role: "Parent of Jr. Cricketer, Pune", avatar: "KJ", rating: 5, review: "My son loves his new kit! The size guide was spot on and the quality gives me peace of mind about his safety." },
];

const promoCodes = {
  "WELCOME10": { discount: 10, type: "percent", description: "10% off your first order" },
  "CRICKET20": { discount: 20, type: "percent", description: "20% off cricketing gear" },
  "FREESHIP": { discount: 0, type: "freeshipping", description: "Free shipping on your order" },
  "SPORTS50": { discount: 50, type: "flat", description: "$50 off orders above $200" },
};
