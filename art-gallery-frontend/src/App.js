import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Assuming you have some CSS in App.css

// Login Component
function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/login', { username, password });
      setToken(data.token);
      alert('Login successful');
    } catch (error) {
      alert('Failed to login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

// Register Component
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/register', { username, password });
      alert('Registration successful');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

// ImageUpload Component
function ImageUpload({ token }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post('http://localhost:5000/upload', formData, config);
      alert('Image uploaded successfully');
      console.log(response.data);
    } catch (error) {
      alert('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button type="submit">Upload Image</button>
    </form>
  );
}

// Gallery Component
function Gallery({ token }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get('http://localhost:5000/images', config);
      setImages(data.images);
    };

    fetchImages();
  }, [token]);

  return (
    <div>
      {images.map((image, index) => (
        <img key={index} src={image.url} alt="Styled" />
      ))}
    </div>
  );
}

// Main App Component with Router
function App() {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login setToken={setToken} />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/upload">
            {token ? <ImageUpload token={token} /> : <Redirect to="/login" />}
          </Route>
          <Route path="/gallery">
            {token ? <Gallery token={token} /> : <Redirect to="/login" />}
          </Route>
          <Redirect from="/" to="/login" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
