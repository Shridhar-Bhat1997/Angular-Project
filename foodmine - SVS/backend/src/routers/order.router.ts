import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import { OrderStatus } from '../constants/order_status';
import { OrderModel } from '../models/order.model';
import auth from '../middlewares/auth.mid';

// Create an Express router
const router = Router();

// Middleware to ensure authentication for all routes in this router
router.use(auth);

// Endpoint to create a new order
router.post('/create', asyncHandler(async (req: any, res: any) => {
    // Extract the order details from the request body
    const requestOrder = req.body;

    // Check if the order contains items; otherwise, respond with a bad request
    if (requestOrder.items.length <= 0) {
        res.status(HTTP_BAD_REQUEST).send('Cart Is Empty!');
        return;
    }

    // Delete any existing new order for the current user
    await OrderModel.deleteOne({
        user: req.user.id,
        status: OrderStatus.NEW
    });

    // Create and save a new order for the current user
    const newOrder = new OrderModel({ ...requestOrder, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
}));

// ---------------------------- Payment page ---------------------------------------------

// Handler for GET request to retrieve the new order for the current user
router.get('/newOrderForCurrentUser', asyncHandler(async (req: any, res: any) => {
    // Call the helper function to get the new order for the current user
    const order = await getNewOrderForCurrentUser(req);

    // Send the order if found, else respond with an HTTP_BAD_REQUEST status
    if (order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
}));

// Handler for POST request to update payment details for the current user's new order
router.post('/pay', asyncHandler(async (req, res) => {
    // Extract paymentId from the request body
    const { paymentId } = req.body;

    // Retrieve the new order for the current user
    const order = await getNewOrderForCurrentUser(req);

    // Send an error response if the order is not found
    if (!order) {
        res.status(HTTP_BAD_REQUEST).send('Order Not Found');
        return;
    }

    // Update payment details and status of the order
    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();
    res.send(order._id);
}));

// Handler for GET request to retrieve an order by its ID
router.get('/track/:id', asyncHandler(async (req, res) => {
    // Retrieve an order by its ID
    const order = await OrderModel.findById(req.params.id);
    res.send(order);
}));

// Export the router for use in other parts of the application
export default router;

// Helper function to get the new order for the current user
async function getNewOrderForCurrentUser(req: any) {
    return await OrderModel.findOne({ user: req.user.id, status: OrderStatus.NEW });
}
