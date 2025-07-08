// Improved JavaScript for CLI testing

// Function to greet a given name
const greet = (name) => {
    if(typeof name !== 'string' || name.trim().length === 0) {
        console.error('Invalid argument. Name should be a non-empty string.');
        return;
    }
    console.log(`Hello, ${name.trim()}`);
}

// Test the greet function
greet("world");