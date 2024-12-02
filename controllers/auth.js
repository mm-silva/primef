const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Função para registrar um novo usuário
const register = async (req, res) => {
    const { username, password, email, phone } = req.body;
    try {
        // Criptografa a senha antes de armazená-la no banco de dados
        const hashedPassword = await bcrypt.hash(password, 10);
        // Cria um novo documento de usuário com as informações fornecidas
        const user = new User({ username, password: hashedPassword, email, phone, permission: false });
        // Salva o novo usuário no banco de dados
        await user.save();
        // Responde com sucesso
        res.status(201).send('Usuário registrado com sucesso!');
    } catch (error) {
        // Responde com erro em caso de falha
        res.status(400).send('Erro ao registrar usuário.');
    }
};

// Função para realizar o login do usuário
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const email = username;
        // Busca o usuário no banco de dados pelo nome de usuário
        const user = await User.findOne({ email });
        // Verifica se o usuário existe e se a senha fornecida é correta
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Credenciais inválidas.');
        }
        // Gera um token JWT para o usuário autenticado
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Retorna o token JWT como resposta
        res.json({ token });
    } catch (error) {
        // Responde com erro em caso de falha
        res.status(500).send('Erro ao fazer login.');
    }
};

module.exports = { register, login };
