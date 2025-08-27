import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import CaregiverDashboard from './pages/dashboards/CaregiverDashboard';
import ProviderDashboard from './pages/dashboards/ProviderDashboard';
import InsurerDashboard from './pages/dashboards/InsurerDashboard';
import ProfilePage from './pages/profile/ProfilePage';
import MessagesPage from './pages/messages/MessagesPage';
import SettingsPage from './pages/settings/SettingsPage';
import PatientMonitorPage from './pages/caregiver/PatientMonitorPage';
import CarePlanningPage from './pages/caregiver/CarePlanningPage';
import CaregiverSupportPage from './pages/caregiver/CaregiverSupportPage';
import ReclaimePage from './pages/caregiver/ReclaimePage';
import GroceryShoppingListPage from './pages/caregiver/features/GroceryShoppingListPage';
import WeeklyMenuPage from './pages/caregiver/features/WeeklyMenuPage';
import PharmacyPage from './pages/caregiver/features/PharmacyPage';
import CaregivingTipsPage from './pages/caregiver/features/CaregivingTipsPage';
import AppointmentsBillingPage from './pages/caregiver/features/AppointmentsBillingPage';
import PaymentMethodsPage from './pages/caregiver/features/PaymentMethodsPage';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>
          <Route path="/dashboard/patient" element={<PatientDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Caregiver']} />}>
          <Route path="/dashboard/caregiver" element={<CaregiverDashboard />} />
          <Route path="/patient-monitor" element={<PatientMonitorPage />} />
          <Route path="/care-planning" element={<CarePlanningPage />} />
          <Route path="/caregiver-support" element={<CaregiverSupportPage />} />
          <Route path="/reclaime" element={<ReclaimePage />} />
          <Route path="/caregiver/grocery-list" element={<GroceryShoppingListPage />} />
          <Route path="/caregiver/weekly-menu" element={<WeeklyMenuPage />} />
          <Route path="/caregiver/pharmacy" element={<PharmacyPage />} />
          <Route path="/caregiver/care-tips" element={<CaregivingTipsPage />} />
          <Route path="/caregiver/appointments-billing" element={<AppointmentsBillingPage />} />
          <Route path="/caregiver/payment-methods" element={<PaymentMethodsPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Provider']} />}>
          <Route path="/dashboard/provider" element={<ProviderDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Insurer']} />}>
          <Route path="/dashboard/insurer" element={<InsurerDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Patient', 'Caregiver', 'Provider', 'Insurer']} />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


