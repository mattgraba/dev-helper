require('dotenv').config(); // Load environment variables from .env file & makes variables like process.env.OPENAI_API_KEY available
const express = require('express'); // Imports the express library -- the key framework for building the HTTP server
const cors = require('cors'); // Imports CORS middleware -- this allows frontend (running on a different port, like localhost:3000)to talk to backend (running on localhost:3001)

const app = express(); // Creates an instance of the express application, stored in variable app. This is the main object that handles all HTTP requests and responses.

app.use(cors()); // Enables CORS for all routes
app.use(express.json()); // Enables the server to parse JSON bodies

const { OpenAI } = require('openai'); // Imports the OpenAI API library

const openai = new OpenAI({ // Creates a new instance of the OpenAI API client
    apiKey: process.env.OPENAI_API_KEY, // Uses the API key from the .env file
});

app.post('/analyze', async (req, res) => {  // Defines a new route that listens for POST requests to /analyze
    const { errorText } = req.body; // Extracts the errorText from the request body
    try {
        const completion = await openai.chat.completions.create({ // Uses the OpenAI API to generate a response
            model: "gpt-4", // Specifies the model to use
            messages: [
                { role: 'system', content: 'You are a helpful programming assistant.' }, // Sets the system prompt
                { role: 'user', content: `Explain and fix the following error: ${errorText}` } // Sets the user prompt
            ],
        });
        const aiResponse = completion.choices[0].message.content; // Extracts the AI response from the completion
        res.json({  // Sends the response back to the frontend
            response: aiResponse // Sends the response back to the frontend
        });
    } catch (error) {
        console.error(error); // Logs the error to the console
        res.status(500).json({ error: 'Failed to analyze error' }); // Sends an error response to the frontend
    }
});

app.listen(3001, () => { // Starts the server and listens for incoming requests on port 3001
    console.log('Server is running on port 3001'); // Logs a message to the console when the server starts
});
