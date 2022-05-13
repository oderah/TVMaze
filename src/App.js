import logo from './logo.svg';
import './App.css';
import ShowCard from './components/showCard';
import request from './services/apiService';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '@material-ui/core';
import theme from './themes';

function App() {
  const [ shows, setShows ] = useState([])

  const gets = async () => {
    const res = await request({
      type: 'get',
      url: 'https://api.tvmaze.com/shows'
    })
    setShows(res.data)
  }  

  useEffect(() => {
    gets()
  }, [])

  return (
    <ThemeProvider theme={  theme }>
      <div className="App">
        {shows.length > 0 && <ShowCard show={ shows[219] } />}
      </div>
    </ThemeProvider>
  );
}

export default App;
