import express from "express";
import AnalysisController from "../controllers/analysisController";
import { IAnalysisOutput } from "../models/AnalysisOutput";
import mongoose from "mongoose";
import { connectionString } from "../config";

// Database connection
mongoose.connect(connectionString, {
  dbName: "analysisOutputs"
});
const db = mongoose.connection;

db.on("error", (err) => console.log(err));
db.once("connected", () => console.log("Connected to database"));

const analysisController = new AnalysisController();

const app = express();
app.use(express.json());

app.get("/analysis", async (req, res) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;
  const pull_number = req.query.pull_number as string;

  if (!owner) return res.status(400).send("Bad request: owner not provided");
  if (pull_number && !repo) return res.status(400).send("Bad request: repo not provided");

  try {
    let analysis: string;
    if (owner && repo && pull_number) {
      analysis = await analysisController
        .getAnalysis(repo, owner, parseInt(pull_number))
        .then((analysis) => JSON.stringify(analysis));
    } else if (owner && repo) {
      analysis = await analysisController
        .getAllAnalysisFromRepo(repo, owner)
        .then((analysis) => JSON.stringify(analysis));
    } else {
      analysis = await analysisController
        .getAllAnalysisFromOwner(owner)
        .then((analysis) => JSON.stringify(analysis));
    }
    return res.send(analysis);
  } catch (error) {
    console.log(error);
    return res.status(404).send("Analysis not found");
  }
});

app.post("/analysis", async (req, res) => {
  if (!req.body.analysis) return res.status(400).send("Bad request: analysis not provided");

  const analysis: IAnalysisOutput = req.body.analysis;

  try {
    const createdAnalysis = await analysisController
      .createAnalysis(analysis)
      .then((analysis) => JSON.stringify(analysis));

    res.send(createdAnalysis);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Analysis not created");
  }
});

app.put("/analysis", async (req, res) => {
  if (!req.body.analysis) return res.status(400).send("Bad request: analysis not provided");

  const analysis: IAnalysisOutput = req.body.analysis;

  try {
    const updatedAnalysis = await analysisController
      .updateAnalysis(analysis)
      .then((analysis) => JSON.stringify(analysis));

    res.send(updatedAnalysis);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Analysis not updated");
  }
});

app.delete("/analysis", async (req, res) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;
  const pull_number = req.query.pull_number as string;

  if (!owner) return res.status(400).send("Bad request: owner not provided");
  if (pull_number && !repo) return res.status(400).send("Bad request: repo not provided");

  try {
    await analysisController
      .deleteAnalysis(repo, owner, parseInt(pull_number))
      .then((analysis) => JSON.stringify(analysis));

    return res.send();
  } catch (error) {
    console.log(error);
    return res.status(404).send("Analysis not found");
  }
});

export default app;
