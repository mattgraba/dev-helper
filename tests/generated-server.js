```javascript
// Import the express module
const express = require('express');

// Create a new express application
const app = express();

// Define a route handler for GET requests made to the root path
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Have the application listen on a specific port
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
```