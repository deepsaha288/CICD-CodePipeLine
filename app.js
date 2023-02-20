const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("its work relly good!"));

app.get("/health", (req, res) => {
  res.status(200);
  res.send("my load balancer is healthy now");
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
