class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    override stack?: string;
  
    constructor(
      statusCode: number,
      message = 'internal server error',
      isOperational = true,
      stack = '',
     ) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export default ApiError