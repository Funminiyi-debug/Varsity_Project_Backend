import request from "supertest";
import mongoose from "mongoose";
import * as helper from "../../src/utils/helperFunction";
import Post from "../../src/models/Post";
import { listenerCount } from "process";
var server;

describe("Post Routes - /api/posts", () => {
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
      const res = await request(server).get("/api/posts");
      expect(res.status).toBe(401);
    });

    // it("GET Should return all posts", async () => {
    //   const res = await request(server)
    //     .get("/api/posts")
    //     .set("Authorization", `Bearer ${token}`);

    //   expect(res.status).toBe(200);
    // });
  });

  describe("GET /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server).get(
        "/api/posts/604d11a44486491bdca949ff"
      );
      expect(res.status).toBe(401);
    });

    // it("Should return 200 or 400(post not found)", async () => {
    //   const post = await Post.find({});
    //   if (post.length === 0) {
    //     const res = await request(server)
    //       .get("/api/posts/604d11a44486491bdca949ff")
    //       .set("Authorization", `Bearer ${token}`);

    //     expect(res.status).toBe(404);
    //   } else {
    //     const res = await request(server)
    //       .get(`/api/posts/${post[0]._id}`)
    //       .set("Authorization", `Bearer ${token}`);

    //     expect(res.status).toBe(200);
    //   }
    // });
  });

  describe("PUT /:id", () => {
    // it("Should return unauthorized error(401)", async () => {
    //   const res = await request(server)
    //     .put("/api/posts/604d11a44486491bdca94a02")
    //     .send({
    //       id: "604d11a44486491bdca94a02",
    //       title: "testing",
    //       postType: "Regular",
    //     });
    //   expect(res.status).toBe(401);
    // });

    it("should update category 200 or 400(category not found)", async () => {
      const post = await Post.find({});
      if (post.length === 0) {
        const res = await request(server)
          .put("/api/posts/604d11a44486491bdca94a02")
          .set("Authorization", `Bearer ${token}`)
          .send({
            id: "604d11a44486491bdca94a02",
            title: "testing",
            postType: "Regular",
          });

        expect(res.status).toBe(404);
      } else {
        const res = await request(server)
          .put(`/api/posts/${post[0]._id}`)
          .set("Authorization", `Bearer ${token}`)
          .send({ id: post[0]._id, title: "testing", postType: "Regular" });

        expect(res.status).toBe(204);
      }
    });
  });

  describe("POST /:id", () => {
    it("Should return unauthorized error(401)", async () => {
      const res = await request(server).post("/api/posts").send({
        title: "testing",
        postType: "Regular",
        sector: "General",
      });
      expect(res.status).toBe(401);
    });

    // it("should create post with 201 or 409(post conflict)", async () => {
    //   let res = await request(server)
    //     .post(`/api/posts`)
    //     .set("Authorization", `Bearer ${token}`)
    //     .send({
    //       title: "testing",
    //       postType: "Regular",
    //       sector: "General",
    //     });
    //   try {
    //     expect(res.status).toBe(201);
    //   } catch (error) {
    //     expect(res.status).toBe(409);
    //   }
    // });
  });

  describe("DELETE /:id", () => {
    it("Should return unauthorized error (401)", async () => {
      const res = await request(server).delete(
        "/api/posts/604bcb69bc74af2970137ef7"
      );
      expect(res.status).toBe(401);
    });

    it("Should return 204 success message for deleting post", async () => {
      //   let post = new Post({
      //     title: "finallymmmwmwm",
      //     postType: "Regular",
      //     sector: "Genehral",
      //   });
      //   post = await post.save();
      const result = await Post.find({});
      const res = await request(server)
        .delete(`/api/posts/${result[0]._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(204);
    });
  });
});
