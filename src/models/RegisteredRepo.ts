const mongoose = require("mongoose");
import { model } from "mongoose";

interface IRegisteredRepo {
  owner: string;
  repo: string;
}

class RegisteredRepo implements IRegisteredRepo {
  owner: string;
  repo: string;

  constructor(settings: IRegisteredRepo) {
    this.owner = settings.owner;
    this.repo = settings.repo;
  }
}

const repoSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      trim: true
    },
    repo: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const RepoModel = model<RegisteredRepo>("Repo", repoSchema);

export { IRegisteredRepo, RegisteredRepo };
export default RepoModel;
