import { connect, ConnectOptions } from 'mongoose';

// Function to connect to MongoDB using Mongoose
export const dbConnect = () => {
    // Attempt to connect to the MongoDB database using the provided URI
    connect(process.env.MONGO_URI!, {
        /*  useNewUrlParser: true,
            useUnifiedTopology: true */
    } as ConnectOptions)
    .then(
        // If the connection is successful, log a success message
        () => console.log("Connected to the database successfully"),
        // If there is an error during connection, log the error
        (error) => console.error("Error connecting to the database:", error)
    );
};
