import express from 'express';
import cors from 'cors';
import connectToMongoDB from './db_connection/mongoConnect.js';
import adminRoutes from './route/users/admin_route.js';
import employeeRoutes from './route/users/employee_route.js';

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToMongoDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);

// Sample Route
app.get('/', (req, res) => {
  res.send('Node.js API is running...');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
