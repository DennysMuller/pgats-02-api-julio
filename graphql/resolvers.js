const userService = require('../service/userService');
const transferService = require('../service/transferService');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'segredo';

const resolvers = {
  Query: {
    users: async () => userService.listUsers(),
    transfers: async () => transferService.listTransfers(),
  },
  Mutation: {
    login: async (_, { username, password }) => {
      // Simula login, adapte conforme sua lógica real
      if (username === 'julio' && password === '123456') {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        return { token };
      }
      throw new Error('Credenciais inválidas');
    },
    createTransfer: async (_, { from, to, value }, context) => {
      if (!context.user) throw new Error('Não autenticado');
      return transferService.transfer({ from, to, value });
    },
  },
};

module.exports = resolvers;
