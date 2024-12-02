import SettingsModel from "../models/SettingsData";
import { SettingsData } from "../models/SettingsData";

interface SettingsDataRepository {
    getSettingsData(repo: string, owner: string, pull_number: number): Promise<SettingsData | null>;
    createSettingsData(settingsData: SettingsData): Promise<SettingsData>;
    updateSettingsData(newSettingsData: SettingsData): Promise<SettingsData>;
    deleteSettingsData(repo: string, owner: string, pull_number: number): Promise<void>;
    listAllSettingsDataFromRepo(repo: string, owner: string): Promise<SettingsData[]>;
    listAllSettingsDataFromOwner(owner: string): Promise<SettingsData[]>;
  }

  class SettingsDataMongoRepository implements SettingsDataRepository {
    private db = SettingsModel;
  
    async getSettingsData(repo: string, owner: string, pull_number: number): Promise<SettingsData | null> {
      const settings = await this.db.findOne<SettingsData>(
        { repository: repo, owner, pull_number },
        { projection: { _id: 0 } }
      );
  
      if (!settings) throw new Error("Settings not found");
      console.log("Found: ", settings);
      return settings;
    }
  
    async createSettingsData(settingsData: SettingsData): Promise<SettingsData> {
      const settingsExists = await this.db.exists({
        repository: settingsData.repository,
        owner: settingsData.owner
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
      const { repository, owner, pull_number} = newSettingsData;
      const a = await this.db.updateOne({ repository, owner, pull_number }, { $set: newSettingsData });
  
      if (!a.acknowledged) throw new Error("Failed to update settings");
      console.log("Updated: ", newSettingsData);
      return newSettingsData;
    }
  
    async deleteSettingsData(repo: string, owner: string, pull_number: number): Promise<void> {
      await this.db.deleteOne({ repository: repo, owner, pull_number});
      console.log("Deleted: ", { repository: repo, owner, pull_number });
    }
  
    async listAllSettingsDataFromRepo(repo: string, owner: string): Promise<SettingsData[]> {
      const settings = await this.db.find<SettingsData>(
        { repository: repo, owner },
        { projection: { _id: 0 } }
      );
      console.log("Found: ", settings);
      return settings;
    }
  
    async listAllSettingsDataFromOwner(owner: string): Promise<SettingsData[]> {
      const settings = await this.db.find<SettingsData>({ owner }, { projection: { _id: 0 } });
      console.log("Found: ", settings);
      return settings;
    }
  }
  
  export { SettingsDataRepository, SettingsDataMongoRepository };
  