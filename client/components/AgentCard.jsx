Sure, here's a basic example on how to create a `AgentCard` component using React and ES6.

Firstly, we'll create a new directory called `components` in the `src` directory of your project. Inside the `components` directory, create a new file called `AgentCard.js`.

The file structure will look like this:

/src
  /components
    AgentCard.js
```

Now, let's define the `AgentCard` component inside the `AgentCard.js` file:

```jsx
import React from 'react';

// This is a functional component
const AgentCard = ({ agent }) => {
  return (
    <div className="agent-card">
      <img src={agent.image} alt={agent.name} />
      <h2>{agent.name}</h2>
      <p>{agent.description}</p>
    </div>
  );
};

export default AgentCard;
```

This is a functional component in React, which receives an `agent` prop and renders a card containing an image, a name, and a description.

Next, let's use this `AgentCard` component in a parent component. For example, in a component that list all agents:

```jsx
import React from 'react';
import AgentCard from './AgentCard';

const AgentList = ({ agents }) => {
  return (
    <div className="agent-list">
      {agents.map((agent, index) => (
        <AgentCard key={index} agent={agent} />
      ))}
    </div>
  );
};

export default AgentList;
```

In the `AgentList` component, we import the `AgentCard` component and use it to render a list of agents. Each `AgentCard` is given a unique `key` prop (in this case, the index of the agent in the array), and the `agent` object is passed as a prop.

Please note that this is a very basic example, and you may need to adjust it according to your project's specific requirements and styling.