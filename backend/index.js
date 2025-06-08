const express = require('express')
const bodyParser = require('body-parser');
const cors = require("cors");
const auth = require('./routes/auth');
const recipes = require('./routes/recipes')
const meals = require('./routes/meals')
const checkToken = require('./middlewares/auth/checkToken')

const app = express()
const port = 3000

app.use(cors({
    origin: "*",
    credentials: true
  }));

app.use(bodyParser.json())

//api root endpoints
app.use('/auth', auth);
app.use('/recipes', checkToken, recipes);
app.use('/meals', checkToken, meals);


app.listen(port, ()=> console.log(`App listening on port ${port}!`))