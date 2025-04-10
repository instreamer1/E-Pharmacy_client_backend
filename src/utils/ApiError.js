//utils/ApiError

class ApiError extends Error {
    constructor(status, message, expose = false, errors = []) {
      super(message);
      this.status = status;
      this.errors = errors;
      this.expose = expose;
    }

    static BadRequest(message, errors = []) {
      return new ApiError(400, message, errors);
    }

    static UnauthorizedError(message = "User is not authorized") {
      return new ApiError(401, message, false);
    }

    static ForbiddenError(message = "Forbidden") {
        return new ApiError(403, message, false);
      }

      static NotFound(message = "Not Found") {
        return new ApiError(404, message, false);
      }

      static Conflict(message = "Conflict") {
        return new ApiError(409, message, true);
      }

      static InternalError(message = "Internal Server Error") {
        return new ApiError(500, message, false);
      }
  }

  export default ApiError;
