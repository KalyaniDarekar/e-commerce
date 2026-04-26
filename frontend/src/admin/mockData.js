export const MOCK_STATS = {
  totalProducts: 48,
  totalOrders: 3621,
  totalRevenue: 28459000,
  pendingDeliveries: 142,
}

export const CATEGORIES = ['Mobiles', 'Laptops', 'Audio', 'Cameras', 'Tablets', 'Accessories']

export const MOCK_PRODUCTS = [
  { _id: '1', name: 'iPhone 15 Pro', brand: 'Apple', price: 134900, discountPrice: 128155, category: 'Mobiles', stock: 20, rating: 4.8, onSale: true, discount: 5, outOfStock: false, images: ['https://images.unsplash.com/photo-1668363958849-b22a6d5c47d7?w=80&q=80'] },
  { _id: '2', name: 'MacBook Pro 16"', brand: 'Apple', price: 249900, discountPrice: 249900, category: 'Laptops', stock: 10, rating: 4.9, onSale: false, discount: 0, outOfStock: false, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&q=80'] },
  { _id: '3', name: 'Sony WH-1000XM5', brand: 'Sony', price: 29990, discountPrice: 25491, category: 'Audio', stock: 3, rating: 4.7, onSale: true, discount: 15, outOfStock: false, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=80&q=80'] },
  { _id: '4', name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 129999, discountPrice: 116999, category: 'Mobiles', stock: 0, rating: 4.6, onSale: true, discount: 10, outOfStock: true, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=80&q=80'] },
  { _id: '5', name: 'Dell XPS 15', brand: 'Dell', price: 159900, discountPrice: 147108, category: 'Laptops', stock: 8, rating: 4.5, onSale: true, discount: 8, outOfStock: false, images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=80&q=80'] },
  { _id: '6', name: 'AirPods Pro 2nd Gen', brand: 'Apple', price: 24900, discountPrice: 24900, category: 'Audio', stock: 100, rating: 4.8, onSale: false, discount: 0, outOfStock: false, images: ['https://images.unsplash.com/photo-1675525587760-81b7e26ede33?w=80&q=80'] },
  { _id: '7', name: 'iPad Pro 12.9"', brand: 'Apple', price: 112900, discountPrice: 107255, category: 'Tablets', stock: 4, rating: 4.7, onSale: true, discount: 5, outOfStock: false, images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&q=80'] },
  { _id: '8', name: 'Sony A7 IV Camera', brand: 'Sony', price: 199990, discountPrice: 199990, category: 'Cameras', stock: 5, rating: 4.9, onSale: false, discount: 0, outOfStock: false, images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=80&q=80'] },
]

export const MOCK_ORDERS = [
  { _id: 'ORD-001', customer: 'Rahul Sharma', address: '12, MG Road, Mumbai, MH 400001', phone: '+91 98765 43210', products: [{ name: 'iPhone 15 Pro', qty: 1, price: 128155 }], total: 128155, status: 'Delivered', date: '2026-04-01' },
  { _id: 'ORD-002', customer: 'Priya Mehta', address: '45, Park Street, Kolkata, WB 700016', phone: '+91 87654 32109', products: [{ name: 'MacBook Pro 16"', qty: 1, price: 249900 }, { name: 'AirPods Pro', qty: 1, price: 24900 }], total: 274800, status: 'Shipped', date: '2026-04-02' },
  { _id: 'ORD-003', customer: 'Ankit Verma', address: '8, Koramangala, Bengaluru, KA 560034', phone: '+91 76543 21098', products: [{ name: 'Sony WH-1000XM5', qty: 2, price: 50982 }], total: 50982, status: 'Out for Delivery', date: '2026-04-03' },
  { _id: 'ORD-004', customer: 'Sneha Patel', address: '22, SG Highway, Ahmedabad, GJ 380054', phone: '+91 65432 10987', products: [{ name: 'iPad Pro 12.9"', qty: 1, price: 107255 }], total: 107255, status: 'Pending', date: '2026-04-04' },
  { _id: 'ORD-005', customer: 'Rohan Gupta', address: '33, Civil Lines, Delhi, DL 110054', phone: '+91 54321 09876', products: [{ name: 'Dell XPS 15', qty: 1, price: 147108 }], total: 147108, status: 'Pending', date: '2026-04-04' },
  { _id: 'ORD-006', customer: 'Kiran Reddy', address: '17, Banjara Hills, Hyderabad, TS 500034', phone: '+91 43210 98765', products: [{ name: 'Sony A7 IV Camera', qty: 1, price: 199990 }], total: 199990, status: 'Shipped', date: '2026-04-03' },
]

export const EMPTY_FORM = {
  name: '', brand: '', description: '', category: 'Mobiles',
  price: '', discountPrice: '', stock: '',
  onSale: false, outOfStock: false, discount: 0,
  images: [],
}
