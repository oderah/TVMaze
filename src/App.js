import './App.css';
import { ThemeProvider } from '@material-ui/core';
import theme from './themes';
import HomePage from './components/pages/homePage';

function App() {
  return (
    <ThemeProvider theme={ theme }>
      <div className="App">
        <HomePage />
      </div>
    </ThemeProvider>
  );
}

export default App;
