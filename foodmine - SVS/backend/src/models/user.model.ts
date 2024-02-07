import { Schema, model } from "mongoose";

// Interface representing the structure of a User
export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    address: string;
    isAdmin: boolean;
}

// Define the Mongoose schema for the User entity
export const UserSchema = new Schema<User>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { type: String, required: true },
        isAdmin: { type: Boolean, required: true },
    },
    {
        timestamps: true, // Automatically include createdAt and updatedAt timestamps
        toJSON: {
            virtuals: true // Include virtual properties when converting to JSON
        },
        toObject: {
            virtuals: true // Include virtual properties when converting to a plain JavaScript object
        }
    }
);

// Create a Mongoose model for the User entity
export const UserModel = model<User>('user', UserSchema);
