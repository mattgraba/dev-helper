Sure, here is a simple scaffold of a modern React component using best practices:

```jsx
// Importing required libraries and components
import React from 'react';
import PropTypes from 'prop-types';

// This is a functional component named TestComponent
const TestComponent = (props) => {
  // Destructuring props for easier usage
  const { title, content } = props;

  // The component returns a JSX element
  return (
    <div className="test-component">
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
}

// Validating props with PropTypes
TestComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

// Providing default props values
TestComponent.defaultProps = {
  title: 'Default title',
  content: 'Default content',
};

// Exporting the component for usage in other parts of the application
export default TestComponent;
```

Explanation:

1. We are creating a functional component which is the recommended way of creating components in modern React. 

2. We're using destructuring to get the `title` and `content` props to make our code more readable.

3. PropTypes are used to validate the props that the component is receiving. This is useful in development mode to catch errors.

4. DefaultProps are being set to provide default values for the props in case they are not provided when the component is used.

5. The component is then exported to be used in other parts of the application.

This is a very basic example. Depending on your project, you might need to include more complex logic, state management with hooks, context, or Redux, as well as side-effects with `useEffect`.