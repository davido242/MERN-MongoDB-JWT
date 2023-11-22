const app = require('./app');
const http = require("http");

const server = http.createServer(app);


const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
})