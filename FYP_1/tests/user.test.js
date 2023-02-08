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

describe("login", () => {
  it("login to user account", async () => {
    const res = await request(app).post(
      "/api/v1/users/login"
    ).send({
      email: "dajong@gmail.com",
      password: "pass1234"
    });
    expect(res.statusCode).toBe(200);
    console.log(res.body);
    expect(res.body.data.user.name).toBe("Daniel Jong");
  });
});