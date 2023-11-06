// Config files
import { variables, morgan } from "./config";

// Packages
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

// Routes
import routes from "./routes";

// Errors
import { 
    errorConverter,
    errorHandler,
    Handle404Error,
    iconError
} from "./middlewares";

const whitelist: string[] = [
    "*",
]

function serverApp() {
    const app = express();
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
    app.use(helmet());
    app.use(cors({ origin: whitelist, credentials: true }));
    app.use(compression());
    app.use(express.json({ limit: variables.DATA_LIMIT }));
    app.use(express.urlencoded({ extended: true }));
    app.use(iconError);
    app.use("/api", routes());

    app.use(Handle404Error);
    app.use(errorConverter);
    app.use(errorHandler);
    return app;
}

export default serverApp;
