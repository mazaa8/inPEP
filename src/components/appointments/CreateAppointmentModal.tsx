import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { appointmentService, type CreateAppointmentData } from '../../services/appointmentService';
import { providerService, type Provider } from '../../services/providerService';

interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providerId?: string;
  providerName?: string;
}

const CreateAppointmentModal = ({
  open,
  onClose,
  onSuccess,
  providerId: defaultProviderId,
}: CreateAppointmentModalProps) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    title: '',
    description: '',
    specialty: '',
    appointmentType: 'Consultation',
    startTime: '',
    endTime: '',
    duration: 30,
    location: '',
    isVirtual: false,
    meetingLink: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchProviders();
    }
  }, [open]);

  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);
      const data = await providerService.getProviders();
      setProviders(data);
      
      // Set default provider if provided
      if (defaultProviderId) {
        const defaultProvider = data.find(p => p.id === defaultProviderId);
        if (defaultProvider) {
          setSelectedProvider(defaultProvider);
          setFormData(prev => ({ ...prev, specialty: defaultProvider.specialty }));
        }
      }
    } catch (err) {
      console.error('Failed to load providers:', err);
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validation
      if (!selectedProvider) {
        setError('Please select a provider');
        return;
      }
      
      if (!formData.patientId || !formData.title || !formData.startTime || !formData.endTime) {
        setError('Please fill in all required fields');
        return;
      }

      const appointmentData: CreateAppointmentData = {
        patientId: formData.patientId,
        patientName: formData.patientName,
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        title: formData.title,
        description: formData.description,
        specialty: formData.specialty || selectedProvider.specialty,
        appointmentType: formData.appointmentType,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        duration: formData.duration,
        location: formData.location,
        isVirtual: formData.isVirtual,
        meetingLink: formData.meetingLink,
        notes: formData.notes,
      };

      await appointmentService.createAppointment(appointmentData);
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        patientId: '',
        patientName: '',
        title: '',
        description: '',
        specialty: '',
        appointmentType: 'Consultation',
        startTime: '',
        endTime: '',
        duration: 30,
        location: '',
        isVirtual: false,
        meetingLink: '',
        notes: '',
      });
      setSelectedProvider(null);
    } catch (err) {
      console.error('Failed to create appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Appointment</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {error && (
            <Grid item xs={12}>
              <TextField
                error
                fullWidth
                value={error}
                InputProps={{ readOnly: true }}
                variant="outlined"
                size="small"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Autocomplete
              options={providers}
              getOptionLabel={(option) => `${option.name} - ${option.specialty}`}
              value={selectedProvider}
              onChange={(_, newValue) => {
                setSelectedProvider(newValue);
                if (newValue) {
                  handleChange('specialty', newValue.specialty);
                }
              }}
              loading={loadingProviders}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Provider *"
                  placeholder="Search by name or specialty..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingProviders ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Patient ID"
              value={formData.patientId}
              onChange={(e) => handleChange('patientId', e.target.value)}
              helperText="Use: b805ec90-e553-4de7-9de0-45f2eb73d1ba"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Patient Name"
              value={formData.patientName}
              onChange={(e) => handleChange('patientName', e.target.value)}
              helperText="Optional (auto-filled if empty)"
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Annual Checkup"
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Specialty"
              value={formData.specialty}
              onChange={(e) => handleChange('specialty', e.target.value)}
              placeholder="Auto-filled from provider"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Appointment Type"
              value={formData.appointmentType}
              onChange={(e) => handleChange('appointmentType', e.target.value)}
              size="small"
            >
              <MenuItem value="Consultation">Consultation</MenuItem>
              <MenuItem value="Follow-up">Follow-up</MenuItem>
              <MenuItem value="Procedure">Procedure</MenuItem>
              <MenuItem value="Checkup">Checkup</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="datetime-local"
              label="Start Time"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="datetime-local"
              label="End Time"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Duration (minutes)"
              value={formData.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value))}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isVirtual}
                  onChange={(e) => handleChange('isVirtual', e.target.checked)}
                />
              }
              label="Virtual Appointment"
            />
          </Grid>

          {!formData.isVirtual ? (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Main Hospital, Room 301"
                size="small"
              />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meeting Link"
                value={formData.meetingLink}
                onChange={(e) => handleChange('meetingLink', e.target.value)}
                placeholder="e.g., https://zoom.us/j/..."
                size="small"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !selectedProvider}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAppointmentModal;
