import employeeModel from "../../model/users/employee_model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check for existing employee
      const existingEmployee = await employeeModel.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ message: 'Employee already exists' });
      }
  
      // Create new employee (password hashing will be handled in the schema automatically)
      const newEmployee = new employeeModel({name,email,password}); // Don't hash the password here, let the schema handle it

      await newEmployee.save();
  
      // Generate JWT
      const token = jwt.sign({ id: newEmployee._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
  
      res.status(201).json({ message: 'Employee created successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      // Check for employee existence
      const employee = await employeeModel.findOne({ email });
      if (!employee) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      // Generate JWT
      const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };