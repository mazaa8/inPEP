import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import WelcomeHomePage from './pages/landing/WelcomeHomePage';
import WelcomeHomePatient from './pages/landing/WelcomeHomePatient';
import WelcomeHomeInsurer from './pages/landing/WelcomeHomeInsurer';
import WelcomeHomeProvider from './pages/landing/WelcomeHomeProvider';
import LoginPage from './pages/auth/LoginPage';
import RealLoginPage from './pages/auth/RealLoginPage';
import TestLogin from './pages/auth/TestLogin';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import PatientSupportPage from './pages/patient/PatientSupportPage';
import PatientAppointmentsPage from './pages/patient/PatientAppointmentsPage';
import MealPlanPage from './pages/patient/MealPlanPage';
import PatientHerediblesPage from './pages/patient/HerediblesPage';
import CaregiverDashboard from './pages/dashboards/CaregiverDashboard';
import ProviderDashboard from './pages/dashboards/ProviderDashboard';
import ProviderMessagesPage from './pages/provider/ProviderMessagesPage';
import ProviderAppointmentsPage from './pages/provider/ProviderAppointmentsPage';
import ProviderDirectoryPage from './pages/provider/ProviderDirectoryPage';
import AIAdherenceTracking from './pages/provider/AIAdherenceTracking';
import EMRIntegrationPage from './pages/provider/EMRIntegrationPage';
import AnalyticsPage from './pages/dashboards/AnalyticsPage';
import InsurerDashboard from './pages/dashboards/InsurerDashboard';
import InsurerMessagesPage from './pages/insurer/InsurerMessagesPage';
import ProfilePage from './pages/profile/ProfilePage';
import MessagesPage from './pages/messages/MessagesPage';
import SettingsPage from './pages/settings/SettingsPage';
import PatientMonitorPage from './pages/caregiver/PatientMonitorPage';
import CarePlanningPage from './pages/caregiver/CarePlanningPage';
import CaregiverSupportPage from './pages/caregiver/CaregiverSupportPage';
import ReclaimePage from './pages/caregiver/ReclaimePage';
import GroceryShoppingListPage from './pages/caregiver/features/GroceryShoppingListPage';
import CaregiverHerediblesPage from './pages/caregiver/CaregiverHerediblesPage';
import PharmacyPage from './pages/caregiver/features/PharmacyPage';
import CaregivingTipsPage from './pages/caregiver/features/CaregivingTipsPage';
import ChampionCornerPage from './pages/caregiver/features/ChampionCornerPage';
import StorySubmissionPage from './pages/caregiver/features/StorySubmissionPage';
import MedicationSchedulePage from './pages/caregiver/features/MedicationSchedulePage';
import CaregiverMessagesPage from './pages/caregiver/MessagesPage';
import CaregiverWelcomeLand from './pages/dashboard/CaregiverWelcomeLand';
import AppointmentsBillingPage from './pages/caregiver/features/AppointmentsBillingPage';
import PaymentMethodsPage from './pages/caregiver/features/PaymentMethodsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import HelpCenter from './pages/support/HelpCenter';
import TermsOfService from './pages/support/TermsOfService';
import PrivacyPolicy from './pages/support/PrivacyPolicy';
import { AuthProvider } from './context/AuthContext';
import { EmergencyAlertProvider } from './context/EmergencyAlertContext';
import { PatientSummaryProvider } from './context/PatientSummaryContext';
import { VideoCallProvider } from './context/VideoCallContext';

function App() {
  return (
    <AuthProvider>
      <VideoCallProvider>
        <EmergencyAlertProvider>
          <PatientSummaryProvider>
            <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth" element={<RealLoginPage />} />
            <Route path="/test-login" element={<TestLogin />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
              <Route path="/welcome-home/patient" element={<WelcomeHomePatient />} />
              <Route path="/dashboard/patient" element={<PatientDashboard />} />
              <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
              <Route path="/patient/meal-plan" element={<MealPlanPage />} />
              <Route path="/patient/heredibles" element={<PatientHerediblesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['CAREGIVER']} />}>
              <Route path="/patient-support" element={<PatientSupportPage />} />
              <Route path="/dashboard/caregiver" element={<CaregiverDashboard />} />
              <Route path="/patient-monitor" element={<PatientMonitorPage />} />
              <Route path="/caregiver/heredibles" element={<CaregiverHerediblesPage />} />
              <Route path="/care-planning" element={<CarePlanningPage />} />
              <Route path="/caregiver-support" element={<CaregiverSupportPage />} />
              <Route path="/reclaime" element={<ReclaimePage />} />
              <Route path="/caregiver/grocery-list" element={<GroceryShoppingListPage />} />
              <Route path="/caregiver/pharmacy" element={<PharmacyPage />} />
              <Route path="/caregiver/care-tips" element={<CaregivingTipsPage />} />
              <Route path="/caregiver/appointments-billing" element={<AppointmentsBillingPage />} />
              <Route path="/caregiver/payment-methods" element={<PaymentMethodsPage />} />
              <Route path="/champion-corner" element={<ChampionCornerPage />} />
              <Route path="/share-your-story" element={<StorySubmissionPage />} />
              <Route path="/caregiver/messages" element={<CaregiverMessagesPage />} />
              <Route path="/caregiver/medication-schedule" element={<MedicationSchedulePage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['PROVIDER']} />}>
              <Route path="/welcome-home/provider" element={<WelcomeHomeProvider />} />
              <Route path="/dashboard/provider" element={<ProviderDashboard />} />
              <Route path="/provider/ai-adherence" element={<AIAdherenceTracking />} />
              <Route path="/provider/emr-integration" element={<EMRIntegrationPage />} />
              <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
              <Route path="/provider/messages" element={<ProviderMessagesPage />} />
              <Route path="/provider/appointments" element={<ProviderAppointmentsPage />} />
              <Route path="/provider/directory" element={<ProviderDirectoryPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['INSURER']} />}>
              <Route path="/welcome-home/insurer" element={<WelcomeHomeInsurer />} />
              <Route path="/dashboard/insurer" element={<InsurerDashboard />} />
              <Route path="/insurer/messages" element={<InsurerMessagesPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['CAREGIVER']} />}>
              <Route path="/welcome-home" element={<WelcomeHomePage />} />
              <Route path="/dashboard" element={<CaregiverWelcomeLand />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
          </Router>
        </PatientSummaryProvider>
      </EmergencyAlertProvider>
      </VideoCallProvider>
    </AuthProvider>
  );
}

export default App;
