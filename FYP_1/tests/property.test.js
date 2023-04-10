/* eslint-disable */
const mongoose = require("mongoose");
const request = require("supertest");
const dotenv = require("dotenv");
const app = require("../app");

dotenv.config({ path: "./config.env" });
/* Connecting to the database before test. */
beforeAll(async () => {
  mongoose.set("strictQuery", false);

  const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
  );

  await mongoose
    .connect(DB)
    .then(() => console.log("DB connection successful!"));
});

/* Closing database connection after test. */
afterAll(async () => {
  await mongoose.connection
    .close()
    .then(() => console.log("DB connection closed successful!"));
});

describe("GET /api/v1/properties", () => {
  it("should return all properties", async () => {
    const res = await request(app).get("/api/v1/properties");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
  });
});

describe("GET /api/v1/properties/:id", () => {
  it("should return a property", async () => {
    const res = await request(app).get(
      "/api/v1/properties/63c9b6507657e1013cc7e1fc"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.data.data.address).toBe("1 Kimberley Villas, Millitary Hill");
  });
});


