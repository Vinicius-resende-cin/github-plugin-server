import request from "supertest";
import fs from "fs";
import app from "../src/routes/app";

const analysisExample = JSON.parse(fs.readFileSync("tests/data/analysisOutputs.json", "utf8"));

describe("GET /analysis", () => {
  beforeEach(() => {}); // TODO database connection goes here
  afterEach(() => {}); // TODO database disconnetion goes here

  test("should return 400 Bad Request", () => {
    return request(app)
      .get("/analysis")
      .then((response) => expect(response.statusCode).toBe(400));
  });

  test("should return 200 OK and the requested Analysis", () => {
    return request(app)
      .get("/analysis?owner=owner1&repo=repo1&pull_number=1")
      .then((response) => {
        expect(response.statusCode).toBe(200);

        const analysis = JSON.parse(response.text);
        expect(analysis).toEqual(analysisExample[0]);
      });
  });
});
