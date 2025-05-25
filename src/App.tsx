import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnimationPage from './pages/AnimationPage';
import { AnimationProvider } from './context/AnimationContext';

function App() {
  return (
    <AnimationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/animation/:id" element={<AnimationPage />} />
        </Routes>
      </Router>
    </AnimationProvider>
  );
}

export default App;