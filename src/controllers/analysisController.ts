import { persistenceType } from "../config";
import { AnalysisOutputMongoRepository, AnalysisOutputRepository } from "../data/AnalysisOutputRepository";
import { AnalysisOutput, IAnalysisOutput } from "../models/AnalysisOutput";

let analysisOutputRepository: AnalysisOutputRepository =
  persistenceType === "mongo" ? new AnalysisOutputMongoRepository() : new AnalysisOutputMongoRepository();

interface IAnalysisController {
  getAnalysis: (repo: string, owner: string, pull_number: number) => Promise<AnalysisOutput | null>;
  getAllAnalysisFromRepo: (repo: string, owner: string) => Promise<AnalysisOutput[]>;
  getAllAnalysisFromOwner: (owner: string) => Promise<AnalysisOutput[]>;
  createAnalysis: (analysis: IAnalysisOutput) => Promise<AnalysisOutput>;
  updateAnalysis: (analysis: IAnalysisOutput) => Promise<AnalysisOutput>;
  deleteAnalysis: (repo: string, owner: string, pull_number: number) => Promise<void>;
}

class AnalysisController implements IAnalysisController {
  async getAnalysis(repo: string, owner: string, pull_number: number): Promise<AnalysisOutput | null> {
    return await analysisOutputRepository.getAnalysisOutput(repo, owner, pull_number);
  }

  async getAllAnalysisFromRepo(repo: string, owner: string): Promise<AnalysisOutput[]> {
    return await analysisOutputRepository.listAllAnalysisFromRepo(repo, owner);
  }

  async getAllAnalysisFromOwner(owner: string): Promise<AnalysisOutput[]> {
    return await analysisOutputRepository.listAllAnalysisFromOwner(owner);
  }

  async createAnalysis(analysis: IAnalysisOutput): Promise<AnalysisOutput> {
    const newAnalysis = new AnalysisOutput(analysis);
    return await analysisOutputRepository.createAnalysisOutput(newAnalysis);
  }

  async updateAnalysis(analysis: IAnalysisOutput): Promise<AnalysisOutput> {
    const newAnalysis = new AnalysisOutput(analysis);
    return await analysisOutputRepository.updateAnalysisOutput(newAnalysis);
  }

  async deleteAnalysis(repo: string, owner: string, pull_number: number): Promise<void> {
    return await analysisOutputRepository.deleteAnalysisOutput(repo, owner, pull_number);
  }
}

export default AnalysisController;
