"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const dbconnection_1 = require("../Database/dbconnection");
const asyncHandler_1 = require("./Middleware/asyncHandler");
const Modules_1 = require("./Modules");
const bootstrap = (app, express) => {
    //-----------------------------------------------parse------------------------------------------------------------
    app.use(express.json());
    dotenv_1.default.config({ path: path_1.default.resolve("./.env") });
    app.use((0, cors_1.default)({
        origin: '*',
    }));
    //-----------------------------------------------DataBase Connection------------------------------------------------------------
    (0, dbconnection_1.dbconnection)();
    //----------------------------------------------- Use the auth router------------------------------------------------------------
    app.use('/api/v1', Modules_1.userRouter);
    //-----------------------------------------------globalErrorHandling------------------------------------------------------------
    app.use(asyncHandler_1.globalErrorHandling);
};
exports.bootstrap = bootstrap;
