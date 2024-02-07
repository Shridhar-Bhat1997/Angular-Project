import { Timestamp } from "mongodb";
import { Schema, model } from "mongoose";

// Interface representing the structure of a Food document
export interface Food {
    id: string;
    name: string;
    price: number;
    tags: string[];
    favorite: boolean;
    stars: number;
    imageUrl: string;
    origins: string[];
    cookTime: string;
}

// Define the Mongoose schema for the Food entity
export const FoodSchema = new Schema<Food>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        tags: { type: [String] },
        favorite: { type: Boolean, required: true },
        stars: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        origins: { type: [String], required: true },
        cookTime: { type: String, required: true },
    },
    {
        // Configure Mongoose options
        toJSON: {
            virtuals: true // Include virtual properties when converting to JSON
        },
        toObject: {
            virtuals: true // Include virtual properties when converting to a plain JavaScript object
        },
        timestamps: true // Automatically include createdAt and updatedAt timestamps
    }
);

// Create a Mongoose model for the Food entity
export const FoodModel = model<Food>('food', FoodSchema);
