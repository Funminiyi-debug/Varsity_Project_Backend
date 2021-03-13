import * as helper from "../../../src/utils/helperFunction";
import Jwt from "../../../src/config/jwtHelper";
import mongoose from "mongoose";
import "jest";

describe("helper functions", () => {
  it("should generate random string of numbers with default length of 6", () => {
    const result = helper.generateRandomNumber();
    expect(result.length).toBe(6);
  });

  it("should generate random string of numbers with length equals argument passed", () => {
    const number = 2;
    const result = helper.generateRandomNumber(number);
    expect(result.length).toBe(number);
  });

  it("should generate secret token of length 30", () => {
    const result = helper.generateSecretToken();
    expect(result.length).toBe(30);
  });

  it("should return a valid JWT", async () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: "adewalejosh@gmail.com",
      displayName: "adeneye adewale",
    };

    const token = helper.generateJwtToken(payload);

    await Jwt.verify(token, async (err, decoded) => {
      if (err) {
        expect(() => {
          throw err;
        }).toThrow;
      } else {
        expect(decoded).toMatchObject(payload);
      }
    });
    // const decoded = Jwt.verify(token);
  });
});
