import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Intro from './pages/Intro';
import Simulation from './pages/Simulation';
import StepByStepSimulation from './pages/StepSimulation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/learn" element={<StepByStepSimulation/>}/>
      </Routes>
    </Router>
  );
}

export default App;
