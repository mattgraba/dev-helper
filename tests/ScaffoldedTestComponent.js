Sure, here is a basic example of a modern functional React component using React Hooks and PropTypes for type checking. I've also included some comments to explain each section.

```jsx
// Import React and PropTypes
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// TestComponent functional component
const TestComponent = ({ initialCount }) => {
  // Use useState for count state
  const [count, setCount] = useState(initialCount);

  // Function to increment count
  const incrementCount = () => {
    setCount(count + 1);
  };

  // Render component
  return (
    <div className="test-component">
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increase Count</button>
    </div>
  );
};

// Define PropTypes for component
TestComponent.propTypes = {
  initialCount: PropTypes.number,
};

// Define default props for component
TestComponent.defaultProps = {
  initialCount: 0,
};

// Export component
export default TestComponent;
```

In this component, we first import the necessary dependencies. The component itself is a functional component that uses the `useState` hook to manage its own state. The initial state value is passed via props.

We then define a function `incrementCount` which is used to increment the value of `count` when a button is clicked.

Finally, we define PropTypes for the component to provide type checking for the props and set default props in case `initialCount` prop is not provided when this component is used.

The component is then exported to be used elsewhere in the application.