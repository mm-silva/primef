const http = require('http');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:5000';
let token = '';
let userId = '';

process.env.JWT_SECRET = 'e3d6f8d9f2b9c7a5a0e9f7c2b8a4d1c3e7b5d8f2b6a3e9f0a8c7d2f5e1b9a3c4';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseBody,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  try {
    console.log('Iniciando testes...');

    // Teste de registro de usuário
    console.log('\nTestando registro de usuário...');
    const registerResponse = await makeRequest('POST', '/api/auth/register', {
      username: 'testuser',
      email: 'testuser@example.com',
      phone: '123456',
      password: '123456',
    });
    console.log(`Status: ${registerResponse.statusCode}`);
    console.log(`Resposta: ${registerResponse.body}`);

    // Teste de login
    console.log('\nTestando login...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      username: 'testuser@example.com',
      password: '123456',
    });
    console.log(`Status: ${loginResponse.statusCode}`);

    let loginData;
    try {
      loginData = JSON.parse(loginResponse.body);
      token = loginData.token;
      console.log(`Token obtido: ${token}`);
    } catch (err) {
      throw new Error('Erro ao processar resposta de login: ' + loginResponse.body);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;

    // Teste de OPTIONS para subscrição de plano
    console.log('\nTestando OPTIONS para subscrição de plano...');
    const optionsResponse = await makeRequest('OPTIONS', '/api/plans/subscribe');
    console.log(`Status: ${optionsResponse.statusCode}`);
    console.log(`Corpo da resposta: ${optionsResponse.body || '""'}`);

    // Teste de atualização de usuário
    console.log('\nTestando atualização de usuário...');
    const updateResponse = await makeRequest('PUT', `/api/user/${userId}`, {
      username: 'updateduser',
      email: 'update@example.com',
      phone: '987654321',
      planName: 'Plano A e B',
      planDescription: 'Tem tudo',
      permission: true,
    });
    console.log(`Status: ${updateResponse.statusCode}`);
    console.log(`Resposta: ${updateResponse.body}`);

    // Teste de obtenção de informações do usuário
    console.log('\nTestando obtenção de informações do usuário...');
    const userInfoResponse = await makeRequest('GET', `/api/user/info?userId=${userId}`);
    console.log(`Status: ${userInfoResponse.statusCode}`);
    console.log(`Informações do usuário: ${userInfoResponse.body}`);

    // Teste de criação de um novo plano
    console.log('\nTestando criação de um novo plano...');
    const createPlanResponse = await makeRequest('POST', '/api/plans', {
      name: 'Plano Premium',
      description: 'Acesso a todos os recursos.',
      price: 99.99,
    });
    console.log(`Status: ${createPlanResponse.statusCode}`);
    console.log(`Resposta: ${createPlanResponse.body}`);
    const createdPlan = JSON.parse(createPlanResponse.body);

    // Teste de atualização de plano
    console.log('\nTestando atualização de um plano...');
    const updatePlanResponse = await makeRequest('PATCH', `/api/plans/${createdPlan._id}`, {
      name: 'Plano Premium Atualizado',
      description: 'Acesso total com benefícios adicionais.',
      price: 149.99,
    });
    console.log(`Status: ${updatePlanResponse.statusCode}`);
    console.log(`Resposta: ${updatePlanResponse.body}`);

    // Teste de exclusão de plano
    console.log('\nTestando exclusão de um plano...');
    const deletePlanResponse = await makeRequest('DELETE', `/api/plans/${createdPlan._id}`);
    console.log(`Status: ${deletePlanResponse.statusCode}`);
    console.log(`Resposta: ${deletePlanResponse.body}`);

    console.log('\nTodos os testes concluídos!');
  } catch (error) {
    console.error('Erro durante os testes:', error.message);
  }
}

runTests();
