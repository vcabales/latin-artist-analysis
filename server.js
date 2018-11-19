const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile(__dirname+'/index.html'))

app.listen(process.env.PORT || 3000, () => console.log(`Example app listening on port ${port}!`))
