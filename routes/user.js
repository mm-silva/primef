const express = require('express');
const { 
    getUserInfo, 
    getAllUsers, 
    createUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/user');

const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
// Get all users
router.get('/', getAllUsers);

// Get a specific user's info
router.get('/info', getUserInfo);

// Create a new user
router.post('/', createUser);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);
// Define a rota para obter informações do usuário, chamando a função 'getUserInfo' do controlador de usuário
router.get('/info', getUserInfo);

// Exporta o roteador para ser usado em outras partes da aplicação
module.exports = router;
