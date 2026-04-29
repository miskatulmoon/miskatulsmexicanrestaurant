export const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'About', path: '/about' },
  { label: 'Book Table', path: '/book-table' },
];

export const featuredItems = [
  {
    title: 'Tacos',
    description:
      'Street Tacos: Soft corn tortillas filled with your choice of meat, topped with white onion, fresh cilantro, and lime wedges. Served with salsa verde.',
    image: '/images/street-tacos-recipe-2.jpg',
    buttonStyle: 'white',
  },
  {
    title: 'Burritos',
    description:
      'Burritos: a 12-inch flour tortilla wrapped around rice, beans, cheddar/jack cheese, sour cream, and protein of your choice.',
    image: '/images/EMK-The-Ultimate-California-Burrito-hero_1200x1500.jpg',
    buttonStyle: 'red',
  },
  {
    title: 'Burrito Bowls',
    description:
      'Create your own masterpiece: A base of rice or greens, topped with your choice of protein, fresh-chopped salsa, shredded cheese, sour cream, and custom sauces.',
    image: '/images/Chicken-Burrito-Bowl-SpendWithPennies-102_1200x1500.jpg',
    buttonStyle: 'white',
  },
];

export const menuCategories = [
  { label: 'All', value: 'all' },
  { label: 'Tacos', value: 'tacos' },
  { label: 'Burritos', value: 'burritos' },
  { label: 'Bowls & Mains', value: 'bowls' },
  { label: 'Sides', value: 'sides' },
];

export const menuItems = [
  {
    name: '3 Piece Tacos',
    price: 5,
    category: 'tacos',
    image: '/images/street-tacos-recipe-2.jpg',
  },
  {
    name: '5 Piece Tacos',
    price: 8,
    category: 'tacos',
    image: '/images/street-tacos-recipe-2.jpg',
  },
  {
    name: 'Regular Burrito',
    price: 6,
    category: 'burritos',
    image: '/menu_items/instant-pot-chicken-burritos-3_1200x1500.jpg',
  },
  {
    name: 'Vegan Burrito',
    price: 5,
    category: 'burritos',
    image: '/menu_items/vegan-burrito_1200x1500.jpg',
  },
  {
    name: 'Burrito Bowl',
    price: 6,
    category: 'bowls',
    image: '/menu_items/Chipotle-Burrito-Bowls-06.jpg',
  },
  {
    name: 'Fajitas',
    price: 5,
    category: 'bowls',
    image: '/menu_items/chicken-fajitas-small-7_1200x1500 (1).jpg',
  },
  {
    name: 'Quesadillas',
    price: 5,
    category: 'bowls',
    image: '/menu_items/mexican-appetizers-quesados-V2_1200x1500.jpg',
  },
  {
    name: 'Chips & Salsa',
    price: 5,
    category: 'sides',
    image: '/menu_items/best-homemade-chunky-salsa-recipe_1200x1500.jpg',
  },
  {
    name: 'French Fries',
    price: 3,
    category: 'sides',
    image: '/menu_items/french-fries-_1200x1500.jpg',
  },
];

export const storyBlocks = [
  {
    label: 'How it started',
    title: 'A Family Recipe,',
    highlight: 'A New York Dream',
    image: '/images/5f3a3cc188d83da6768f2ce8_3.png',
    alt: 'Restaurant interior',
    paragraphs: [
      "In 2008, Miskatul and her family arrived in New York City carrying little more than their grandmother's handwritten recipe book, a worn leather journal stuffed with decades of Oaxacan cooking secrets. What started as Sunday dinners for neighbors quickly grew into something much bigger.",
      'Inspired by the vibrant street food of Mexico City and the bold moles of their hometown, the family decided to share their food with the whole city.',
    ],
  },
  {
    label: 'The first location',
    title: 'Opening Day in',
    highlight: 'Brooklyn',
    image: '/images/Restaurant-Grand-Opening-900-h-min.jpeg',
    alt: 'Street tacos',
    reverse: true,
    paragraphs: [
      'The first Miskatul\'s Mexican Restaurant opened in March 2012 on a quiet corner in Bushwick, Brooklyn. The line wrapped around the block on opening day as word had spread fast about the hand-pressed tortillas and slow-braised carnitas that took 12 hours to prepare.',
      'Every dish was made from scratch, every morning, with ingredients sourced from local Brooklyn markets and trusted suppliers who shared the same passion for quality.',
    ],
  },
  {
    label: 'Where we are today',
    title: 'Growing With',
    highlight: 'New York City',
    image: '/images/nyc-morning-gui-cha.jpg',
    alt: 'Burrito bowl',
    paragraphs: [
      "Today, we celebrate the 14th anniversary of Miskatul's Mexican Restaurant in our three locations across Manhattan and Brooklyn. The same grandmother's recipes, the same 12-hour carnitas, the same love poured into every plate.",
      "We believe food is memory. Every taco, burrito, and bowl we serve carries a piece of our family's story - and we hope it becomes part of yours.",
    ],
  },
];
