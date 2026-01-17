import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign({
        id: user._id,
        email: user.email

    },
        process.env.JWT_SECRET,
        { expiresIn: "7d" })
}


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: "All fields are required: name, email, password" 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                message: "Password must be at least 6 characters long" 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Please provide a valid email address" 
            });
        }

        // 1️⃣ Check if user already exists
        const existinguser = await User.findOne({ email })
        if (existinguser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        
        // 2️⃣ Hash the password
        const hashedpassword = await bcrypt.hash(password, 10)
        
        // 3️⃣ Create new user
        const user = await User.create({
            name,
            email,
            password: hashedpassword
        })
        
        const token = generateToken(user)

        return res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email },
            token
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

// ==================== LOGIN ====================

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required" 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        // 2️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: "User logged in successfully",
            user: { id: user._id, name: user.name, email: user.email },
            token,
        })

    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.log(error)
    }
}


/////logout

export const logout = (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.log(error)
    }
}

// ==================== GET ME ====================
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}