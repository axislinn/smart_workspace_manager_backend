import adminModel from "../../model/users/admin_model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Sign Up Controller
export const signup = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, role } = req.body;

        if (!name || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate role
        if (role !== 'admin') {
            return res.status(400).json({ message: 'Invalid role. Must be "admin"' });
        }

        // Check for existing admin
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

        // Create new admin
        const newAdmin = new adminModel({
            name,
            email,
            password,
            phoneNumber,
            role
        });
        await newAdmin.save();

        // Generate JWT
        const token = jwt.sign(
            { id: newAdmin._id, role: newAdmin.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Admin created successfully',
            token,
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role,
                phoneNumber: newAdmin.phoneNumber
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                phoneNumber: admin.phoneNumber
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
