import express from 'express';
import ConnectDB from './config/connectDB';
import ContactModel from './models/contact.model';

let app = express();

// connect to Mongo
ConnectDB();

app.get('/test-database', async (req, res) => {
  try {
    let Item = {
      userId: 'asdfasdfasdf',
      contactId: 'asdfasdf'
    }
    let contact = await ContactModel.createNew(Item);
    res.send(contact);
  } catch (err) {
    console.log(err);
  }

})

app.listen(process.env.APP_HOST, process.env.APP_HOST, () => {
  console.log(`running on ${process.env.APP_HOST}: ${process.env.APP_HOST}`);
})
