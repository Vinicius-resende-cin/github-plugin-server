import mongoose from "mongoose";

// Define the types of nodes for each analysis

type interferenceTypeList = {
  OA: {
    DECLARATION: "declaration";
    OVERRIDE: "override";
  };
  DEFAULT: {
    SOURCE: "source";
    SINK: "sink";
  };
};

type Flatten<T> = T extends object ? T[keyof T] : T;

type interferenceType = Flatten<Flatten<interferenceTypeList>>;

// Define the types of the analysis output

type lineLocation = {
  file: string;
  class: string;
  method: string;
  line: number;
};

type tracedNode = {
  class: string;
  method: string;
  line: number;
};

type interferenceNode = {
  type: interferenceType;
  branch: "L" | "R";
  text: string;
  location: lineLocation;
  stackTrace?: Array<tracedNode>;
};

interface IAnalysisOutput {
  uuid: string;
  repository: string;
  owner: string;
  pull_number: number;
  data: {
    [key: string]: any;
  };
  diff: string;
  events: Array<{
    type: string;
    label: string;
    body: {
      description: string;
      interference: Array<interferenceNode>;
    };
  }>;
}

class AnalysisOutput implements IAnalysisOutput {
  repository: string;
  owner: string;
  pull_number: number;
  uuid: string;
  data: { [key: string]: any };
  diff: string;
  events: Array<{
    type: string;
    label: string;
    body: {
      description: string;
      interference: Array<interferenceNode>;
    };
  }>;

  constructor(analysisOutput: IAnalysisOutput) {
    this.uuid = analysisOutput.uuid;
    this.repository = analysisOutput.repository;
    this.owner = analysisOutput.owner;
    this.pull_number = analysisOutput.pull_number;
    this.data = analysisOutput.data;
    this.diff = analysisOutput.diff;
    this.events = analysisOutput.events;
  }
}

/* FileRepository deprecated in favor of MongoDB
function analysisMatches(
  analysis: AnalysisOutput,
  owner: string,
  repo?: string,
  pull_number?: number
): boolean {
  return (
    analysis.owner === owner &&
    (repo ? analysis.repository === repo : true) &&
    (pull_number ? analysis.pull_number === pull_number : true)
  );
}
*/

// Define the schema for the analysis output

const analysisSchema = new mongoose.Schema({
  uuid: String,
  repository: String,
  owner: String,
  pull_number: Number,
  data: Object,
  diff: String,
  events: {
    type: [
      {
        type: { type: String },
        label: String,
        body: {
          description: String,
          interference: [
            {
              type: { type: String },
              branch: String,
              text: String,
              location: {
                file: String,
                class: String,
                method: String,
                line: Number
              },
              stackTrace: [
                {
                  class: String,
                  method: String,
                  line: Number
                }
              ]
            }
          ]
        }
      }
    ],
    default: []
  }
});

export default mongoose.models.Analysis || mongoose.model("Analysis", analysisSchema);

export { IAnalysisOutput, AnalysisOutput };
