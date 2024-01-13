require("dotenv").config();
const express = require("express");

const cors = require("cors");
const routes = require("./routes");

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use("/", routes);

app.listen(port, () => {
  console.log(
    `Redmine request router app listening at http://localhost:${port}`
  );
});
