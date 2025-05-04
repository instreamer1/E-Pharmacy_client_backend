//utils/ApiError

  class ApiError extends Error {
    constructor(status, message, expose = false, errors = []) {
      super(message);
      this.status = status;
      this.name = this.constructor.name;
      this.errors = errors;
      this.expose = expose;

      Error.captureStackTrace(this, this.constructor);
    }
    static shouldExpose(status) {

      return status >= 400 && status < 500;
    }

    static BadRequest(message, errors = []) {
      return new ApiError(400, message, errors);
    }

    static UnauthorizedError(message = "User is not authorized") {
      return new ApiError(401, message);
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
