// ============================================================
//  GITAM Food Hub Pro — ULTRA PRO MAX DATA ENGINE
//  Full Swiggy + Zomato level dataset
// ============================================================

const APP_DATA = {

  // ---- CURRENT USER SESSION ----
  currentUser: JSON.parse(localStorage.getItem('fhp_user')) || null,
  
  // ---- COUPONS ----
  coupons: {
    'SAVE50':   { discount: 50, type: 'flat',    minOrder: 199, desc: '₹50 off on orders above ₹199' },
    'FREEDEL':  { discount: 100, type: 'flat',   minOrder: 149, desc: 'Free delivery on orders above ₹149' },
    'GITAM20':  { discount: 20, type: 'percent', minOrder: 299, desc: '20% off up to ₹100 on orders ₹299+' },
    'NEWUSER':  { discount: 60, type: 'flat',    minOrder: 0,   desc: '₹60 off on your first order!' },
    'WEEKEND':  { discount: 15, type: 'percent', minOrder: 249, desc: '15% off this weekend only!' },
  },

  // ---- CATEGORIES ----
  categories: [
    { id: 'biryani',    icon: '🍚', label: 'Biryani' },
    { id: 'pizza',      icon: '🍕', label: 'Pizza' },
    { id: 'burger',     icon: '🍔', label: 'Burger' },
    { id: 'dosa',       icon: '🥞', label: 'Dosa' },
    { id: 'chinese',    icon: '🍜', label: 'Chinese' },
    { id: 'desserts',   icon: '🍰', label: 'Desserts' },
    { id: 'beverages',  icon: '🧃', label: 'Drinks' },
    { id: 'thali',      icon: '🍽️', label: 'Thali' },
    { id: 'snacks',     icon: '🥨', label: 'Snacks' },
    { id: 'seafood',    icon: '🦞', label: 'Seafood' },
  ],

  // ---- TRENDING SEARCHES ----
  trendingSearches: ['Chicken Biryani', 'Masala Dosa', 'Paneer Pizza', 'Momos', 'Cold Coffee', 'Shawarma'],

  // ---- RESTAURANTS ----
  restaurants: [
    {
      id: 'R1',
      name: 'Spice Garden Biryani House',
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
      cuisines: ['South Indian', 'Biryani', 'Mughlai'],
      rating: 4.8,
      reviewCount: 2847,
      deliveryTime: 25,
      distance: 1.2,
      costForTwo: 350,
      offer: '50% OFF up to ₹100',
      offerCode: 'SAVE50',
      tags: ['Trending', 'Best Seller'],
      isVegOnly: false,
      isOpen: true,
      isFeatured: true,
      location: 'Near GITAM Gate, Devanahalli',
      phone: '+919876543210',
      categories: ['biryani', 'thali'],
      menu: [
        {
          id: 'M1_1', name: 'Chicken Biryani', price: 250, mrp: 320, isVeg: false,
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
          description: 'Slow-cooked Hyderabadi dum biryani with premium basmati rice and tender chicken pieces.',
          rating: 4.9, ratingCount: 1240, category: 'biryani',
          tags: ['Bestseller', '🔥 Hot'],
          orderedCount: 1240,
          customizations: [
            { group: 'Spice Level', required: true, options: [
              { id: 'sp_mild', label: 'Mild 😊', extraPrice: 0 },
              { id: 'sp_medium', label: 'Medium 🌶️', extraPrice: 0 },
              { id: 'sp_hot', label: 'Extra Hot 🔥', extraPrice: 0 },
            ]},
            { group: 'Add-Ons', required: false, options: [
              { id: 'addon_egg', label: 'Extra Egg', extraPrice: 20 },
              { id: 'addon_raita', label: 'Raita', extraPrice: 30 },
              { id: 'addon_salan', label: 'Mirchi Salan', extraPrice: 25 },
            ]}
          ]
        },
        {
          id: 'M1_2', name: 'Mutton Biryani', price: 380, mrp: 450, isVeg: false,
          image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&q=80',
          description: 'Premium mutton pieces cooked with aromatic spices & saffron-infused basmati rice.',
          rating: 4.7, ratingCount: 890, category: 'biryani',
          tags: ['Chef\'s Special'],
          orderedCount: 890,
          customizations: [
            { group: 'Spice Level', required: true, options: [
              { id: 'sp_mild', label: 'Mild 😊', extraPrice: 0 },
              { id: 'sp_hot', label: 'Extra Hot 🔥', extraPrice: 0 },
            ]},
            { group: 'Portion', required: false, options: [
              { id: 'prt_half', label: 'Half Plate', extraPrice: -100 },
              { id: 'prt_full', label: 'Full Plate', extraPrice: 0 },
            ]}
          ]
        },
        {
          id: 'M1_3', name: 'Paneer Biryani', price: 210, mrp: 260, isVeg: true,
          image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&q=80',
          description: 'Fresh paneer cubes layered in fragrant biryani, perfect for vegetarians.',
          rating: 4.5, ratingCount: 560, category: 'biryani',
          tags: ['Veg Special', '🌱'],
          orderedCount: 560,
          customizations: []
        },
        {
          id: 'M1_4', name: 'Chicken 65 Biryani', price: 290, mrp: 360, isVeg: false,
          image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400&q=80',
          description: 'Crispy Chicken 65 pieces mixed into aromatic dum biryani — a heavenly combo!',
          rating: 4.8, ratingCount: 720, category: 'biryani',
          tags: ['New', '🔥 Trending'],
          orderedCount: 720,
          customizations: [],
          isNew: true
        },
        {
          id: 'M1_5', name: 'Veg Thali', price: 150, mrp: 180, isVeg: true,
          image: 'https://images.unsplash.com/photo-1626315865239-0268a2bfb657?w=400&q=80',
          description: 'Complete veg thali with dal, sabzi, rice, roti, raita and pickle.',
          rating: 4.4, ratingCount: 430, category: 'thali',
          tags: ['Value Meal'],
          orderedCount: 430,
          customizations: []
        },
        {
          id: 'M1_6', name: 'Chicken Roast', price: 260, mrp: 300, isVeg: false,
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80',
          description: 'Tender whole chicken marinated in 15 spices and slow-roasted to perfection.',
          rating: 4.7, ratingCount: 680, category: 'biryani',
          tags: [],
          orderedCount: 680,
          customizations: []
        },
      ]
    },

    {
      id: 'R2',
      name: 'The Pizza Lab',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      cuisines: ['Italian', 'Fast Food', 'Continental'],
      rating: 4.6,
      reviewCount: 1923,
      deliveryTime: 35,
      distance: 0.8,
      costForTwo: 450,
      offer: 'Buy 1 Get 1 FREE',
      offerCode: 'GITAM20',
      tags: ['New', 'Popular'],
      isVegOnly: false,
      isOpen: true,
      isFeatured: false,
      location: 'GITAM Campus Food Court',
      phone: '+919988776655',
      categories: ['pizza', 'burger', 'beverages'],
      menu: [
        {
          id: 'M2_1', name: 'Margherita Pizza', price: 199, mrp: 249, isVeg: true,
          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
          description: 'Classic Italian Margherita with San Marzano tomato sauce, fresh mozzarella & basil.',
          rating: 4.7, ratingCount: 894, category: 'pizza',
          tags: ['Bestseller', '🌱 Veg'],
          orderedCount: 894,
          customizations: [
            { group: 'Crust', required: true, options: [
              { id: 'crust_thin', label: 'Thin Crust', extraPrice: 0 },
              { id: 'crust_thick', label: 'Thick Crust', extraPrice: 20 },
              { id: 'crust_stuffed', label: 'Cheese Stuffed Crust 🧀', extraPrice: 50 },
            ]},
            { group: 'Size', required: true, options: [
              { id: 'sz_7', label: '7" Regular', extraPrice: 0 },
              { id: 'sz_10', label: '10" Medium', extraPrice: 80 },
              { id: 'sz_12', label: '12" Large', extraPrice: 130 },
            ]},
            { group: 'Extra Toppings', required: false, options: [
              { id: 'top_cheese', label: 'Extra Cheese 🧀', extraPrice: 40 },
              { id: 'top_corn', label: 'Sweet Corn', extraPrice: 20 },
              { id: 'top_jalap', label: 'Jalapeños 🌶️', extraPrice: 15 },
              { id: 'top_olives', label: 'Black Olives', extraPrice: 25 },
            ]}
          ]
        },
        {
          id: 'M2_2', name: 'BBQ Chicken Pizza', price: 299, mrp: 380, isVeg: false,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80',
          description: 'Smoky BBQ sauce base with grilled chicken, caramelized onions and melted cheese.',
          rating: 4.8, ratingCount: 1102, category: 'pizza',
          tags: ['Bestseller', '🔥 Spicy'],
          orderedCount: 1102,
          customizations: []
        },
        {
          id: 'M2_3', name: 'Veg Supreme Pizza', price: 249, mrp: 310, isVeg: true,
          image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&q=80',
          description: 'Loaded with capsicum, onion, mushroom, corn and paneer on a herb-infused base.',
          rating: 4.5, ratingCount: 678, category: 'pizza',
          tags: ['Veg'],
          orderedCount: 678,
          customizations: []
        },
        {
          id: 'M2_4', name: 'Classic Veg Burger', price: 99, mrp: 129, isVeg: true,
          image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80',
          description: 'Crispy veggie patty with lettuce, tomato, onion & our secret sauce in a brioche bun.',
          rating: 4.3, ratingCount: 445, category: 'burger',
          tags: ['Value Pick'],
          orderedCount: 445,
          customizations: [
            { group: 'Add-Ons', required: false, options: [
              { id: 'addon_fries', label: 'French Fries', extraPrice: 49 },
              { id: 'addon_coke', label: 'Coke 330ml', extraPrice: 40 },
            ]}
          ]
        },
        {
          id: 'M2_5', name: 'Chicken Zinger Burger', price: 159, mrp: 199, isVeg: false,
          image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80',
          description: 'Crunchy, juicy chicken fillet with spicy mayo and fresh veggies.',
          rating: 4.6, ratingCount: 812, category: 'burger',
          tags: ['Bestseller'],
          orderedCount: 812,
          customizations: []
        },
        {
          id: 'M2_6', name: 'Cold Coffee Frappe', price: 89, mrp: 120, isVeg: true,
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80',
          description: 'Blended cold coffee with a thick layer of whipped cream.',
          rating: 4.4, ratingCount: 567, category: 'beverages',
          tags: ['Cool Down ❄️'],
          orderedCount: 567,
          customizations: [
            { group: 'Size', required: true, options: [
              { id: 'sz_sm', label: 'Regular (350ml)', extraPrice: 0 },
              { id: 'sz_lg', label: 'Large (500ml)', extraPrice: 30 },
            ]},
            { group: 'Sugar', required: false, options: [
              { id: 'sg_no', label: 'No Sugar', extraPrice: 0 },
              { id: 'sg_yes', label: 'With Sugar', extraPrice: 0 },
            ]}
          ]
        },
      ]
    },

    {
      id: 'R3',
      name: 'Aaradhya South Tiffins',
      image: 'https://images.unsplash.com/photo-1630383060421-cb2b42907be8?auto=format&fit=crop&w=600&q=80',
      cuisines: ['South Indian', 'Breakfast', 'Tiffins'],
      rating: 4.7,
      reviewCount: 3421,
      deliveryTime: 20,
      distance: 0.5,
      costForTwo: 200,
      offer: 'FREE Delivery',
      offerCode: 'FREEDEL',
      tags: ['Trending', 'Top Rated'],
      isVegOnly: true,
      isOpen: true,
      isFeatured: true,
      location: 'Doddaballapur Main Road',
      phone: '+919944332211',
      categories: ['dosa', 'thali', 'snacks'],
      menu: [
        {
          id: 'M3_1', name: 'Masala Dosa', price: 80, mrp: 100, isVeg: true,
          image: 'https://images.unsplash.com/photo-1630383060421-cb2b42907be8?w=400&q=80',
          description: 'Crispy golden dosa stuffed with perfectly spiced potato masala. Served with sambar & chutney.',
          rating: 4.9, ratingCount: 1876, category: 'dosa',
          tags: ['Bestseller', '❤️ Loved'],
          orderedCount: 1876,
          customizations: [
            { group: 'Chutney', required: false, options: [
              { id: 'chut_coconut', label: 'Coconut Chutney', extraPrice: 0 },
              { id: 'chut_tomato', label: 'Tomato Chutney', extraPrice: 0 },
              { id: 'chut_both', label: 'Both Chutneys', extraPrice: 0 },
            ]}
          ]
        },
        {
          id: 'M3_2', name: 'Ghee Roast Dosa', price: 90, mrp: 115, isVeg: true,
          image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&q=80',
          description: 'Extra crispy dosa roasted in pure ghee — a divine South Indian classic.',
          rating: 4.8, ratingCount: 1102, category: 'dosa',
          tags: ['Chef\'s Pick 👨‍🍳'],
          orderedCount: 1102,
          customizations: []
        },
        {
          id: 'M3_3', name: 'Idli Vada Combo', price: 60, mrp: 80, isVeg: true,
          image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=400&q=80',
          description: '2 fluffy idlis + 1 crispy medu vada with sambar and fresh coconut chutney.',
          rating: 4.6, ratingCount: 890, category: 'snacks',
          tags: ['Value Meal 💯'],
          orderedCount: 890,
          customizations: []
        },
        {
          id: 'M3_4', name: 'Bisi Bele Bath', price: 120, mrp: 150, isVeg: true,
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
          description: 'Karnataka\'s iconic lentil rice dish cooked with vegetables and a secret spice blend.',
          rating: 4.5, ratingCount: 645, category: 'thali',
          tags: ['Local Favourite 🏆'],
          orderedCount: 645,
          customizations: []
        },
        {
          id: 'M3_5', name: 'Set Dosa (3 pcs)', price: 70, mrp: 90, isVeg: true,
          image: 'https://images.unsplash.com/photo-1630383060421-cb2b42907be8?w=400&q=80',
          description: 'Soft, fluffy mini dosas served in sets of 3 with sambar and chutney.',
          rating: 4.4, ratingCount: 523, category: 'dosa',
          tags: [],
          orderedCount: 523,
          customizations: []
        },
        {
          id: 'M3_6', name: 'Filter Coffee', price: 40, mrp: 55, isVeg: true,
          image: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=400&q=80',
          description: 'Authentic South Indian decoction coffee with frothy milk poured from a height.',
          rating: 4.9, ratingCount: 2100, category: 'beverages',
          tags: ['☕ Must Try'],
          orderedCount: 2100,
          customizations: [
            { group: 'Sugar', required: false, options: [
              { id: 'sg_no', label: 'No Sugar', extraPrice: 0 },
              { id: 'sg_less', label: 'Less Sugar', extraPrice: 0 },
              { id: 'sg_normal', label: 'Normal Sweet', extraPrice: 0 },
              { id: 'sg_extra', label: 'Extra Sweet', extraPrice: 0 },
            ]}
          ]
        },
      ]
    },

    {
      id: 'R4',
      name: 'Empire Restaurant & Bar',
      image: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&w=600&q=80',
      cuisines: ['North Indian', 'Mughlai', 'Tandoor'],
      rating: 4.5,
      reviewCount: 1567,
      deliveryTime: 40,
      distance: 2.1,
      costForTwo: 600,
      offer: '₹100 OFF on orders above ₹499',
      offerCode: 'WEEKEND',
      tags: ['Busy 🔥'],
      isVegOnly: false,
      isOpen: true,
      isFeatured: false,
      location: 'NH 44 Highway, Near Toll',
      phone: '+918877665544',
      categories: ['biryani', 'thali'],
      menu: [
        {
          id: 'M4_1', name: 'Tandoori Chicken (Half)', price: 260, mrp: 320, isVeg: false,
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80',
          description: 'Marinated in yoghurt and spices, cooked in a clay tandoor for the perfect charred flavour.',
          rating: 4.7, ratingCount: 789, category: 'biryani',
          tags: ['Bestseller 🔥'],
          orderedCount: 789,
          customizations: [
            { group: 'Serving', required: false, options: [
              { id: 'srve_roti', label: 'With Roomali Roti (2pcs)', extraPrice: 40 },
              { id: 'srve_naan', label: 'With Butter Naan', extraPrice: 50 },
            ]}
          ]
        },
        {
          id: 'M4_2', name: 'Butter Chicken', price: 280, mrp: 340, isVeg: false,
          image: 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?w=400&q=80',
          description: 'Tender chicken in a rich, creamy tomato-cashew gravy — India\'s most loved curry.',
          rating: 4.8, ratingCount: 1230, category: 'biryani',
          tags: ['All Time Favourite ❤️'],
          orderedCount: 1230,
          customizations: []
        },
        {
          id: 'M4_3', name: 'Dal Makhani', price: 180, mrp: 220, isVeg: true,
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80',
          description: 'Slow-cooked black lentils simmered overnight in butter and cream.',
          rating: 4.6, ratingCount: 567, category: 'thali',
          tags: ['Veg'],
          orderedCount: 567,
          customizations: []
        },
        {
          id: 'M4_4', name: 'Garlic Naan', price: 50, mrp: 65, isVeg: true,
          image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6cb?w=400&q=80',
          description: 'Soft, pillowy naan brushed with garlic butter and fresh coriander.',
          rating: 4.5, ratingCount: 890, category: 'thali',
          tags: [],
          orderedCount: 890,
          customizations: []
        },
        {
          id: 'M4_5', name: 'Seekh Kebab Platter', price: 320, mrp: 400, isVeg: false,
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80',
          description: '6 juicy minced lamb seekh kebabs with mint chutney and sliced onion ring salad.',
          rating: 4.7, ratingCount: 456, category: 'biryani',
          tags: ['Chef\'s Special'],
          orderedCount: 456,
          customizations: []
        },
      ]
    },

    {
      id: 'R5',
      name: 'Dragon Palace — Chinese',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      cuisines: ['Chinese', 'Thai', 'Asian Fusion'],
      rating: 4.4,
      reviewCount: 987,
      deliveryTime: 30,
      distance: 1.7,
      costForTwo: 400,
      offer: '20% OFF up to ₹80',
      offerCode: 'GITAM20',
      tags: ['New', 'Trending'],
      isVegOnly: false,
      isOpen: false,
      isFeatured: false,
      location: 'Commercial Street, Devanahalli',
      phone: '+917766554433',
      categories: ['chinese', 'snacks', 'beverages'],
      menu: [
        {
          id: 'M5_1', name: 'Veg Momos (8 pcs)', price: 120, mrp: 150, isVeg: true,
          image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80',
          description: 'Steamed dumplings stuffed with spicy mixed veggies, served with fiery red chilli sauce.',
          rating: 4.6, ratingCount: 756, category: 'snacks',
          tags: ['Bestseller', '🌱'],
          orderedCount: 756,
          customizations: [
            { group: 'Cooking Style', required: true, options: [
              { id: 'cs_steam', label: 'Steamed', extraPrice: 0 },
              { id: 'cs_fry', label: 'Fried', extraPrice: 20 },
              { id: 'cs_panfry', label: 'Pan Fried', extraPrice: 20 },
            ]}
          ]
        },
        {
          id: 'M5_2', name: 'Chicken Momos (8 pcs)', price: 150, mrp: 190, isVeg: false,
          image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80',
          description: 'Juicy chicken momos with ginger, garlic and spring onion, served with two dips.',
          rating: 4.7, ratingCount: 920, category: 'snacks',
          tags: ['Trending 🔥'],
          orderedCount: 920,
          customizations: []
        },
        {
          id: 'M5_3', name: 'Hakka Noodles', price: 140, mrp: 180, isVeg: true,
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80',
          description: 'Stir-fried noodles with colorful veggies, soy sauce and sesame oil.',
          rating: 4.4, ratingCount: 534, category: 'chinese',
          tags: [],
          orderedCount: 534,
          customizations: []
        },
        {
          id: 'M5_4', name: 'Chilli Paneer (Dry)', price: 180, mrp: 230, isVeg: true,
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
          description: 'Crispy fried paneer tossed with green chillies, bell peppers and soy sauce.',
          rating: 4.5, ratingCount: 623, category: 'chinese',
          tags: ['Spicy 🌶️'],
          orderedCount: 623,
          customizations: []
        },
        {
          id: 'M5_5', name: 'Manchurian Fried Rice Combo', price: 220, mrp: 280, isVeg: true,
          image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80',
          description: 'Veg manchurian balls in glossy sauce with fragrant fried rice — a crowd pleaser.',
          rating: 4.5, ratingCount: 478, category: 'chinese',
          tags: ['Combo Deal 💰'],
          orderedCount: 478,
          customizations: []
        },
      ]
    },

    {
      id: 'R6',
      name: 'Sweet Tooth Desserts & Café',
      image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=600&q=80',
      cuisines: ['Desserts', 'Ice Cream', 'Beverages', 'Bakery'],
      rating: 4.9,
      reviewCount: 4210,
      deliveryTime: 15,
      distance: 0.3,
      costForTwo: 250,
      offer: 'FREE Delivery always!',
      offerCode: 'FREEDEL',
      tags: ['Top Rated ⭐', 'New'],
      isVegOnly: true,
      isOpen: true,
      isFeatured: true,
      location: 'GITAM Campus Hostel Complex',
      phone: '+919123456789',
      categories: ['desserts', 'beverages'],
      menu: [
        {
          id: 'M6_1', name: 'Death by Chocolate Shake', price: 180, mrp: 230, isVeg: true,
          image: 'https://images.unsplash.com/photo-1541658016709-82835970f11f?w=400&q=80',
          description: 'Ultra-thick chocolate milkshake with brownie chunks, Oreos and whipped cream.',
          rating: 4.9, ratingCount: 2130, category: 'beverages',
          tags: ['Bestseller 💯', '❤️ Must Try'],
          orderedCount: 2130,
          customizations: [
            { group: 'Size', required: true, options: [
              { id: 'sz_reg', label: 'Regular (400ml)', extraPrice: 0 },
              { id: 'sz_xl', label: 'XL (600ml)', extraPrice: 50 },
            ]}
          ]
        },
        {
          id: 'M6_2', name: 'Nutella Waffle', price: 150, mrp: 200, isVeg: true,
          image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80',
          description: 'Golden Belgian waffles drizzled with warm Nutella, sliced bananas and crushed nuts.',
          rating: 4.8, ratingCount: 1456, category: 'desserts',
          tags: ['Instagrammable 📸', 'Bestseller'],
          orderedCount: 1456,
          customizations: []
        },
        {
          id: 'M6_3', name: 'Classic Gulab Jamun (4 pcs)', price: 80, mrp: 100, isVeg: true,
          image: 'https://images.unsplash.com/photo-1601303516534-bf4a9e7b1068?w=400&q=80',
          description: 'Soft khoya balls soaked in rose-scented sugar syrup — the ultimate comfort dessert.',
          rating: 4.7, ratingCount: 980, category: 'desserts',
          tags: ['Indian Classic'],
          orderedCount: 980,
          customizations: []
        },
        {
          id: 'M6_4', name: 'Mango Lassi (Large)', price: 90, mrp: 120, isVeg: true,
          image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&q=80',
          description: 'Thick, creamy Alphonso mango lassi with a hint of cardamom.',
          rating: 4.8, ratingCount: 1234, category: 'beverages',
          tags: ['Summer Special ☀️'],
          orderedCount: 1234,
          customizations: []
        },
        {
          id: 'M6_5', name: 'Brownie à la Mode', price: 130, mrp: 170, isVeg: true,
          image: 'https://images.unsplash.com/photo-1589375234288-7a90ab764da7?w=400&q=80',
          description: 'Warm fudgy chocolate brownie served with a scoop of vanilla ice cream.',
          rating: 4.9, ratingCount: 1678, category: 'desserts',
          tags: ['Fan Favourite 🌟'],
          orderedCount: 1678,
          customizations: []
        },
      ]
    },
  ],

  // ---- REVIEWS ----
  reviews: {
    'R1': [
      { user: 'Arjun S.', avatar: '🧑', rating: 5, text: 'Best biryani in Devanahalli, hands down! The chicken was so tender and the rice was perfectly cooked.', time: '2h ago', likes: 24 },
      { user: 'Priya K.', avatar: '👩', rating: 4, text: 'Great food, delivery was quick. The spice level was perfect for my taste.', time: '1d ago', likes: 12 },
      { user: 'Rahul M.', avatar: '🧑‍💻', rating: 5, text: 'Ordered 3 times this week already! Cannot stop.', time: '3d ago', likes: 31 },
    ],
    'R2': [
      { user: 'Sneha R.', avatar: '👩‍🎓', rating: 5, text: 'The cheese stuffed crust pizza is a game changer! Totally recommend it.', time: '5h ago', likes: 18 },
      { user: 'Vikram P.', avatar: '🧑‍🍳', rating: 4, text: 'Good pizza for campus. Fresh ingredients and fast delivery.', time: '2d ago', likes: 9 },
    ],
    'R3': [
      { user: 'Kavya T.', avatar: '👩', rating: 5, text: 'Feels like home food! The filter coffee is unbeatable.', time: '1h ago', likes: 45 },
      { user: 'Suresh N.', avatar: '🧑‍💼', rating: 5, text: 'Authentic Karnataka flavors. Bisi Bele Bath was divine!', time: '4h ago', likes: 28 },
    ],
    'R4': [
      { user: 'Ankit V.', avatar: '🧑', rating: 4, text: 'The tandoori chicken was smoky and absolutely delicious!', time: '1d ago', likes: 15 },
      { user: 'Meera L.', avatar: '👩', rating: 5, text: 'Butter chicken is the best I have ever had in this area.', time: '3d ago', likes: 22 },
    ],
    'R5': [
      { user: 'Ravi C.', avatar: '🧑‍🎓', rating: 4, text: 'The momos are fantastic! Crispy and juicy. Would order again.', time: '6h ago', likes: 11 },
    ],
    'R6': [
      { user: 'Divya S.', avatar: '👩‍🎤', rating: 5, text: 'Death by Chocolate is EVERYTHING! Best shake I have ever had.', time: '30m ago', likes: 67 },
      { user: 'Kiran J.', avatar: '🧑‍🎨', rating: 5, text: 'The waffles are so Instagrammable and equally delicious!', time: '2h ago', likes: 43 },
      { user: 'Nisha P.', avatar: '👩‍💻', rating: 5, text: 'Brownie a la mode is pure heaven. Visit every weekend!', time: '1d ago', likes: 29 },
    ],
  },

  // ---- DELIVERY AGENTS ----
  agents: [
    { name: 'Raju Kumar', rating: 4.8, phone: '+919876501234', avatar: '🏍️', bike: 'Honda Activa' },
    { name: 'Suresh Gowda', rating: 4.9, phone: '+919765012345', avatar: '🛵', bike: 'TVS Jupiter' },
    { name: 'Mahesh Reddy', rating: 4.7, phone: '+919654123456', avatar: '🚀', bike: 'Royal Enfield' },
    { name: 'Venkat Rao', rating: 4.6, phone: '+919543456789', avatar: '⚡', bike: 'Bajaj Pulsar' },
  ],
};
