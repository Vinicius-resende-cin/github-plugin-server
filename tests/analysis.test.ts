import request from "supertest";
import fs from "fs";
import app from "../src/routes/app";
import { AnalysisOutput } from "../src/models/AnalysisOutput";

const analysisExample: AnalysisOutput[] = JSON.parse(
  fs.readFileSync("tests/data/analysisOutputs.json", "utf8")
);

describe("/analysis route", () => {
  beforeEach(() => {}); // TODO database connection goes here
  afterEach(() => {}); // TODO database disconnetion goes here

  // GET tests
  test("GET: should return 400 Bad Request", () => {
    return request(app)
      .get("/analysis")
      .then((response) => expect(response.statusCode).toBe(400));
  });

  test("GET: should return 200 OK and the requested Analysis", () => {
    return request(app)
      .get("/analysis?owner=owner1&repo=repo1&pull_number=1")
      .then((response) => {
        expect(response.statusCode).toBe(200);

        const analysis: AnalysisOutput = JSON.parse(response.text);
        expect(analysis).toEqual(analysisExample[0]);
      });
  });

  test("GET: should return 200 OK and all Analysis from a repo", () => {
    return request(app)
      .get("/analysis?owner=owner1&repo=repo1")
      .then((response) => {
        expect(response.statusCode).toBe(200);

        const analysis: AnalysisOutput[] = JSON.parse(response.text);
        expect(analysis).toEqual(analysisExample);
      });
  });

  test("GET: should return 200 OK and all Analysis from an owner", () => {
    return request(app)
      .get("/analysis?owner=owner1")
      .then((response) => {
        expect(response.statusCode).toBe(200);

        const analysis: AnalysisOutput[] = JSON.parse(response.text);
        expect(analysis).toEqual(analysisExample);
      });
  });

  // POST tests
  test("POST: should return 400 Bad Request", () => {
    return request(app)
      .post("/analysis")
      .then((response) => expect(response.statusCode).toBe(400));
  });

  test("POST: should return 200 OK and the created Analysis", () => {
    return request(app)
      .post("/analysis")
      .send({ analysis: analysisExample[0] })
      .then((response) => {
        expect(response.statusCode).toBe(200);

        const analysis: AnalysisOutput = JSON.parse(response.text);
        expect(analysis).toEqual(analysisExample[0]);
      });
  });

  // PUT tests
  test("PUT: should return 400 Bad Request", () => {
    return request(app)
      .put("/analysis")
      .then((response) => expect(response.statusCode).toBe(400));
  });

  test("PUT: should return 200 OK and the updated Analysis", () => {
    return request(app)
      .put("/analysis")
      .send({ analysis: analysisExample[0] })
      .then((response) => {
        expect(response.statusCode).toBe(200);

        const analysis: AnalysisOutput = JSON.parse(response.text);
        expect(analysis).toEqual(analysisExample[0]);
      });
  });

  // DELETE tests
  test("DELETE: should return 400 Bad Request", () => {
    return request(app)
      .delete("/analysis")
      .then((response) => expect(response.statusCode).toBe(400));
  });

  test("DELETE: should return 200 OK", () => {
    return request(app)
      .delete("/analysis?owner=owner1&repo=repo1&pull_number=1")
      .then((response) => expect(response.statusCode).toBe(200));
  });

  test("DELETE: analysis list should be empty", () => {
    request(app)
      .delete("/analysis?owner=owner1&repo=repo1&pull_number=1")
      .then((response) => expect(response.statusCode).toBe(200))
      .then(() => {
        return request(app)
          .get("/analysis?owner=owner1")
          .then((response) => {
            expect(response.statusCode).toBe(200);

            const analysis: AnalysisOutput[] = JSON.parse(response.text);
            expect(analysis).toEqual([]);
          });
      });
  });
});
