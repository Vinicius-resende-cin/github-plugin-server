import RepoModel from "../models/RegisteredRepo";
import { RegisteredRepo } from "../models/RegisteredRepo";

interface RegisteredRepoRepository {
  createRepoData(repoData: RegisteredRepo): Promise<RegisteredRepo>;
  updateRepoData(newRepoData: RegisteredRepo): Promise<RegisteredRepo>;
}

class RegisteredRepoMongoRepository implements RegisteredRepoRepository {
  private db = RepoModel;

  async createRepoData(repoData: RegisteredRepo): Promise<RegisteredRepo> {
    const settingsExists = await this.db.exists({
      owner: repoData.owner,
      repository: repoData.repo
    });

    if (settingsExists) {
      return await this.updateRepoData(repoData);
    } else {
      await this.db.create<RegisteredRepo>(repoData);
    }

    console.log("Created: ", repoData);
    return repoData;
  }

  async updateRepoData(newRepoData: RegisteredRepo): Promise<RegisteredRepo> {
    const { owner, repo } = newRepoData;
    const a = await this.db.updateOne({ owner, repo }, { $set: newRepoData });

    if (!a.acknowledged) throw new Error("Failed to update settings");
    console.log("Updated: ", newRepoData);
    return newRepoData;
  }
}

export { RegisteredRepoRepository, RegisteredRepoMongoRepository };
