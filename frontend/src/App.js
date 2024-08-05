import {Layout} from './component/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {HomePage} from './pages/HomePage';
import { ShowcaseNews } from './pages/ShowcaseNews';
import { LiveNews } from './pages/LiveNews';
import { CategoryNews } from './pages/CategoryNews';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import socket from './socket/socket';
import { useDispatch } from 'react-redux';
import { fetchUser } from './feature/authSlice';
import BookMark from './pages/BookMark';

function App() {
  const [latestnews, setLatestnews] = useState([]);
  const [showcase, setShowcase] = useState([]);
  const dispatch = useDispatch();


  useEffect(() => {
      dispatch(fetchUser());
  }, [dispatch]);



  const fetchLivenews = useCallback(async () => {
    try {
      const response = await axios.get(`/api/fetch-livenews`);
      console.log("LIVE SHOW PLEASE", response.data);
      const newsData = response.data.data || response.data;
      setLatestnews(Array.isArray(newsData) ? newsData : []);
    } catch (error) {
      console.error('Error fetching live news:', error);
    }
  }, []);

  useEffect(() => {
    fetchLivenews();
    socket.on('livenews-update', (data) => {
      setLatestnews((prevShowcase) => Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
    });
    return () => {
      socket.off('livenews-update');
    };
  }, [fetchLivenews]);

  const fetchShowNews = useCallback(async () => {
    try {
      const response = await axios.get(`/api/db-mongo`);
      const { news } = response.data || response.data.news;
      console.log("please showcase news", news);
      setShowcase(news);
    } catch (error) {
      console.error('Error fetching show news:', error);
    }
  }, []);
  
  useEffect(() => {
    fetchShowNews();
    socket.on('shownews-update', (data) => {
      setShowcase(data.data || data.data.news);
    });
    return () => {
      socket.off('shownews-update');
    };
  }, [fetchShowNews]);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage latest={latestnews} shownews={showcase} />} />
          <Route path='/showcase' element={<ShowcaseNews shownews={showcase} />} />
          <Route path='/latest' element={<LiveNews latest={latestnews} />} />
          <Route path='/category' element={<CategoryNews />} />
          <Route path='/bookmark' element={<BookMark />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;