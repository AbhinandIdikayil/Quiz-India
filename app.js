const express = require("express")

const app = express();

// Server setup
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);