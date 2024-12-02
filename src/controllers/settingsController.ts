import { persistenceType } from "../config";
import { SettingsDataMongoRepository, SettingsDataRepository } from "../data/SettingsRepository";
import { SettingsData, IASettingsData } from "../models/SettingsData";

let settingsDataRepository: SettingsDataRepository =
  persistenceType === "mongo" ? new SettingsDataMongoRepository() : new SettingsDataMongoRepository();

interface IASettingsController {
  getSettings: (repo: string, owner: string, pull_number: number) => Promise<SettingsData | null>;
  getAllSettingsFromRepo: (repo: string, owner: string) => Promise<SettingsData[]>;
  getAllSettingsFromOwner: (owner: string) => Promise<SettingsData[]>;
  createSettings: (settings: IASettingsData) => Promise<SettingsData>;
  updateSettings: (settings: IASettingsData) => Promise<SettingsData>;
  deleteSettings: (repo: string, owner: string, pull_number: number) => Promise<void>;
}

class SettingsController implements IASettingsController {
  async getSettings(repo: string, owner: string, pull_number: number): Promise<SettingsData | null> {
    return await settingsDataRepository.getSettingsData(repo, owner, pull_number);
  }

  async getAllSettingsFromRepo(repo: string, owner: string): Promise<SettingsData[]> {
    return await settingsDataRepository.listAllSettingsDataFromRepo(repo, owner);
  }

  async getAllSettingsFromOwner(owner: string): Promise<SettingsData[]> {
    return await settingsDataRepository.listAllSettingsDataFromOwner(owner);
  }

  async createSettings(settings: IASettingsData): Promise<SettingsData> {
    const newSettings = new SettingsData(settings);
    return await settingsDataRepository.createSettingsData(newSettings);
  }

  async updateSettings(settings: IASettingsData): Promise<SettingsData> {
    const newSettings = new SettingsData(settings);
    return await settingsDataRepository.updateSettingsData(newSettings);
  }

  async deleteSettings(repo: string, owner: string, pull_number: number): Promise<void> {
    return await settingsDataRepository.deleteSettingsData(repo, owner, pull_number);
  }
}

export default SettingsController;
