import request from "supertest";
import mongoose from "mongoose";
import * as helper from "../../src/utils/helperFunction";
import Subcategory from "../../src/models/Subcategory";

var server;

var newsubcategory = new Subcategory({
  name: "testing",
});

describe("Sub-Category Routes - /api/subcategories", () => {
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
      const res = await request(server).get("/api/subcategories");
      expect(res.status).toBe(401);
    });

    it("GET Should return all subcategories", async () => {
      const res = await request(server)
        .get("/api/subcategories")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      //   console.log(await Category.find({}));
    });

    it("GET Should return Books subcategories", async () => {
      const res = await request(server)
        .get("/api/subcategories")
        .set("Authorization", `Bearer ${token}`)
        .query({ name: "Novels" });

      expect(res.status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server).get(
        "/api/subcategories/604d11a44486491bdca949ff"
      );
      expect(res.status).toBe(401);
    });

    it("Should return 200 or 400(subcategory not found)", async () => {
      const subcategory = await Subcategory.find({});
      if (subcategory.length === 0) {
        const res = await request(server)
          .get("/api/subcategories/604d11a44486491bdca949ff")
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
      } else {
        const res = await request(server)
          .get(`/api/subcategories/${subcategory[0]._id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
      }
    });
  });

  describe("PUT /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server)
        .put("/api/subcategories/604d11a44486491bdca94a02")
        .send({ name: "Electronics" });
      expect(res.status).toBe(401);
    });

    it("should update subcategory 200 or 404(subcategory not found)", async () => {
      const subcategory = await Subcategory.find({});
      if (subcategory.length === 0) {
        const res = await request(server)
          .put("/api/subcategories/604d11a44486491b3ca94a02")
          .set("Authorization", `Bearer ${token}`)
          .send({ id: "604d11a44486491b3ca94a02", name: "Storage Devices" });
        expect(res.status).toBe(404);
      } else {
        const res = await request(server)
          .put(`/api/subcategories/${subcategory[0]._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ id: subcategory[0]._id, name: "Storage Devices" });

        expect(res.status).toBe(204);
      }
    });
  });

  describe("DELETE /:id", () => {
    it("Should return unauthorized error (401)", async () => {
      const res = await request(server).delete(
        "/api/subcategories/604bcb69bc74af2970137ef7"
      );
      expect(res.status).toBe(401);
    });

    it("Should return 204 success message for deleting subcategory", async () => {
      newsubcategory = await newsubcategory.save();
      const res = await request(server)
        .delete(`/api/subcategories/${newsubcategory._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(204);

      await Subcategory.findByIdAndDelete(newsubcategory._id);
    });
  });
});
