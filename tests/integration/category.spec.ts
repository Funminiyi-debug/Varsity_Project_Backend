import request from "supertest";
import mongoose from "mongoose";
import User from "../../src/models/User";
import * as helper from "../../src/utils/helperFunction";
import Category from "../../src/models/Category";
var server;

var category = new Category({
  name: "testing",
});

describe("Category Routes - /api/categories", () => {
  beforeAll(() => {
    server = require("../../src/server");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  const payload = {
    _id: "604cad2a84de7e1a0456f10f",
    email: "adenusidamilola5@gmail.com",
    displayName: "Damilola Adenusi",
  };

  const token = helper.generateJwtToken(payload);

  describe("GET /", () => {
    it("Should return unauthorized error(404)", async () => {
      const res = await request(server).get("/api/categories");
      expect(res.status).toBe(401);
    });

    it("GET Should return all categories", async () => {
      const res = await request(server)
        .get("/api/categories")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      //   console.log(await Category.find({}));
    });

    it("GET Should return fashion category", async () => {
      const res = await request(server)
        .get("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .query({ name: "Fashion" });

      expect(res.status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server).get(
        "/api/categories/604d11a44486491bdca949ff"
      );
      expect(res.status).toBe(401);
    });

    it("Should return 200 success message for getting a category by id", async () => {
      const res = await request(server)
        .get("/api/categories/604d11a44486491bdca949ff")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe("PUT /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server)
        .put("/api/categories/604d11a44486491bdca94a02")
        .send({ name: "Electronics" });
      expect(res.status).toBe(401);
    });

    it(`Should return 422 uprocessable error message,
        User service for updating is not implemented yet`, async () => {
      const res = await request(server)
        .put("/api/categories/604d11a44486491bdca94a02")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Electronics" });

      expect(res.status).toBe(422);
    });
  });

  describe("DELETE /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server).delete(
        "/api/categories/604bcb69bc74af2970137ef7"
      );
      expect(res.status).toBe(401);
    });

    // it("Should return 204 success message for deleting category", async () => {
    //   category = await category.save();
    //   console.log(
    //     ")))))((((((((((((())(((((((((()))))))))))))))))))))))(((((((((((((((((((",
    //     category
    //   );
    //   const res = await request(server)
    //     .delete(`/api/categories/${category._id}`)
    //     .set("Authorization", `Bearer ${token}`);
    //   expect(res.status).toBe(204);

    //   await Category.findByIdAndDelete(category._id);
    // });
  });
});
