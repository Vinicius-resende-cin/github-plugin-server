import { persistenceType } from "../config";
import { RegisteredRepoMongoRepository, RegisteredRepoRepository } from "../data/RepoRepository";
import { RegisteredRepo, IRegisteredRepo } from "../models/RegisteredRepo";

let repoRepository: RegisteredRepoRepository = new RegisteredRepoMongoRepository();

interface IRepoController {
  createSettings: (settings: IRegisteredRepo) => Promise<RegisteredRepo>;
  updateSettings: (settings: IRegisteredRepo) => Promise<RegisteredRepo>;
}

class RepoController implements IRepoController {
  async createSettings(settings: IRegisteredRepo): Promise<RegisteredRepo> {
    const newSettings = new RegisteredRepo(settings);
    return await repoRepository.createRepoData(newSettings);
  }

  async updateSettings(repo: IRegisteredRepo): Promise<RegisteredRepo> {
    const newSettings = new RegisteredRepo(repo);
    return await repoRepository.updateRepoData(newSettings);
  }
}

export default RepoController;
