import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Intro from './pages/Intro';
import Simulation from './pages/Simulation';
import StepByStepSimulation from './pages/StepSimulation';
import Lightning from './components/Lightning';

function App() {
  return (
    <Router>
      {/* Global lightning background visible on all routes */}
      <Lightning hue={190} speed={1.0} intensity={0.6} size={1.1} isActive={true} />
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
