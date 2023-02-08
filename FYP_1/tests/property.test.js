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
    console.log(res.body);
    expect(res.body.data.data.address).toBe("1 Kimberley Villas, Millitary Hill");
  });
});

// describe("POST /api/v1/properties", () => {
//   it("should create a property", async () => {
//     const loginRes = await request(app).post(
//       "/api/v1/users/login"
//     ).send({
//       email: "dajong@gmail.com",
//       password: "pass1234"
//     });
//     console.log(loginRes);
//     expect(loginRes.body.data.user.role).toBe("admin");

//     const res = await request(app).post("/api/v1/properties").send({
//           address: "test addressasdasdasasasd",
//           city: "Dublin",
//           listingNum: 12345,
//           propertyStyle: "Bungalow",
//           garageType: "Attached",
//           garageSize: 123,
//           berRating: "A1",
//           squareFeet: 1800,
//           lotSize: "125 x 324",
//           numBedroom: 3,
//           numBathroom: 3,
//           price: 200,
//           description: "some tseting description",
//           imageCover: "12345.jpg",
//           propertySold: false,
//           propertyViews: 0,
//           biddingPrice: 100
//     });
//     expect(res.statusCode).toBe(201);
//     console.log(res.body);
//     expect(res.body.data.data.address).toBe("test addressasdasdasasasd");
//   });
// });


