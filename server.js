const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

const userData = {
    name: "tabor",
}

const chatMessage = require('./models/chatMessage')

const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://taborgreat:4RItcoXARM01azej@cluster0.lh8r06j.mongodb.net/Chatroom?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log("working")


    res.render('index', { userData })
})


app.get('/getUpdatedMessages', async (req, res) => {
    try {
      const updatedMessages = await chatMessage.find({}).exec();

      res.json(updatedMessages);
    } catch (err) {
      console.error('Error fetching updated messages:', err);
      res.status(500).json({ error: 'Error fetching updated messages' });
    }
  });

  app.post('/submitMessage', (req, res) => {
    const formData = req.body;
    const username = formData.username || 'guest'; // If the username is not provided, use 'guest'
    const message = new chatMessage({
        name: username,
        message: formData.message
    });

    // Save the message to the database
    message.save()
        .then((result) => {
            // Respond with the saved message
            res.json(result);
        })
        .catch((err) => {
            console.error('Error saving message:', err);
            res.status(500).json({ error: 'Error saving message' });
        });
});



const port = 3000;
const localIPAddress = '10.0.0.48'; 

app.listen(port, localIPAddress, () => {
  console.log(`Server is running on http://${localIPAddress}:${port}`);
});