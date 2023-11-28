import { variables } from "@/config";

const port = variables.PORT;

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "STORE MANAGER APIs DOCUMENTATION",
    version: "0.0.1",
    description: "Store Manager APIs for development",
    license: {
      name: "ISC",
      url: "",
    },
  },
  servers: [
    {
      url: `http://localhost:${port}/api/v1`,
      description: "Development Server",
    },
  ],
};

export default swaggerDefinition;