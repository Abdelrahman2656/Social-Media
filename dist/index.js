"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_1 = require("./Src/bootstrap");
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
//bootstrap
(0, bootstrap_1.bootstrap)(app, express);
exports.default = app;
app.get('/', (req, res) => res.send('Hello World! g'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
