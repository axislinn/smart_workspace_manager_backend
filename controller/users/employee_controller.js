import employeeModel from "../../model/users/employee_model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Sign Up Controller
export const signup = async (req, res) => {
    try {
        const { name, email, password, department, phoneNumber } = req.body;

        if (!name || !email || !password || !department || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for existing employee
        const existingEmployee = await employeeModel.findOne({ email });
        if (existingEmployee) return res.status(400).json({ message: 'Employee already exists' });

        // Create new employee
        const newEmployee = new employeeModel({
            name,
            email,
            password,
            department,
            phoneNumber,
            role: 'employee'
        });
        await newEmployee.save();

        // Generate JWT
        const token = jwt.sign(
            { id: newEmployee._id, role: newEmployee.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Employee created successfully',
            token,
            employee: {
                id: newEmployee._id,
                name: newEmployee.name,
                email: newEmployee.email,
                role: newEmployee.role,
                department: newEmployee.department,
                phoneNumber: newEmployee.phoneNumber
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

        const employee = await employeeModel.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: "Invalid email" });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: employee._id, role: employee.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                department: employee.department,
                phoneNumber: employee.phoneNumber
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};