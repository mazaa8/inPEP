import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Close, PersonAdd } from '@mui/icons-material';

interface NewAdmissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewAdmissionDialog = ({ open, onClose, onSuccess }: NewAdmissionDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    bloodType: '',
    allergies: '',
    chronicConditions: '',
    emergencyContact: '',
    admissionDate: new Date().toISOString().split('T')[0],
    admissionReason: '',
    assignedCaregiver: '',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: event.target.value });
    setError(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.patientName || !formData.email || !formData.dateOfBirth) {
      setError('Patient name, email, and date of birth are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/admissions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
          chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(c => c.trim()) : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admission');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create admission');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      patientName: '',
      email: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      bloodType: '',
      allergies: '',
      chronicConditions: '',
      emergencyContact: '',
      admissionDate: new Date().toISOString().split('T')[0],
      admissionReason: '',
      assignedCaregiver: '',
    });
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(45, 36, 22, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          borderRadius: '20px',
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
        pb: 2,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PersonAdd sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ color: '#FFB74D', fontWeight: 700 }}>
              New Patient Admission
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Register a new patient to your care
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Patient admitted successfully! Default password: Welcome123!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ color: '#FFB74D', fontWeight: 600, mb: 2 }}>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Patient Name *"
              value={formData.patientName}
              onChange={handleChange('patientName')}
              disabled={loading || success}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email *"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              disabled={loading || success}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth *"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange('dateOfBirth')}
              disabled={loading || success}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange('phoneNumber')}
              disabled={loading || success}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={handleChange('address')}
              disabled={loading || success}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          {/* Medical Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ color: '#FFB74D', fontWeight: 600, mb: 2, mt: 2 }}>
              Medical Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Blood Type"
              value={formData.bloodType}
              onChange={handleChange('bloodType')}
              disabled={loading || success}
              placeholder="e.g., O+, A-, AB+"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Emergency Contact"
              value={formData.emergencyContact}
              onChange={handleChange('emergencyContact')}
              disabled={loading || success}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Allergies"
              value={formData.allergies}
              onChange={handleChange('allergies')}
              disabled={loading || success}
              placeholder="Separate with commas (e.g., Penicillin, Peanuts)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Chronic Conditions"
              value={formData.chronicConditions}
              onChange={handleChange('chronicConditions')}
              disabled={loading || success}
              placeholder="Separate with commas (e.g., Hypertension, Diabetes)"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          {/* Admission Details */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ color: '#FFB74D', fontWeight: 600, mb: 2, mt: 2 }}>
              Admission Details
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Admission Date"
              type="date"
              value={formData.admissionDate}
              onChange={handleChange('admissionDate')}
              disabled={loading || success}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Assigned Caregiver (Optional)"
              value={formData.assignedCaregiver}
              onChange={handleChange('assignedCaregiver')}
              disabled={loading || success}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Admission Reason"
              value={formData.admissionReason}
              onChange={handleChange('admissionReason')}
              disabled={loading || success}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#FFB74D' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 152, 0, 0.2)' }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { background: 'rgba(255, 255, 255, 0.05)' },
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={loading || success}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
            color: 'white',
            fontWeight: 600,
            px: 4,
            '&:hover': {
              background: 'linear-gradient(135deg, #F57C00 0%, #FFA000 100%)',
            },
            '&:disabled': {
              background: '#ccc',
            },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Admit Patient'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewAdmissionDialog;
