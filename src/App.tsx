import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProjectProvider } from './contexts/ProjectContext';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter basename="/AndroidProjectCraft">
      <ThemeProvider>
        <ProjectProvider>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </ProjectProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;