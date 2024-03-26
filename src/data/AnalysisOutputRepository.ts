import fs from "fs";
import { client as mongoClient, connectDb } from "../database";
import { AnalysisOutput, analysisMatches } from "../models/AnalysisOutput";
import { Db } from "mongodb";

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

class AnalysisOutputMongoRepository implements AnalysisOutputRepository {
  private db: Db | undefined;
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private async connect() {
    this.db = await connectDb("AnalysisOutputMongoRepository");
  }

  private async disconnect() {
    await mongoClient.close();
  }

  async getAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<AnalysisOutput | null> {
    await this.connect();
    if (!this.db) throw new Error("Database not connected");

    const result = await this.db
      .collection<AnalysisOutput>(this.collectionName)
      .findOne<AnalysisOutput>({ repository: repo, owner, pull_number }, { projection: { _id: 0 } });

    await this.disconnect();
    return result;
  }

  async createAnalysisOutput(analysisOutput: AnalysisOutput): Promise<AnalysisOutput> {
    await this.connect();
    if (!this.db) throw new Error("Database not connected");
    console.log(analysisOutput);

    const { repository, owner, pull_number } = analysisOutput;
    const a = await this.db
      .collection<AnalysisOutput>(this.collectionName)
      .updateOne({ repository, owner, pull_number }, { $set: analysisOutput }, { upsert: true });

    console.log(a.acknowledged);

    await this.disconnect();
    return analysisOutput;
  }

  async updateAnalysisOutput(newAnalysisOutput: AnalysisOutput): Promise<AnalysisOutput> {
    await this.connect();
    if (!this.db) throw new Error("Database not connected");

    const { repository, owner, pull_number } = newAnalysisOutput;
    await this.db
      .collection<AnalysisOutput>(this.collectionName)
      .updateOne({ repository, owner, pull_number }, { $set: newAnalysisOutput });

    await this.disconnect();
    return newAnalysisOutput;
  }

  async deleteAnalysisOutput(repo: string, owner: string, pull_number: number): Promise<void> {
    await this.connect();
    if (!this.db) throw new Error("Database not connected");

    await this.db
      .collection<AnalysisOutput>(this.collectionName)
      .deleteOne({ repository: repo, owner, pull_number });

    await this.disconnect();
  }

  async listAllAnalysisFromRepo(repo: string, owner: string): Promise<AnalysisOutput[]> {
    await this.connect();
    if (!this.db) throw new Error("Database not connected");

    const result = await this.db
      .collection<AnalysisOutput>(this.collectionName)
      .find({ repository: repo, owner }, { projection: { _id: 0 } })
      .toArray();

    await this.disconnect();
    return result;
  }

  async listAllAnalysisFromOwner(owner: string): Promise<AnalysisOutput[]> {
    await this.connect();
    if (!this.db) throw new Error("Database not connected");

    const result = await this.db
      .collection<AnalysisOutput>(this.collectionName)
      .find({ owner }, { projection: { _id: 0 } })
      .toArray();

    await this.disconnect();
    return result;
  }
}

export { AnalysisOutputRepository, AnalysisOutputFileRepository, AnalysisOutputMongoRepository };
