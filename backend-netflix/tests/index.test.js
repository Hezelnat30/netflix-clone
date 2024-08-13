require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("Resource /my-movies", () => {
  it("should return a success message", async () => {
    const res = await request(app).get(
      "/my-movies/justinhezekiel2@gmail.com/123asdwad"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Success get favorite movies");
  });

  it("should return unauthorized message", async () => {
    const res = await request(app).get(
      "/my-movies/justinhezekiel2@gmail.com/123zjkdq"
    );
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Error, Unauthorized");
  });

  it("should return success saved favorite movies", async () => {
    const res = await request(app)
      .post("/my-movies")
      .set("Content-Type", "application/json")
      .send({
        email: "justinhezekiel2@gmail.com",
        token: "123asdwad",
        data: {
          id: 1,
          title: "testing",
          description: "testing",
        },
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Success add favorite movies");
  });

  it("should return failed to saved favorite movies", async () => {
    const res = await request(app)
      .post("/my-movies")
      .set("Content-Type", "application/json")
      .send({
        email: "justinhezekiel2@gmail.com",
        token: "123asd",
        data: {
          id: 1,
          title: "testing",
          description: "testing",
        },
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Error, Unauthorized");
  });

  it("should return success to delete favorite movies", async () => {
    const res = await request(app)
      .delete("/my-movies")
      .set("Content-Type", "application/json")
      .send({
        email: "justinhezekiel2@gmail.com",
        token: "123asdwad",
        movieID: 1,
      });
    expect(res.statusCode).toBe(204);
  });
  it("should return failed to delete favorite movies", async () => {
    const res = await request(app)
      .delete("/my-movies")
      .set("Content-Type", "application/json")
      .send({
        email: "justinhezekiel2@gmail.com",
        token: "123asdqwer",
        movieID: 1,
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Error, Unauthorized");
  });
  it("should return movieID not found", async () => {
    const res = await request(app)
      .delete("/my-movies")
      .set("Content-Type", "application/json")
      .send({
        email: "justinhezekiel2@gmail.com",
        token: "123asdwad",
        movieID: 2,
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Movie ID not found");
  });
});

describe("Resource /sign-up", () => {
  it("should return sign up success", async () => {
    const res = await request(app)
      .post("/sign-up")
      .set("Content-Type", "application/json")
      .send({
        email: "justinhezekiel4@gmail.com",
        password: "admin123",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Sign Up Successfully");
  });
  it("should return sign up failed", async () => {
    const res = await request(app)
      .post("/sign-up")
      .set("Content-Type", "application/json")
      .send({
        email: "justinhezekiel3@gmail.com",
        password: "admin123",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already exists");
  });
});
