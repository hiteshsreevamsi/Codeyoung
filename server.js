const express = require("express");
const app = express();

app.use(express.json({ extended: false }));
app.get("/", (req, res) => {
  res.send("Api success");
});
const PORT = process.env.PORT || 4000;
app.use("/translate", require("./api/translate"));
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
