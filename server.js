const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile(__dirname+'/viz_test.html'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
