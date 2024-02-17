import fs from "fs";
import { AnalysisOutput } from "../models/AnalysisOutput";

interface AnalysisOutputRepository {
  getAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<AnalysisOutput | null>;
  createAnalysisOutput(analysisOutput: AnalysisOutput): Promise<AnalysisOutput>;
  updateAnalysisOutput(newAnalysisOutput: AnalysisOutput): Promise<AnalysisOutput>;
  deleteAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<void>;
  listAllAnalysisFromRepo(repo: string, owner: string): Promise<AnalysisOutput[]>;
  listAllAnalysisFromOwner(owner: string): Promise<AnalysisOutput[]>;
}

class AnalysisOutputFileRepository implements AnalysisOutputRepository {
  private analysisOutputs: AnalysisOutput[];
  private analysisFileContent;

  constructor(filepath: string) {
    this.analysisFileContent = fs.existsSync(filepath) ? fs.readFileSync(filepath, "utf-8") : "[]";
    this.analysisOutputs = JSON.parse(this.analysisFileContent);
  }

  async getAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<AnalysisOutput | null> {
    return (
      this.analysisOutputs.find((analysisOutput) => analysisOutput.matches(owner, repo, pull_number)) || null
    );
  }

  async createAnalysisOutput(analysisOutput: AnalysisOutput): Promise<AnalysisOutput> {
    const analysisOutputExists = await this.getAnalysisOutput(
      analysisOutput.repository,
      analysisOutput.owner,
      analysisOutput.pull_number
    );

    if (analysisOutputExists) {
      return await this.updateAnalysisOutput(analysisOutput);
    } else {
      this.analysisOutputs.push(analysisOutput);
      return analysisOutput;
    }
  }

  async updateAnalysisOutput(newAnalysisOutput: AnalysisOutput): Promise<AnalysisOutput> {
    const index = this.analysisOutputs.findIndex((analysisOutput) =>
      analysisOutput.matches(
        newAnalysisOutput.owner,
        newAnalysisOutput.repository,
        newAnalysisOutput.pull_number
      )
    );

    if (index === -1) throw new Error("Analysis output not found");
    this.analysisOutputs[index] = newAnalysisOutput;
    return newAnalysisOutput;
  }

  async deleteAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<void> {
    this.analysisOutputs = this.analysisOutputs.filter(
      (analysisOutput) => !analysisOutput.matches(owner, repo, pull_number)
    );
  }

  async listAllAnalysisFromRepo(repo: string, owner: string): Promise<AnalysisOutput[]> {
    return this.analysisOutputs.filter((analysisOutput) => analysisOutput.matches(owner, repo));
  }

  async listAllAnalysisFromOwner(owner: string): Promise<AnalysisOutput[]> {
    return this.analysisOutputs.filter((analysisOutput) => analysisOutput.matches(owner));
  }
}

export { AnalysisOutputRepository, AnalysisOutputFileRepository };
