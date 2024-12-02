const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Supondo que o modelo de usuário esteja em 'models/user'

const checkAdmin = async (req, res, next) => {
  try {
    // Obter o token do cabeçalho 'Authorization'
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 'JWT_SECRET' é a chave secreta do JWT
    const user = await User.findById(decoded.id); // Encontrar o usuário no banco de dados

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se o campo 'permission' do usuário é igual a 1 (admin)
    if (user.permission !== 1) {
      return res.status(403).json({ message: 'Acesso negado. Usuário não é administrador.' });
    }

    // Se for admin, permite o acesso à rota
    req.user = user; // Adiciona o usuário à requisição (se necessário para a rota)
    next(); // Chama o próximo middleware ou a função da rota

  } catch (err) {
    return res.status(500).json({ message: 'Erro no servidor. Não foi possível verificar o admin.' });
  }
};

module.exports = checkAdmin;
