import { Router } from "express";
import { sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from 'bcryptjs';

// Create an Express router
const router = Router();

// Endpoint to seed the database with sample user data
router.get("/seed", asyncHandler(
    async (req, res) => {
        // Check if there are already documents in the UserModel collection
        const usersCount = await UserModel.countDocuments();
        if (usersCount > 0) {
            res.send("Seed is already done");
            return;
        }
        // Seed the database with sample_users data
        await UserModel.create(sample_users);
        res.send("Seed is done");
    }
));

// Endpoint for user login
router.post("/login", asyncHandler(
    async (req, res) => {
        const { email, password } = req.body;
        // Find a user with the provided email in the UserModel collection
        const user = await UserModel.findOne({ email });

        // Check if the user exists and the provided password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            // If authentication is successful, send a token response
            res.send(generateTokenResponse(user));
        } else {
            // If authentication fails, respond with an HTTP_BAD_REQUEST status
            res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
        }
    }
));

// Endpoint for user registration
router.post('/register', asyncHandler(
    async (req, res) => {
        const { name, email, password, address } = req.body;
        // Check if a user with the provided email already exists
        const user = await UserModel.findOne({ email });

        // If user already exists, respond with an HTTP_BAD_REQUEST status
        if (user) {
            res.status(HTTP_BAD_REQUEST).send("User already exists. Please login.");
            return;
        }

        // Encrypt the password before storing it in the database
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create a new user object with the encrypted password
        const newUser: User = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            address,
            isAdmin: false
        };

        // Store the new user in the UserModel collection
        const dbUser = await UserModel.create(newUser);

        // Send a token response for the newly registered user
        res.send(generateTokenResponse(dbUser));
    }
));

// Helper function to generate a token response for a user
const generateTokenResponse = (user: User) => {
    const token = jwt.sign({
        id: user.id, email: user.email, isAdmin: user.isAdmin
    }, process.env.JWT_SECRET!, {
        expiresIn: "30d"
    });

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        isAdmin: user.isAdmin,
        token: token
    };
};

// Export the router for use in other parts of the application
export default router;
