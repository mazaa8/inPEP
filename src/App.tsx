import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import CaregiverDashboard from './pages/dashboards/CaregiverDashboard';
import ProviderDashboard from './pages/dashboards/ProviderDashboard';
import InsurerDashboard from './pages/dashboards/InsurerDashboard';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Caregiver']} />}>
          <Route path="/dashboard/caregiver" element={<CaregiverDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Provider']} />}>
          <Route path="/dashboard/provider" element={<ProviderDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Insurer']} />}>
          <Route path="/dashboard/insurer" element={<InsurerDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


