import adminModel from "../../model/users/admin_model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Sign Up Controller
export const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check for existing admin
      const existingAdmin = await adminModel.findOne({ email });
      if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });
  
      // Create new admin (password hashing is handled in schema automatically)
      const newAdmin = new adminModel({ name, email, password });  // Don't hash here, let the schema handle it
      await newAdmin.save();
  
      // Generate JWT
      const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
  
      res.status(201).json({ message: 'Admin created successfully', token });
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
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
