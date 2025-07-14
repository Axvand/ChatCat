import path from "path";
const __dirname = path.resolve();

export default (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "../src/pages/sala.html"));
};
