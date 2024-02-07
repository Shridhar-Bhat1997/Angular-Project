import { model, Schema, Types } from 'mongoose';
import { Food, FoodSchema } from './food.model';
import { OrderStatus } from '../constants/order_status';

// Interface representing the structure of LatLng (latitude and longitude)
export interface LatLng {
    lat: string;
    lng: string;
}

// Define the Mongoose schema for LatLng
export const LatLngSchema = new Schema<LatLng>({
    lat: { type: String, required: true },
    lng: { type: String, required: true }
});

// Interface representing the structure of an OrderItem
export interface OrderItem {
    food: Food;
    price: number;
    quantity: number;
}

// Define the Mongoose schema for OrderItem
export const OrderItemSchema = new Schema<OrderItem>({
    food: { type: FoodSchema, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

// Interface representing the structure of an Order
export interface Order {
    id: number;
    items: OrderItem[];
    totalPrice: number;
    name: string;
    address: string;
    addressLatLng: LatLng;
    paymentId: string;
    status: OrderStatus;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Define the Mongoose schema for Order
const orderSchema = new Schema<Order>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: LatLngSchema, required: true },
    paymentId: { type: String },
    totalPrice: { type: Number, required: true },
    items: { type: [OrderItemSchema], required: true },
    status: { type: String, default: OrderStatus.NEW },
    user: { type: Schema.Types.ObjectId, required: true }
}, {
    timestamps: true, // Automatically include createdAt and updatedAt timestamps
    toJSON: {
        virtuals: true // Include virtual properties when converting to JSON
    },
    toObject: {
        virtuals: true // Include virtual properties when converting to a plain JavaScript object
    }
});

// Create a Mongoose model for the Order entity
export const OrderModel = model<Order>('order', orderSchema);
