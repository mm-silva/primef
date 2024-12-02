const express = require('express');
const { getPlans, subscribe, changePlan, associatePlan } = require('../controllers/plan');
const Plan = require('../models/plan');
const authMiddleware = require('../middleware/auth');
const checkAdmin = require('../middleware/checkAdmin');
const router = express.Router();


// Define a rota para obter todos os planos, chamando a função 'getPlans' do controlador de planos
router.get('/', getPlans);

router.use(authMiddleware);

// Define a rota para assinar um plano, chamando a função 'subscribe' do controlador de planos
router.post('/subscribe', subscribe);

// Define a rota para alterar o plano do usuário, chamando a função 'changePlan' do controlador de planos
// router.post('/change-plan', changePlan);

// Define a rota para associar um plano ao usuário, chamando a função 'associatePlan' do controlador de planos
router.post('/associate', associatePlan);

router.use(checkAdmin);

router.post('/', async (req, res) => {
    const plan = new Plan({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    });
  
    try {
      const newPlan = await plan.save();
      res.status(201).json(newPlan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.patch('/:id', async (req, res) => {
    try {
      const plan = await Plan.findById(req.params.id);
      if (plan == null) {
        return res.status(404).json({ message: 'Plan not found' });
      }
  
      if (req.body.name != null) {
        plan.name = req.body.name;
      }
      if (req.body.description != null) {
        plan.description = req.body.description;
      }
      if (req.body.price != null) {
        plan.price = req.body.price;
      }
      if (req.body.features != null) {
        plan.features = req.body.features;
      }
  
      const updatedPlan = await plan.save();
      res.json(updatedPlan);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  router.delete('/:id', async (req, res) => {
    try {
      const plan = await Plan.findById(req.params.id);
      if (plan == null) {
        return res.status(404).json({ message: 'Plan not found' });
      }
  
      await plan.remove();
      res.json({ message: 'Plan deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Exporta o roteador para ser usado em outras partes da aplicação
module.exports = router;
