import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/login';
  };

  return (
    <div className="center">
      <h1>Spotify Music App</h1>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

const Dashboard = ({ token }) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (!token) return;
    axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setTracks(res.data.items));
  }, [token]);

  return (
    <div>
      <h2>Your Top Tracks</h2>
      <ul>
        {tracks.map(track => (
          <li key={track.id}>
            <img src={track.album.images[0].url} width={50} alt="" />
            {track.name} by {track.artists.map(a => a.name).join(', ')}
            <audio controls src={track.preview_url}></audio>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.search);
    const accessToken = hash.get('access_token');
    if (accessToken) setToken(accessToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Dashboard token={token} /> : <Login />} />
      </Routes>
    </Router>
  );
};

export default App;
