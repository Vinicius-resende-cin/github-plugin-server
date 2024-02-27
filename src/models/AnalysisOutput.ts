type analysisResult = "true" | "false" | "error";

type analysisResultList = {
  confluenceIntra: analysisResult;
  confluenceInter: analysisResult;
  leftRightOAIntra: analysisResult;
  rightLeftOAIntra: analysisResult;
  leftRightOAInter: analysisResult;
  rightLeftOAInter: analysisResult;
  leftRightPdgSdg: analysisResult;
  rightLeftPdgSdg: analysisResult;
  leftRightDfpInter: analysisResult;
  rightLeftDfpInter: analysisResult;
  leftRightPdgSdge: analysisResult;
  rightLeftPdgSdge: analysisResult;
};

type codeLine = {
  className: string;
  method: string;
  lineNumber: number;
};

type dependency = {
  from: codeLine;
  to: codeLine;
  stackTrace?: codeLine[];
};

type result = {
  analysis: analysisResultList;
  dependencies: dependency[];
};

interface IAnalysisOutput {
  repository: string;
  owner: string;
  pull_number: number;
  results: result[];
}

class AnalysisOutput implements IAnalysisOutput {
  repository: string;
  owner: string;
  pull_number: number;
  results: result[];

  constructor(analysisOutput: IAnalysisOutput) {
    this.repository = analysisOutput.repository;
    this.owner = analysisOutput.owner;
    this.pull_number = analysisOutput.pull_number;
    this.results = analysisOutput.results;
  }
}

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

export { IAnalysisOutput, AnalysisOutput, analysisMatches };
