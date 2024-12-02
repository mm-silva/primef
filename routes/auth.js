const express = require('express');
const { register, login } = require('../controllers/auth');

// Cria uma instância do roteador do Express
const router = express.Router();

// Define a rota para o registro de novos usuários, chamando a função 'register' do controlador de autenticação
router.post('/register', register);

// Define a rota para o login de usuários, chamando a função 'login' do controlador de autenticação
router.post('/login', login);


// Update a user (admin only)
router.patch('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (req.body.username != null) {
        user.username = req.body.username;
      }
      if (req.body.email != null) {
        user.email = req.body.email;
      }
      if (req.body.password != null) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      if (req.body.isAdmin != null) {
        user.isAdmin = req.body.isAdmin;
      }
  
      const updatedUser = await user.save();
      res.json({ 
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete a user (admin only)
  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.remove();
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

// Exporta o roteador para ser usado em outras partes da aplicação
module.exports = router;
