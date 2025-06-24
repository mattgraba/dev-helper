import ErrorInputForm from './components/ErrorInputForm.jsx';
import HistoryPanel from './components/HistoryPanel.jsx';
import { HistoryProvider } from './context/HistoryContext.js';
import './App.css';

function App() {
  return (
    <div>
      <HistoryProvider>
      <h1>My App</h1>
      </HistoryProvider>
      <ErrorInputForm />
      <HistoryPanel />
    </div>
  );
}

export default App;
