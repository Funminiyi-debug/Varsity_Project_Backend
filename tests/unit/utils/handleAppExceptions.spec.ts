import handleAppExceptions from "../../../src/utils/handleAppExceptions";
import "jest";

describe("handle app exceptions", () => {
  it("Bad-Data should return statusCode 400", () => {
    const result = handleAppExceptions({
      message: "...",
      name: "BadDataException",
    });

    expect(result.statusCode).toBe(400);
  });

  it("Forbidden & Conflit Exceptions should return statusCode 409", () => {
    const args = [
      { message: "...", name: "ForbiddenException" },
      { message: "...", name: "ConflictException" },
    ];

    args.forEach((args) => {
      const result = handleAppExceptions(args);
      expect(result.statusCode).toBe(409);
    });
  });

  it("ServerError & Unhandled Exceptions should return statusCode 500", () => {
    const args = [
      { message: "...", name: "ServerErrorException" },
      { message: "...", name: " " },
    ];

    args.forEach((args) => {
      const result = handleAppExceptions(args);
      expect(result.statusCode).toBe(500);
    });
  });

  it("NotFoundException should return statusCode 404", () => {
    const result = handleAppExceptions({
      message: "...",
      name: "NotFoundException",
    });

    expect(result.statusCode).toBe(404);
  });

  it("UnauthorizedException should return statusCode 403", () => {
    const result = handleAppExceptions({
      message: "...",
      name: "UnauthorizedException",
    });

    expect(result.statusCode).toBe(403);
  });
});
