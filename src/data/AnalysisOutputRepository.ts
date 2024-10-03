import AnalysisModel from "../models/AnalysisOutput";
import { AnalysisOutput } from "../models/AnalysisOutput";

interface AnalysisOutputRepository {
  getAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<AnalysisOutput | null>;
  createAnalysisOutput(analysisOutput: AnalysisOutput): Promise<AnalysisOutput>;
  updateAnalysisOutput(newAnalysisOutput: AnalysisOutput): Promise<AnalysisOutput>;
  deleteAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<void>;
  listAllAnalysisFromRepo(repo: string, owner: string): Promise<AnalysisOutput[]>;
  listAllAnalysisFromOwner(owner: string): Promise<AnalysisOutput[]>;
}

/* FileRepository deprecated in favor of MongoDB

class AnalysisOutputFileRepository implements AnalysisOutputRepository {
  private analysisOutputs: AnalysisOutput[];
  private analysisFileContent: string;

  constructor(filepath: string) {
    this.analysisFileContent = fs.existsSync(filepath) ? fs.readFileSync(filepath, "utf-8") : "[]";
    this.analysisOutputs = JSON.parse(this.analysisFileContent);
  }

  async getAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<AnalysisOutput | null> {
    return (
      this.analysisOutputs.find((analysisOutput) =>
        analysisMatches(analysisOutput, owner, repo, pull_number)
      ) || null
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
      analysisMatches(
        analysisOutput,
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
      (analysisOutput) => !analysisMatches(analysisOutput, owner, repo, pull_number)
    );
  }

  async listAllAnalysisFromRepo(repo: string, owner: string): Promise<AnalysisOutput[]> {
    return this.analysisOutputs.filter((analysisOutput) => analysisMatches(analysisOutput, owner, repo));
  }

  async listAllAnalysisFromOwner(owner: string): Promise<AnalysisOutput[]> {
    return this.analysisOutputs.filter((analysisOutput) => analysisMatches(analysisOutput, owner));
  }
}
*/

class AnalysisOutputMongoRepository implements AnalysisOutputRepository {
  private db = AnalysisModel;

  async getAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<AnalysisOutput | null> {
    const analysis = await this.db.findOne<AnalysisOutput>(
      { repository: repo, owner, pull_number },
      { projection: { _id: 0 } }
    );

    if (!analysis) throw new Error("Analysis output not found");
    console.log("Found: ", analysis);
    return analysis;
  }

  async createAnalysisOutput(analysisOutput: AnalysisOutput): Promise<AnalysisOutput> {
    const analysisExists = await this.db.exists({
      repository: analysisOutput.repository,
      owner: analysisOutput.owner,
      pull_number: analysisOutput.pull_number
    });

    if (analysisExists) {
      return await this.updateAnalysisOutput(analysisOutput);
    } else {
      await this.db.create<AnalysisOutput>(analysisOutput);
    }

    console.log("Created: ", analysisOutput);
    return analysisOutput;
  }

  async updateAnalysisOutput(newAnalysisOutput: AnalysisOutput): Promise<AnalysisOutput> {
    const { repository, owner, pull_number } = newAnalysisOutput;
    const a = await this.db.updateOne({ repository, owner, pull_number }, { $set: newAnalysisOutput });

    if (!a.acknowledged) throw new Error("Failed to update analysis output");
    console.log("Updated: ", newAnalysisOutput);
    return newAnalysisOutput;
  }

  async deleteAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<void> {
    await this.db.deleteOne({ repository: repo, owner, pull_number });
    console.log("Deleted: ", { repository: repo, owner, pull_number });
  }

  async listAllAnalysisFromRepo(repo: string, owner: string): Promise<AnalysisOutput[]> {
    const analyses = await this.db.find<AnalysisOutput>(
      { repository: repo, owner },
      { projection: { _id: 0 } }
    );
    console.log("Found: ", analyses);
    return analyses;
  }

  async listAllAnalysisFromOwner(owner: string): Promise<AnalysisOutput[]> {
    const analyses = await this.db.find<AnalysisOutput>({ owner }, { projection: { _id: 0 } });
    console.log("Found: ", analyses);
    return analyses;
  }
}

export { AnalysisOutputRepository, AnalysisOutputMongoRepository };
