const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Node.js Backend!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
