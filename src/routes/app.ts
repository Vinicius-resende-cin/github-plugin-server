import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import AnalysisController from "../controllers/analysisController";
import { IAnalysisOutput } from "../models/AnalysisOutput";
import { connectionString } from "../config";
import SettingsController from "../controllers/settingsController";
import { IASettingsData } from "../models/SettingsData";
import { IRegisteredRepo } from "../models/RegisteredRepo";
import RepoModel from "../models/RegisteredRepo";

// Database connection
mongoose.connect(connectionString, {
  dbName: "analysisOutputs"
});
const db = mongoose.connection;

db.on("error", (err) => console.log(err));
db.once("connected", () => console.log("Connected to database"));

const analysisController = new AnalysisController();
const settingsController = new SettingsController();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Analysis endpoint

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

// GET: Search Settings
app.get("/settings", async (req, res) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;
  const pull_number = req.query.pull_number as string;

  try {
    const existingSettings = await settingsController.getSettings(repo, owner, parseInt(pull_number));
    if (existingSettings) {
      res.status(200).json(existingSettings);
      console.log(`Found settings for ${owner}/${repo}#${pull_number}`);
    } else {
      console.log(`Settings not found for ${owner}/${repo}#${pull_number}`);
      res.status(404).send("Settings not found.");
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send("Settings not found");
  }
});

// POST: Create new settings
app.post("/settings", async (req, res) => {
  if (!req.body.settings) return res.status(400).send("Bad request: settings not provided");

  const settings: IASettingsData = req.body.settings;

  try {
    const createdSettings = await settingsController
      .createSettings(settings)
      .then((settings) => JSON.stringify(settings));

    res.send(createdSettings);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Settings not created");
  }
});

// PUT: Update settings
app.put("/settings", async (req, res) => {
  if (!req.body.settings) return res.status(400).send("Bad request: settings not provided");

  const settings: IASettingsData = req.body.settings;

  try {
    const updatedSettings = await settingsController
      .updateSettings(settings)
      .then((settings) => JSON.stringify(settings));

    res.send(updatedSettings);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Settings not updated");
  }
});

// Repos endpoint

app.get("/repos", async (req, res) => {
  const owner = req.query.owner as string;
  const repo = req.query.repo as string;

  if (!owner) return res.status(400).send("Bad request: owner not provided");
  if (!repo) return res.status(400).send("Bad request: repo not provided");

  try {
    const registeredRepo = await RepoModel.findOne({ owner, repo });
    if (!registeredRepo) return res.status(404).send("Repo not found");
    console.log(`Repo ${repo} from ${owner} found`);
    return res.send(registeredRepo);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

app.post("/repos", async (req, res) => {
  if (!req.body.repo) return res.status(400).send("Bad request: repo not provided");

  const repo: IRegisteredRepo = req.body.repo;

  try {
    console.log(`Creating repo ${repo.repo} from ${repo.owner}`);
    const createdRepo = await RepoModel.create(repo).then((repo) => JSON.stringify(repo));

    res.send(createdRepo);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Repo not created");
  }
});

export default app;
