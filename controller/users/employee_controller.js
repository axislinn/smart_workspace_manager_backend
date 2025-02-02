import employeeModel from "../../model/users/employee_model.js";
import jwt from "jsonwebtoken";

// Sign Up Controller
export const signup = async (req, res) => {
    try {
      const { name, email, password, position } = req.body;
  
      // Check for existing employee
      const existingEmployee = await employeeModel.findOne({ email });
      if (existingEmployee) return res.status(400).json({ message: 'Employee already exists' });
  
      // Create new employee
      const newEmployee = new employeeModel({ name, email, password, position });
      await newEmployee.save();
  
      const token = jwt.sign({ id: newEmployee._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
  
      res.status(201).json({ message: 'Employee created successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
