const mongoose = require("mongoose");
import { model } from "mongoose";

interface IASettingsData {
  uuid: string;
  repository: string;
  owner: string;
  pull_number: number;
  mainClass: String;
  mainMethod: String;
  baseClass?: String;
}

class SettingsData implements IASettingsData {
  uuid: string;
  repository: string;
  owner: string;
  pull_number: number;
  mainClass: String;
  mainMethod: String;
  baseClass?: String;

  constructor(settings: IASettingsData) {
    this.uuid = settings.uuid;
    this.repository = settings.repository;
    this.owner = settings.owner;
    this.pull_number = settings.pull_number;
    this.mainClass = settings.mainClass;
    this.mainMethod = settings.mainMethod;
    this.baseClass = settings.baseClass;
  }
}

const settingsSchema = new mongoose.Schema(
  {
    uuid: String,
    owner: {
      type: String,
      required: true,
      trim: true
    },
    repository: {
      type: String,
      required: true,
      trim: true
    },
    pull_number: {
      type: Number,
      required: true,
      trim: true
    },
    mainClass: {
      type: String,
      required: true,
      trim: true
    },
    mainMethod: {
      type: String,
      required: true,
      trim: true
    },
    baseClass: {
      type: String,
      required: false,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const SettingsModel = model<SettingsData>("Settings", settingsSchema);

export { IASettingsData, SettingsData };
export default SettingsModel;
