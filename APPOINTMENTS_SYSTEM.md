# Appointments System - Implementation Guide

## ✅ What's Been Built

### Backend (Complete)

#### 1. **Database Schema**
- New `Appointment` table in SQLite database
- Fields include:
  - Patient and Provider information
  - Date/time (startTime, endTime, duration)
  - Location (physical or virtual)
  - Status (SCHEDULED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)
  - Specialty, appointment type, notes
  - Metadata (createdAt, updatedAt, createdBy)

#### 2. **API Endpoints** (All Protected with JWT)
```
GET    /api/appointments              - Get all appointments (filtered by role)
GET    /api/appointments/:id          - Get single appointment
POST   /api/appointments              - Create new appointment
PUT    /api/appointments/:id          - Update appointment
PATCH  /api/appointments/:id/cancel   - Cancel appointment
DELETE /api/appointments/:id          - Delete appointment
```

#### 3. **Role-Based Access Control**
- **PATIENT**: Can view their own appointments
- **PROVIDER**: Can view/create/update appointments they're assigned to
- **CAREGIVER**: Can view/manage all appointments (for their patients)
- **INSURER**: Can view appointment data for analytics

### Frontend (Complete)

#### 1. **Appointment Service** (`src/services/appointmentService.ts`)
- Full TypeScript interfaces
- Methods for all CRUD operations
- Integrated with authentication (JWT tokens)

#### 2. **Sample Data Created**
- 2 test appointments for Test Patient
- Appointments visible to patient@test.com and provider@test.com

---

## 🧪 Testing the Appointments API

### 1. **Get Appointments** (as Patient)
```bash
# Login as patient
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@test.com","password":"password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Get appointments
curl -X GET http://localhost:3000/api/appointments \
  -H "Authorization: Bearer $TOKEN"
```

### 2. **Create Appointment** (as Provider)
```bash
# Login as provider
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"provider@test.com","password":"password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Create appointment
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "patientId": "b805ec90-e553-4de7-9de0-45f2eb73d1ba",
    "patientName": "Test Patient",
    "providerId": "2a2b6a9c-6bde-41f0-b722-4d0102238b1f",
    "providerName": "Test Provider",
    "title": "Physical Therapy",
    "specialty": "Physical Therapy",
    "startTime": "2025-10-20T09:00:00Z",
    "endTime": "2025-10-20T10:00:00Z",
    "duration": 60,
    "location": "Therapy Center"
  }'
```

### 3. **Update Appointment**
```bash
curl -X PUT http://localhost:3000/api/appointments/APPOINTMENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "CONFIRMED"}'
```

### 4. **Cancel Appointment**
```bash
curl -X PATCH http://localhost:3000/api/appointments/APPOINTMENT_ID/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"cancelReason": "Patient requested reschedule"}'
```

---

## 📋 Next Steps - Frontend Integration

### Step 1: Update Patient Dashboard
Connect the existing appointment calendar component to fetch real data from the API.

**File**: `src/pages/dashboards/PatientDashboard.tsx`

**Changes needed**:
1. Import `appointmentService`
2. Use `useEffect` to fetch appointments on mount
3. Transform API data to calendar format
4. Add loading and error states

### Step 2: Update Caregiver Dashboard
Similar to patient dashboard, but caregivers see all patient appointments.

**File**: `src/pages/dashboards/CaregiverDashboard.tsx`

### Step 3: Update Provider Appointments Page
Add ability to create, view, and manage appointments.

**File**: `src/pages/provider/ProviderAppointmentsPage.tsx`

**Features to add**:
- Calendar view of all appointments
- Form to create new appointments
- Edit/cancel existing appointments
- Filter by date range, patient, status

### Step 4: Create Appointment Modal/Form
Reusable component for creating/editing appointments.

**New file**: `src/components/appointments/AppointmentModal.tsx`

**Features**:
- Form fields for all appointment data
- Patient selector (for providers/caregivers)
- Date/time picker
- Location (physical/virtual toggle)
- Validation

---

## 🎯 User IDs for Testing

```javascript
// Use these IDs when creating appointments via API or frontend

const testUsers = {
  patient: {
    id: 'b805ec90-e553-4de7-9de0-45f2eb73d1ba',
    email: 'patient@test.com',
    name: 'Test Patient'
  },
  caregiver: {
    id: '2bb91f84-03a4-4490-b692-45af975a99ba',
    email: 'caregiver@test.com',
    name: 'Test Caregiver'
  },
  provider: {
    id: '2a2b6a9c-6bde-41f0-b722-4d0102238b1f',
    email: 'provider@test.com',
    name: 'Test Provider'
  },
  insurer: {
    id: 'd3b36b30-9afc-4ce9-9fec-fdc3cdb885f1',
    email: 'insurer@test.com',
    name: 'Test Insurer'
  }
};
```

---

## 🔧 Frontend Integration Example

```typescript
// Example: Fetching appointments in a component

import { useEffect, useState } from 'react';
import { appointmentService, Appointment } from '../services/appointmentService';

function AppointmentCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {appointments.map(apt => (
        <div key={apt.id}>
          <h3>{apt.title}</h3>
          <p>{new Date(apt.startTime).toLocaleString()}</p>
          <p>Provider: {apt.providerName}</p>
          <p>Location: {apt.location}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Current Status

✅ **Backend Complete**
- Database schema
- API endpoints
- Authentication/authorization
- Sample data

✅ **Frontend Service Complete**
- TypeScript interfaces
- API integration methods

⏳ **Pending**
- Connect UI components to API
- Add appointment creation forms
- Implement calendar views with real data
- Add notifications

---

## 🚀 Ready to Continue?

The appointments system backend is fully functional! You can now:

1. **Test the API** using the curl commands above
2. **Connect the frontend** components to display real data
3. **Add appointment creation** forms for providers/caregivers
4. **Implement notifications** for upcoming appointments

Would you like me to connect the frontend components next?
