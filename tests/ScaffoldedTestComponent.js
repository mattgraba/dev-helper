Sure, here's a basic example of a modern React functional component using best practices:

```javascript
// Import React and other necessary libraries from react
import React from 'react';
import PropTypes from 'prop-types';

// Component Description
// This is a functional component named "TestComponent" 
// It's a modern React component which follows best practices
const TestComponent = (props) => {
  // Destructure props for easier usage in the component
  const { className, children } = props;

  // Component JSX
  return (
    <div className={className}>
      {children}
    </div>
  );
}

// Prop types validation
// Helps with development to catch potential bugs before they happen
// and provides documentation to other developers working on the project
TestComponent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

// Default props
// Provides default values for props if they aren't provided
TestComponent.defaultProps = {
  className: '',
  children: null,
};

export default TestComponent;
```
This is a simple functional React component that takes in a `className` and `children` as props. It applies the `className` to the div and renders any `children` inside of that div. It includes prop types validation and default props to help catch bugs and document the component.