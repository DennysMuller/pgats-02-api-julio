const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    username: String!
    favorecidos: [String]
    saldo: Int
  }

  type Transfer {
    from: String!
    to: String!
    value: Int!
    date: String
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    users: [User]
    transfers: [Transfer]
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload
    createTransfer(from: String!, to: String!, value: Int!): Transfer
  }
`;

module.exports = typeDefs;
