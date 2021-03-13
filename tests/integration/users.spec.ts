import request from "supertest";
import mongoose from "mongoose";
import User from "../../src/models/User";
import * as helper from "../../src/utils/helperFunction";
var server;

describe("Users Routes - /api/users", () => {
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
    displayName: "ifeoluwapo Damilola",
  };

  const token = helper.generateJwtToken(payload);

  describe("GET /", () => {
    it("Should return unauthorized error(404)", async () => {
      const res = await request(server).get("/api/users");
      expect(res.status).toBe(401);
    });

    it("GET Should return 200 success message", async () => {
      const res = await request(server)
        .get("/api/users")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("GET BY ID - Should return unauthorized error(401)", async () => {
      const res = await request(server).get(
        "/api/users/604bc5c7b338f924a0da2fa7"
      );
      expect(res.status).toBe(401);
    });

    it("GET Should return 200 success message", async () => {
      const res = await request(server)
        .get("/api/users/604bc5c7b338f924a0da2fa7")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe("PUT /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server)
        .put("/api/users/604bc5c7b338f924a0da2fa7")
        .send({ verificationStatus: "Restricted" });
      expect(res.status).toBe(401);
    });

    // it("Should return ", async () => {
    //   const res = await request(server)
    //     .put("/api/users/604bc5c7b338f924a0da2fa7")
    //     .send({ verificationStatus: "Restricted" })
    //     .set("Authorization", `Bearer ${token}`);

    //   expect(res.status).toBe(204);
    // });
  });

  describe("DELETE /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server)
        .delete("/api/users/604cae4535c8a01a04a18c05")
        .send({ verificationStatus: "Restricted" });
      expect(res.status).toBe(401);
    });

    /** 
    it("Should return 204 success message", async () => {
      const res = await request(server)
        .delete("/api/users/604cae4535c8a01a04a18c05")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(204);
    });
    */
  });
});
