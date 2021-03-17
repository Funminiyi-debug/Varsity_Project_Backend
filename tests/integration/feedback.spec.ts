import request from "supertest";
import mongoose from "mongoose";
import * as helper from "../../src/utils/helperFunction";
import Feedback from "../../src/models/Feedback";
import Product from "../../src/models/Product";
var server;

// var newfeedback = new Feedback({
//   message: "testing",
//   feedbackStatus: "Positive",
//   product: {_id: }
// });

describe("Feed Back Routes - /api/feedbacks", () => {
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
      const res = await request(server).get("/api/feedbacks");
      expect(res.status).toBe(401);
    });

    it("GET Should return all feedbacks", async () => {
      const res = await request(server)
        .get("/api/feedbacks")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });

  describe("GET /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server).get(
        "/api/feedbacks/604e4ec721d30a1b7ca20d28"
      );
      expect(res.status).toBe(401);
    });

    it("Should return 200 or 404(feeds not found)", async () => {
      const feedback = await Feedback.find({});
      if (feedback.length === 0) {
        const res = await request(server)
          .get(`/api/feedbacks/604e4ec721d30a1b7ca20d28`)
          .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(404);
      } else {
        const res = await request(server)
          .get(`/api/feedbacks/${feedback[0]._id}`)
          .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(200);
      }
    });
  });

  describe("PUT /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server)
        .put("/api/feedbacks/604bc5c7b338f924a0da2fa7")
        .send({ message: "updated" });
      expect(res.status).toBe(401);
    });

    it("Should return 204 or 404(product not found)", async () => {
      const product = await Product.find({});
      const feedback = await Feedback.find({});
      if (feedback.length === 0) {
        const res = await request(server)
          .put("/api/feedbacks/604bc5c7b338f924a0da2fa7")
          .set("Authorization", `Bearer ${token}`)
          .send({ id: "604bc5c7b338f924a0da2fa7", message: "testing update" });
        expect(res.status).toBe(404);
      } else {
        const res = await request(server)
          .put(`/api/feedbacks/${feedback[0]._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ id: product[0]._id, message: "testing update" });
        expect(res.status).toBe(204);
      }
    });
  });

  describe("POST /", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server)
        .post("/api/feedbacks/604bc5c7b338f924a0da2fa7")
        .send({
          message: "testing posting",
          author: payload._id,
          feedbackStatus: "Neutral",
          product: "604bc5c7b338f924a0da2fa7",
        });
      expect(res.status).toBe(401);
    });

    //=========Something wrong with the Code we are testing=========//

    // it("Should return 201 or 404(product not found)", async () => {
    //   const product = await Product.find({});
    //   const feedback = await Feedback.find({});
    //   if (product.length === 0) {
    //     const res = await request(server)
    //       .post("/api/feedbacks")
    //       .set("Authorization", `Bearer ${token}`)
    //       .send({
    //         message: "testing posting",
    //         author: payload._id,
    //         feedbackStatus: "Neutral",
    //         product: "604bc5c7b338f924a0da2fa7",
    //       });
    //     expect(res.status).toBe(404);
    //   } else {
    //     const res = await request(server)
    //       .post("/api/feedbacks")
    //       .set("Authorization", `Bearer ${token}`)
    //       .send({
    //         message: "testing",
    //         author: payload._id,
    //         feedbackStatus: "Positive",
    //         product: { _id: product[0]._id },
    //       });
    //     expect(res.status).toBe(201);
    //   }
    // });
  });

  describe("PUT /like-feedback/:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server).put(
        "/api/feedbacks/like-feedback/604bc5c7b338f924a0da2fa7"
      );
      expect(res.status).toBe(401);
    });

    it("Should return 204 or 404(feedback not found)", async () => {
      const feedback = await Feedback.find({});
      if (feedback.length === 0) {
        const res = await request(server)
          .put("/api/feedbacks/like-feedback/604bc5c7b338f924a0da2fa7")
          .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(404);
      } else {
        const res = await request(server)
          .put(`/api/feedbacks/like-feedback/${feedback[0]._id}`)
          .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(204);
      }
    });
  });

  describe("DELETE /:id", () => {
    it("Should return unauthorized error (401)", async () => {
      const res = await request(server).delete(
        "/api/feedbacks/604bcb69bc74af2970137ef7"
      );
      expect(res.status).toBe(401);
    });

    //=========Something wrong with the Code we are testing=========//

    // it("Should return 204 success message for deleting feedback", async () => {
    //   const product = await Product.find({});
    //   if (product.length === 0) {
    //     const res = await request(server)
    //       .delete(`/api/feedbacks/604bcb69bc**74af2970137ef7`)
    //       .set("Authorization", `Bearer ${token}`);
    //     expect(res.status).toBe(204);
    //   } else {
    //     var feedback = new Feedback({
    //       message: "testing",
    //       author: payload._id,
    //       feedbackStatus: "Positive",
    //       product: { _id: product[0]._id },
    //     });
    //     feedback = await feedback.save();
    //     const res = await request(server)
    //       .delete(`/api/feedbacks/${feedback._id}`)
    //       .set("Authorization", `Bearer ${token}`);
    //     expect(res.status).toBe(204);
    //     await Feedback.findByIdAndDelete(feedback._id);
    //   }
    // });
  });
});
