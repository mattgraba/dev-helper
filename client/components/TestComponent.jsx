Sure, let's start from the very beginning.

1. First, we'll create a new directory for our project. Let's call it `my-test-component`.

mkdir my-test-component
cd my-test-component
```

2. Now, we'll initialize a new npm project. This will create a `package.json` file, which will keep track of our project's dependencies.

```bash
npm init -y
```

3. We're going to use React for our component, so let's install that now.

```bash
npm install react react-dom
```

4. We'll create a new directory to hold our component, and then create the component file itself.

```bash
mkdir src
touch src/TestComponent.js
```

5. Now, let's create a simple boilerplate for our `TestComponent` component. 

In `src/TestComponent.js`:

```javascript
import React from 'react';

class TestComponent extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
      </div>
    );
  }
}

export default TestComponent;
```

This is a basic React component that returns a `div` containing a `h1` tag. You can replace the `h1` tag with whatever you want your component to render.

6. To test our component, we'll need to create an index file that uses it. 

```bash
touch src/index.js
```

In `src/index.js`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import TestComponent from './TestComponent';

ReactDOM.render(
  <React.StrictMode>
    <TestComponent />
  </React.StrictMode>,
  document.getElementById('root')
);
```

7. We'll also need to create an `index.html` file that our React code can hook into. 

In the root directory:

```bash
touch index.html
```

In `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Test Component</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./src/index.js"></script>
  </body>
</html>
```

This is a basic setup for a React project with a single `TestComponent`. You can expand upon this to add more components, styles, and functionality as needed.