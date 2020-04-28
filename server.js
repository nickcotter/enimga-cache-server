const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const port = 8080

app.use(bodyParser.json());
app.use(bodyParser.text());

var entitiesRouter = require('./routes/entities');

app.use('/', express.static('static'))
app.use('/entities', entitiesRouter);


app.listen(port, () => console.log(`Enigma Cache Server listening at http://localhost:${port}`))