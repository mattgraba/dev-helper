Sure, here's an example of a modern React component using best practices:

```jsx
// Importing React and other necessary libraries
import React from 'react';
import PropTypes from 'prop-types';

/**
 * This is a modern functional React component using arrow function.
 * It's named "TestComponent" and it represents a test component in the application.
 * It uses PropTypes for type checking of the props.
 *
 * @param {Object} props - The props that are passed to this component.
 * @returns {JSX.Element} - Returns a JSX element.
 */
const TestComponent = (props) => {
    const { title, description } = props;

    // Render the component
    return (
        <div className="test-component">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
};

// Define the PropTypes for this component
TestComponent.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

// Export the component
export default TestComponent;
```

This is a functional component that receives two props: `title` and `description`. Both of these props are required and must be strings, as dictated by the PropTypes. 

The component itself is quite simple: It renders a `div` with a `h2` and a `p` that display the `title` and `description` props, respectively. 

Please replace the actual logic and structure as per your application's need.