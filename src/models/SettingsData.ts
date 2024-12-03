const mongoose = require('mongoose');
import { model } from "mongoose";


interface IASettingsData {
  uuid: string;
  repository: string;
  owner: string;
  pull_number: number;
  baseClass: String;
  mainMethod: String;
}

class SettingsData implements IASettingsData {
  uuid: string;
  repository: string;
  owner: string;
  pull_number: number;
  baseClass: String;
  mainMethod: String;

  constructor(settings: IASettingsData) {
    this.uuid = settings.uuid;
    this.repository = settings.repository;
    this.owner = settings.owner;
    this.pull_number = settings.pull_number;
    this.baseClass = settings.baseClass;
    this.mainMethod = settings.mainMethod;
  }
}

const settingsSchema = new mongoose.Schema({
  uuid: String,
  owner: {
    type: String,
    required: true,
    trim: true,
  },
  repository: {
    type: String,
    required: true,
    trim: true,
  },
  pull_number: {
    type: Number,
    required: true,
    trim: true
  },
  baseClass: {
    type: String,
    required: true,
    trim: true,
  },
  mainMethod: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

const SettingsModel = model<SettingsData>("Settings", settingsSchema);

export { IASettingsData, SettingsData };
export default SettingsModel;
