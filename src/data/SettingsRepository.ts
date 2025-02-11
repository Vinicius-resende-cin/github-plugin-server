import SettingsModel from "../models/SettingsData";
import { SettingsData } from "../models/SettingsData";

interface SettingsDataRepository {
  getSettingsData(repository: string, owner: string, pull_number: number): Promise<SettingsData>;
  createSettingsData(settingsData: SettingsData): Promise<SettingsData>;
  updateSettingsData(newSettingsData: SettingsData): Promise<SettingsData>;
}

class SettingsDataMongoRepository implements SettingsDataRepository {
  private db = SettingsModel;

  async getSettingsData(repository: string, owner: string, pull_number: number): Promise<SettingsData> {
    const settingsData = await this.db.findOne({ repository, owner, pull_number });
    if (!settingsData) throw new Error("Settings not found");
    return settingsData;
  }

  async createSettingsData(settingsData: SettingsData): Promise<SettingsData> {
    const settingsExists = await this.db.exists({
      repository: settingsData.repository,
      owner: settingsData.owner,
      pull_number: settingsData.pull_number
    });

    if (settingsExists) {
      return await this.updateSettingsData(settingsData);
    } else {
      await this.db.create<SettingsData>(settingsData);
    }

    console.log("Created: ", settingsData);
    return settingsData;
  }

  async updateSettingsData(newSettingsData: SettingsData): Promise<SettingsData> {
    const { repository, owner, pull_number } = newSettingsData;
    const a = await this.db.updateOne({ repository, owner, pull_number }, { $set: newSettingsData });

    if (!a.acknowledged) throw new Error("Failed to update settings");
    console.log("Updated: ", newSettingsData);
    return newSettingsData;
  }
}

export { SettingsDataRepository, SettingsDataMongoRepository };
