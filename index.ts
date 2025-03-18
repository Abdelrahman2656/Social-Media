
import { bootstrap } from "./Src/bootstrap"
import { AppRequest, AppResponse } from "./Src/Utils/type"
const express = require('express')
const app = express()
const port = process.env.PORT||3001

//bootstrap
bootstrap(app, express)
export default app
app.get('/', (req:AppRequest, res:AppResponse) => res.send('Hello World! g'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))