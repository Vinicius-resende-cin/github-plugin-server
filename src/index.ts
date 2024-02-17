import express from "express";
import { serverPort } from "./config";
import AnalysisController from "./controllers/analysisController";

const analysisController = new AnalysisController();

const app = express();
app.use(express.json());

app.get("/analysis", (req, res) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;
  const pull_number = req.query.pull_number as string;

  if (!owner) return res.status(400).send("Bad request: owner not provided");
  if (pull_number && !repo) return res.status(400).send("Bad request: repo not provided");

  if (owner && repo && pull_number) {
    return res.send(analysisController.getAnalysis(repo, owner, parseInt(pull_number)));
  } else if (owner && repo) {
    return res.send(analysisController.getAllAnalysisFromRepo(repo, owner));
  }
  return res.send(analysisController.getAllAnalysisFromOwner(owner));
});

// app.post("/analysis", (req, res) => {});
// app.put("/analysis", (req, res) => {});
// app.delete("/analysis", (req, res) => {});

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
