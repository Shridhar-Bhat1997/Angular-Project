import { Router } from "express";
import asyncHandler from 'express-async-handler';
import { sample_foods, sample_tags } from "../data";
import { FoodModel } from "../models/food.model";

// Create an Express router
const router = Router();

// Seed endpoint to initialize the database with sample data
router.get("/seed", asyncHandler(
    async (req, res) => {
        // Check if there are already documents in the FoodModel collection
        const foodsCount = await FoodModel.countDocuments();
        if (foodsCount > 0) {
            res.send("Seed is already done");
            return;
        }
        // Seed the database with sample_foods data
        await FoodModel.create(sample_foods);
        res.send("Seed is done");
    }
));

// Retrieve all foods from the database
router.get("/", asyncHandler(
    async (req, res) => {
        const foods = await FoodModel.find();
        res.send(foods);
    }
));

// Search for foods based on a given search term
router.get("/search/:searchTerm", asyncHandler(
    async (req, res) => {
        const searchRegex = new RegExp(req.params.searchTerm, 'i');
        const foods = await FoodModel.find({ name: { $regex: searchRegex } });
        res.send(foods);
    }
));

// Retrieve tags and their counts for all foods
router.get('/tag', asyncHandler(
    async (req, res) => {
        // Aggregate tags and their counts from the FoodModel collection
        const tags = await FoodModel.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: '$count' } },
        ]).sort({ count: -1 });

        // Include an 'All' tag with the total count of foods
        const all = {
            name: 'All',
            count: await FoodModel.countDocuments(),
        };
        tags.unshift(all);

        res.send(tags);
    }
));

// Retrieve foods based on a specific tag
router.get("/tag/:tagName", asyncHandler(
    async (req, res) => {
        // Find foods in the FoodModel collection with the specified tag
        const foods = await FoodModel.find({ tags: req.params.tagName });
        res.send(foods);
    }
));

// Retrieve a specific food by its ID
router.get("/:foodId", asyncHandler(
    async (req, res) => {
        // Find a specific food in the FoodModel collection by its ID
        const food = await FoodModel.findById(req.params.foodId);
        res.send(food);
    }
));

// Export the router for use in other parts of the application
export default router;
