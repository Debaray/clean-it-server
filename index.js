const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvy8r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("service");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("review");

  app.get('/services', (req, res) => {
    serviceCollection.find()
      .toArray((err, services) => {
        res.send(services)
      })
  })

  app.get('/reviews', (req, res) => {
    reviewCollection.find()
      .toArray((err, reviews) => {
        res.send(reviews)
      })
  })


  app.post('/addAService', (req, res) => {
    const file = req.files.file;
    const title = req.body.serviceTitle;
    const description = req.body.description;
    const allShirtsPrice = req.body.allShirts;
    const pantsJeansSkirtsPrice = req.body.pantsJeansSkirts;
    const sweatersPrice = req.body.sweaters;
    const tieScarfPrice = req.body.tieScarf;
    const coatHeavyJacketDressPrice = req.body.coatHeavyJacketDress;
    const silkSuedeLeathersPrice = req.body.silkSuedeLeathers;
    const curtainsDraperyPrice = req.body.curtainsDrapery;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };
    console.log({ title, description, image,allShirtsPrice,pantsJeansSkirtsPrice,sweatersPrice,tieScarfPrice,coatHeavyJacketDressPrice ,silkSuedeLeathersPrice,curtainsDraperyPrice});
    serviceCollection.insertOne({ title, description, image,allShirtsPrice,pantsJeansSkirtsPrice,sweatersPrice,tieScarfPrice,coatHeavyJacketDressPrice ,silkSuedeLeathersPrice,curtainsDraperyPrice})
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;

    console.log(newAdmin);
    adminCollection.insertOne(newAdmin)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log(newReview);
    reviewCollection.insertOne(newReview)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })
  console.log('db connection established');


});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})