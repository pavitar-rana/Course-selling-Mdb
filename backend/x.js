const express = require("express");
const app = express();
app.use(express.json());

const port = 3000;

app.post("/", (req, res) => {
  const n1 = req.body.n1;

  var sum = 0;

  for (let i = 0; i < n1; i++) {
    sum += i;
  }

  res.send(`The sum of ${n1} is ${sum}`);
});

const user = {
  name: "John",
  age: 30,
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
