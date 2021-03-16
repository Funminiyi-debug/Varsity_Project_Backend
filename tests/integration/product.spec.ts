import request from "supertest";
import mongoose from "mongoose";
import * as helper from "../../src/utils/helperFunction";
import Product from "../../src/models/Product";

var server;

describe("Products Routes - /api/products", () => {
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
      const res = await request(server).get("/api/products");
      expect(res.status).toBe(401);
    });

    it("GET Should return all products", async () => {
      const res = await request(server)
        .get("/api/products")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);

      // console.log(
      //   "pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp",
      //   await Product.find({})
      // );
    });

    it("GET Should return all products under accomodation", async () => {
      const res = await request(server)
        .get("/api/products")
        .set("Authorization", `Bearer ${token}`)
        .query({ name: "Accomodation" });

      expect(res.status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("GET BY ID - Should return unauthorized error(401)", async () => {
      const res = await request(server).get(
        "/api/products/604e4ec721d30a1b7ca20d28"
      );
      expect(res.status).toBe(401);
    });

    it("GET Should return 200 or 404(product not found)", async () => {
      const product = await Product.find({});
      if (product.length === 0) {
        const res = await request(server)
          .get(`/api/products/604e4ec721d30a1b7ca20d28`)
          .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(404); //product not found
      } else {
        const res = await request(server)
          .get(`/api/products/${product[0]._id}`)
          .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
      }
    });
  });

  describe("PUT /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server)
        .put("/api/products/604bc5c7b338f924a0da2fa7")
        .send({ verificationStatus: "Restricted" });
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server).delete(
        "/api/products/604bcb69bc74af2970137ef7"
      );
      expect(res.status).toBe(401);
    });
  });
});
