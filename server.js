const express = require("express");
const bodyParser=require("body-parser");
const routes=require('./route');
const app = express();


app.use("/client", express.static(process.cwd() + "/client"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine','pug');

routes(app);
app.listen(3000, ()=>{
    console.log('server started at 3000');
})