export type CategoryName = 'Collars' | 'Harnesses' | 'Leashes' | 'Semi-choke' | 'Sets';

export interface ProductVariation {
  id: string;
  width: string;
  length: string;
  hardware: 'Classic' | 'Total Black' | 'Metallic' | 'Rose Gold' | 'Gold' | 'Silver' | 'Matte Black';
  neoprenePadding: boolean;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: CategoryName;
  basePrice: number;
  images: string[];
  variations: ProductVariation[];
  isSale: boolean;
  salePrice?: number;
  isNew: boolean;
  isAvailable: boolean;
  sku: string;
  sizeChart?: string;
  material?: string;
  countryOfOrigin?: string;
  additionalInfo?: string;
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: 'CUSTOMER' | 'ADMIN';
  address: {
    city: string;
    novaPoshtaBranch: string;
  };
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface OrderItem {
  productId: string;
  variationId: string;
  quantity: number;
  price: number;
  productName: string;
  variationDetails: string;
}

export interface Order {
  id: string;
  orderNumber: number;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Card' | 'Cash';
  shippingAddress: {
    firstName: string;
    lastName: string;
    city: string;
    novaPoshtaBranch: string;
    phone: string;
    email: string;
    comment?: string;
  };
  createdAt: Date;
}
