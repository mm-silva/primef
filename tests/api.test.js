const http = require('http');
const https = require('https');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:5000';
let token = '';
let userId = '';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
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
          body: responseBody
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
      username: "testduser",
      email: "testusedr@example.com",
      phone: "123456",
      password: "123456"
    });
    console.log(`Status: ${registerResponse.statusCode}`);
    console.log(`Resposta: ${registerResponse.body}`);

    // Teste de login
    console.log('\nTestando login...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      username: "testuser@example.com",
      password: "123456"
    });
    console.log(`Status: ${loginResponse.statusCode}`);
    const loginData = JSON.parse(loginResponse.body);
    token = loginData.token;
    console.log(`Token obtido: ${token}`);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

console.log(decoded);
    // Teste de OPTIONS para subscrição de plano
    console.log('\nTestando OPTIONS para subscrição de plano...');
    const optionsResponse = await makeRequest('OPTIONS', '/api/plans/subscribe');
    console.log(`Status: ${optionsResponse.statusCode}`);
    console.log(`Corpo da resposta: ${JSON.stringify(optionsResponse.body)}`);

    // Teste de atualização de usuário
    console.log('\nTestando atualização de usuário...');
    const updateResponse = await makeRequest('PUT', '/api/user/' + decoded.userId, {
      username: "updateduser",
      email: "updated@example.com",
      phone: "987654321",
      planName: "plano A e B",
      planDescription: "Tem tudo",
      permission: 1
    });
    console.log(`Status: ${updateResponse.statusCode}`);
    console.log(`Resposta: ${updateResponse.body}`);

    // Teste de obtenção de informações do usuário
    console.log('\nTestando obtenção de informações do usuário...');
    const userInfoResponse = await makeRequest('GET', '/api/user/info?userId=' + decoded.userId);
    console.log(`Status: ${userInfoResponse.statusCode}`);
    console.log(`Informações do usuário: ${userInfoResponse.body}`);

    console.log('\nTodos os testes concluídos!');
  } catch (error) {
    console.error('Erro durante os testes:', error);
  }
}

runTests();