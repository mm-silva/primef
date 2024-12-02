const User = require('../models/user');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Get a specific user's info
const getUserInfo = async (req, res) => {
    const { userId } = req.query;
    try {
        const user = await User.findById(userId).populate('plan').select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const userInfo = {
            name: user.username,
            email: user.email,
            phone: user.phone,
            planName: user.plan ? user.plan.name : null,
            planDescription: user.plan ? user.plan.description : null,
            permission: user.permission || false
        };

        res.json(userInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user info', error: error.message });
    }
};

// Create a new user
const createUser = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;
        const newUser = new User({ username, email, password, phone });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Prevent updating the password through this route
        delete updateData.password;

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

module.exports = { 
    getUserInfo, 
    getAllUsers, 
    createUser, 
    updateUser, 
    deleteUser 
};

