import adminModel from "../../model/users/admin_model.js";
import jwt from "jsonwebtoken";

// Sign Up Controller
export const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check for existing admin
      const existingAdmin = await adminModel.findOne({ email });
      if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });
  
      // Create new admin
      const newAdmin = new adminModel({ name, email, password });
      await newAdmin.save();
  
      const token = jwt.sign({ id: newAdmin._id }, 'your_jwt_secret', { expiresIn: '1d' });
  
      res.status(201).json({ message: 'Admin created successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
