import User from '../Models/User.js';

// Controller for adding a new user
export const addUser = async (req, res) => {
    try {
        const { username, email, password, mobile, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = new User({ username, email, password, mobile, role });
        await newUser.save();

        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email including the password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        // Convert user to an object and delete the password field
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};



// Controller for deleting a user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Controller for getting all users with pagination
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const users = await User.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();;

        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({ users, totalPages, currentPage: page, totalUsers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Controller for updating a user, including password update if changed
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, password, mobile, role } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only update fields if they are provided in the request
        if (username) user.username = username;
        if (email) user.email = email;
        if (mobile) user.mobile = mobile;
        if (role) user.role = role;
        if (password) user.password = password; // Trigger the password hash in pre-save

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};
