/* eslint-disable */
const mongoose = require("mongoose");
const request = require("supertest");
const dotenv = require("dotenv");
const app = require("../app");
const User = require('../models/userModel');
const { login } = require("../controllers/authController");

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

describe("logout", () => {
  it("logout to user account", async () => {
    const res = await request(app).get(
      "/api/v1/users/logout"
    );
    expect(res.statusCode).toBe(200);
  });
});

describe('Auth Integration Test', () => {
  let userId;
  const userEmail = 'danieljong5201@gmail.com';
  const userPassword = 'testpassword';

  afterAll(async () => {
    // Cleanup: Remove the test user created during testing
    await User.deleteOne({ email: userEmail });
  });

  it('should register a new user and log them in', async () => {
    // Register a new user
    const registerResponse = await request(app)
      .post('/api/v1/users/signup')
      .send({
        name: 'Test User',
        email: userEmail,
        role: 'user',
        password: userPassword,
        passwordConfirm: userPassword,
      });

    expect(registerResponse.statusCode).toBe(201); // Successful registration
    expect(registerResponse.body.status).toBe('success');
    userId = registerResponse.body.data.user._id;

    // Log in the newly registered user
    const loginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: userEmail,
        password: userPassword,
      });

    expect(loginResponse.statusCode).toBe(200); // Successful login
    expect(loginResponse.body.status).toBe('success');
    expect(loginResponse.body.token).toBeDefined(); // A JWT token should be returned
  });

  it('should update the password for an authenticated user', async () => {
    // Log in the user to get the JWT token
    const loginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: userEmail,
        password: userPassword,
      });

    const token = loginResponse.body.token;

    // Update the user's password
    const newPassword = 'newtestpassword';
    const updateResponse = await request(app)
      .patch('/api/v1/users/updateMyPassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        passwordCurrent: userPassword,
        password: newPassword,
        passwordConfirm: newPassword,
      });

    expect(updateResponse.statusCode).toBe(200); // Successful password update
    expect(updateResponse.body.status).toBe('success');
    expect(updateResponse.body.token).toBeDefined(); // A new JWT token should be returned

    // Log in with the new password to confirm the update
    const newLoginResponse = await request(app)
      .post('/api/v1/users/login')
      .send({
        email: userEmail,
        password: newPassword,
      });

    expect(newLoginResponse.statusCode).toBe(200); // Successful login
    expect(newLoginResponse.body.status).toBe('success');
    expect(newLoginResponse.body.token).toBeDefined(); // A JWT token should be returned
  });
});