import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Role, Status } from '../models/User';

// POST /api/v1/auth/register

export const register = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    // 1️⃣ Validate role (ADMIN not allowed)
    if (role === Role.ADMIN) {
      return res.status(400).json({ message: 'Invalid data: cannot register as ADMIN' });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Determine approval status
    let approved: Status = Status.APPROVED;
    if (role === Role.AUTHOR) {
      approved = Status.PENDING;
    }

    // 5️⃣ Create and save user
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      roles: [role],
      approved
    });

    await newUser.save();

    // 6️⃣ Remove password from response
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({
      message: 'User registered successfully',
      user: userData
    });

  } catch (error: any) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// // POST /api/v1/auth/login
// export const login = (req: Request, res: Response) => {
//   res.send('Login endpoint');
// };

// POST /api/v1/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 4️⃣ Check if user is approved (optional, for AUTHORs)
    if (user.approved === 'PENDING') {
      return res.status(403).json({ message: 'Your account is pending approval' });
    }

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // 6️⃣ Return user data without password
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error: any) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/v1/auth/me
export const getMe = (req: Request, res: Response) => {
  res.send('Get current user endpoint');
};


// POST /api/v1/auth/admin/register
export const adminRegister = (req: Request, res: Response) => {
  res.send('Admin register endpoint');
};
