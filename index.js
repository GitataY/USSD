const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

// Simple GET route for the root to check if the server is running
app.get('/ussd', (req, res) => {
  res.send('Server is running!');
});

// Handling POST requests to the '/ussd' endpoint
app.post('/ussd', (req, res) => {
  let { sessionId, serviceCode, phoneNumber, text } = req.body;
  let response = '';

  // Main USSD menu
  if (text === '') {
    response = `CON Welcome to Feed Kenya. Choose an option:
1. Donate
2. Receive
3. Quit`;
  } else if (text === '1') {
    // Donation flow
    response = `CON What's your name?`;
  } else if (text.startsWith('1*')) {
    let textArray = text.split('*');
    if (textArray.length === 2) {
      response = `CON What do you want to donate today?`;
    } else if (textArray.length === 3) {
      response = `CON What is your location?`;
    } else if (textArray.length === 4) {
      let name = textArray[1];
      let donation = textArray[2];
      let location = textArray[3];
      response = `END Thank you ${name} for donating ${donation}. We appreciate your generosity. We will reach out soon`;
    }
  } else if (text === '2') {
    // Receiving flow
    response = `CON What is your name?`;
  } else if (text.startsWith('2*')) {
    let textArray = text.split('*');
    if (textArray.length === 2) {
      response = `CON What is your location?`;
    } else if (textArray.length === 3) {
      response = `CON What do you need?`;
    } else if (textArray.length === 4) {
      let name = textArray[1];
      let location = textArray[2];
      let need = textArray[3];
      response = `END Thank you ${name}. We have received your request for ${need}. We will reach out soon.`;
    }
  } else if (text === '3') {
    // Quit flow
    response = `END Thank you for using our Donation Service.`;
  } else {
    response = `END Invalid option. Please try again.`;
  }

  res.set('Content-Type', 'text/plain');
  res.send(response);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


