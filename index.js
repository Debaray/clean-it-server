const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const groceryCollection = client.db(`${process.env.DB_NAME}`).collection("products");
    const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
    app.post('/addAService', (req, res) => {
        const file = req.files.file;
        const name = req.body.serviceTitle;
        const email = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        console.log({ name, email, image });
        // doctorCollection.insertOne({ name, email, image })
        //     .then(result => {
        //         res.send(result.insertedCount > 0);
        //     })
    })


   

});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})