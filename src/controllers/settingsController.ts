import { persistenceType } from "../config";
import { SettingsDataMongoRepository, SettingsDataRepository } from "../data/SettingsRepository";
import { SettingsData, IASettingsData } from "../models/SettingsData";

let settingsDataRepository: SettingsDataRepository =
  persistenceType === "mongo" ? new SettingsDataMongoRepository() : new SettingsDataMongoRepository();

interface IASettingsController {
  getSettings: (repository: string, owner: string, pull_number: number) => Promise<SettingsData>;
  createSettings: (settings: IASettingsData) => Promise<SettingsData>;
  updateSettings: (settings: IASettingsData) => Promise<SettingsData>;
}

class SettingsController implements IASettingsController {
  async getSettings(repository: string, owner: string, pull_number: number): Promise<SettingsData> {
    return await settingsDataRepository.getSettingsData(repository, owner, pull_number);
  }

  async createSettings(settings: IASettingsData): Promise<SettingsData> {
    const newSettings = new SettingsData(settings);
    return await settingsDataRepository.createSettingsData(newSettings);
  }

  async updateSettings(settings: IASettingsData): Promise<SettingsData> {
    const newSettings = new SettingsData(settings);
    return await settingsDataRepository.updateSettingsData(newSettings);
  }
}

export default SettingsController;
