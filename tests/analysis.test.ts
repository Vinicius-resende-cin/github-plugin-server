import request from "supertest";
import fs from "fs";
import app from "../src/routes/app";
import { AnalysisOutput } from "../src/models/AnalysisOutput";

const dataFile = "src/data/analysisOutputs.json";
let analysisExample: AnalysisOutput[] = JSON.parse(fs.readFileSync(dataFile, "utf8"));

const owner = "Vinicius-resende-cin";
const repo = "semantic-conflict";
const pull_number = 59;

const TIMEOUT = 60000;

describe("/analysis route", () => {
  beforeEach(() => {
    analysisExample = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  });
  afterEach(() => {});

  // POST tests
  test(
    "POST: should return 400 Bad Request",
    () => {
      return request(app)
        .post("/analysis")
        .then((response) => expect(response.statusCode).toBe(400));
    },
    TIMEOUT
  );

  test(
    "POST: should return 200 OK and the created Analysis",
    () => {
      return request(app)
        .post("/analysis")
        .send({ analysis: analysisExample[0] })
        .then((response) => {
          expect(response.statusCode).toBe(200);

          const analysis: AnalysisOutput = JSON.parse(response.text);
          expect(analysis).toEqual(analysisExample[0]);
        });
    },
    TIMEOUT
  );

  // GET tests
  test("GET: should return 400 Bad Request", () => {
    return request(app)
      .get("/analysis")
      .then((response) => expect(response.statusCode).toBe(400));
  });

  test(
    "GET: should return 200 OK and the requested Analysis",
    () => {
      return request(app)
        .get(`/analysis?owner=${owner}&repo=${repo}&pull_number=${pull_number}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);

          const analysis: AnalysisOutput = JSON.parse(response.text);
          expect(analysis).toMatchObject(analysisExample[0]);
        });
    },
    TIMEOUT
  );

  test(
    "GET: should return 200 OK and all Analysis from a repo",
    () => {
      return request(app)
        .get(`/analysis?owner=${owner}&repo=${repo}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);

          const analysis: AnalysisOutput[] = JSON.parse(response.text);
          expect(analysis).toMatchObject(analysisExample);
        });
    },
    TIMEOUT
  );

  test(
    "GET: should return 200 OK and all Analysis from an owner",
    () => {
      return request(app)
        .get(`/analysis?owner=${owner}`)
        .then((response) => {
          expect(response.statusCode).toBe(200);

          const analysis: AnalysisOutput[] = JSON.parse(response.text);
          expect(analysis).toMatchObject(analysisExample);
        });
    },
    TIMEOUT
  );

  // PUT tests
  test(
    "PUT: should return 400 Bad Request",
    () => {
      return request(app)
        .put("/analysis")
        .then((response) => expect(response.statusCode).toBe(400));
    },
    TIMEOUT
  );

  test(
    "PUT: should return 200 OK and the updated Analysis",
    () => {
      return request(app)
        .put("/analysis")
        .send({ analysis: analysisExample[0] })
        .then((response) => {
          expect(response.statusCode).toBe(200);

          const analysis: AnalysisOutput = JSON.parse(response.text);
          expect(analysis).toMatchObject(analysisExample[0]);
        });
    },
    TIMEOUT
  );

  // DELETE tests
  test(
    "DELETE: should return 400 Bad Request",
    () => {
      return request(app)
        .delete("/analysis")
        .then((response) => expect(response.statusCode).toBe(400));
    },
    TIMEOUT
  );

  test(
    "DELETE: should return 200 OK",
    () => {
      return request(app)
        .delete(`/analysis?owner=${owner}&repo=${repo}&pull_number=${pull_number}`)
        .then((response) => expect(response.statusCode).toBe(200));
    },
    TIMEOUT
  );

  test(
    "DELETE: analysis list should be empty",
    () => {
      return request(app)
        .delete(`/analysis?owner=${owner}&repo=${repo}&pull_number=${pull_number}`)
        .then((response) => expect(response.statusCode).toBe(200))
        .then(() => {
          return request(app)
            .get(`/analysis?owner=${owner}`)
            .then((response) => {
              expect(response.statusCode).toBe(200);

              const analysis: AnalysisOutput[] = JSON.parse(response.text);
              expect(analysis).toEqual([]);
            });
        });
    },
    TIMEOUT
  );
});
