const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`GraphQL API rodando em http://localhost:${PORT}/graphql`);
});
