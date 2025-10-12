import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Slider,
  Grid,
  Divider,
} from '@mui/material';
import type { JournalEntry } from '../../services/journalService';

interface JournalEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entryData: Partial<JournalEntry>) => void;
}

const eventTypes = ['Seizure', 'Fall', 'Allergic Reaction', 'Behavioral Change', 'General Note'];
const moods = ['😊 Happy', '😐 Neutral', '😢 Sad', '😠 Angry', '😟 Anxious'];

// Structured data interfaces
interface SeizureDetails {
  duration: number; // seconds
  severity: number; // 1-10
  triggers: string[];
  recoveryTime: number; // minutes
  witnessed: boolean;
  location: string;
}

interface FallDetails {
  location: string;
  injuries: string[];
  assistanceNeeded: boolean;
  preventionMeasures: string[];
  environmentalFactors: string[];
}

interface AllergicReactionDetails {
  allergen: string;
  symptoms: string[];
  severity: number; // 1-10
  treatmentGiven: string;
  responseTime: number; // minutes
}

interface BehavioralChangeDetails {
  behaviors: string[];
  duration: number; // minutes
  triggers: string[];
  interventions: string[];
  effectiveness: number; // 1-10
}

const JournalEntryDialog = ({ open, onClose, onSubmit }: JournalEntryDialogProps) => {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('General Note');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  // Structured details for each event type
  const [seizureDetails, setSeizureDetails] = useState<SeizureDetails>({
    duration: 30,
    severity: 5,
    triggers: [],
    recoveryTime: 10,
    witnessed: true,
    location: '',
  });

  const [fallDetails, setFallDetails] = useState<FallDetails>({
    location: '',
    injuries: [],
    assistanceNeeded: false,
    preventionMeasures: [],
    environmentalFactors: [],
  });

  const [allergicReactionDetails, setAllergicReactionDetails] = useState<AllergicReactionDetails>({
    allergen: '',
    symptoms: [],
    severity: 5,
    treatmentGiven: '',
    responseTime: 5,
  });

  const [behavioralChangeDetails, setBehavioralChangeDetails] = useState<BehavioralChangeDetails>({
    behaviors: [],
    duration: 30,
    triggers: [],
    interventions: [],
    effectiveness: 5,
  });

  // Reset structured details when event type changes
  useEffect(() => {
    if (eventType === 'Seizure') {
      setTitle('Seizure Episode');
    } else if (eventType === 'Fall') {
      setTitle('Fall Incident');
    } else if (eventType === 'Allergic Reaction') {
      setTitle('Allergic Reaction');
    } else if (eventType === 'Behavioral Change') {
      setTitle('Behavioral Change Observed');
    } else {
      setTitle('');
    }
  }, [eventType]);

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  const handleSubmit = () => {
    let structuredDetails: any = null;

    // Package structured details based on event type
    if (eventType === 'Seizure') {
      structuredDetails = seizureDetails;
    } else if (eventType === 'Fall') {
      structuredDetails = fallDetails;
    } else if (eventType === 'Allergic Reaction') {
      structuredDetails = allergicReactionDetails;
    } else if (eventType === 'Behavioral Change') {
      structuredDetails = behavioralChangeDetails;
    }

    const entryData: Partial<JournalEntry> = {
      title,
      eventType,
      content,
      mood: mood?.split(' ')[1].toLowerCase() || undefined,
      tags: tags.join(', '),
      structuredDetails: structuredDetails ? JSON.stringify(structuredDetails) : undefined,
      entryDate: new Date().toISOString(),
    };
    onSubmit(entryData);
    onClose();
    
    // Reset form
    setTitle('');
    setEventType('General Note');
    setContent('');
    setMood(null);
    setTags([]);
  };

  const handleArrayToggle = (array: string[], value: string, setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Log New Patient Event</DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="Title / Event Summary"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={eventType}
            label="Event Type"
            onChange={(e) => setEventType(e.target.value)}
          >
            {eventTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Structured Fields for Seizure */}
        {eventType === 'Seizure' && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(244, 67, 54, 0.05)', borderRadius: '12px', border: '1px solid rgba(244, 67, 54, 0.2)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#f44336', fontWeight: 600 }}>Seizure Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Duration (seconds): {seizureDetails.duration}s</Typography>
                <Slider
                  value={seizureDetails.duration}
                  onChange={(_, val) => setSeizureDetails({...seizureDetails, duration: val as number})}
                  min={5}
                  max={300}
                  marks={[{value: 5, label: '5s'}, {value: 150, label: '2.5m'}, {value: 300, label: '5m'}]}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Severity (1-10): {seizureDetails.severity}</Typography>
                <Slider
                  value={seizureDetails.severity}
                  onChange={(_, val) => setSeizureDetails({...seizureDetails, severity: val as number})}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Recovery Time (minutes): {seizureDetails.recoveryTime}m</Typography>
                <Slider
                  value={seizureDetails.recoveryTime}
                  onChange={(_, val) => setSeizureDetails({...seizureDetails, recoveryTime: val as number})}
                  min={1}
                  max={60}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={seizureDetails.location}
                  onChange={(e) => setSeizureDetails({...seizureDetails, location: e.target.value})}
                  placeholder="e.g., Living room, Bedroom"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Possible Triggers:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Missed medication', 'Stress', 'Lack of sleep', 'Flashing lights', 'Fever', 'Other'].map(trigger => (
                    <Chip
                      key={trigger}
                      label={trigger}
                      onClick={() => handleArrayToggle(seizureDetails.triggers, trigger, (arr) => setSeizureDetails({...seizureDetails, triggers: arr}))}
                      color={seizureDetails.triggers.includes(trigger) ? 'primary' : 'default'}
                      variant={seizureDetails.triggers.includes(trigger) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Witnessed By</InputLabel>
                  <Select
                    value={seizureDetails.witnessed ? 'yes' : 'no'}
                    label="Witnessed By"
                    onChange={(e) => setSeizureDetails({...seizureDetails, witnessed: e.target.value === 'yes'})}
                  >
                    <MenuItem value="yes">Yes - I witnessed it</MenuItem>
                    <MenuItem value="no">No - Found patient after</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Structured Fields for Fall */}
        {eventType === 'Fall' && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 152, 0, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 152, 0, 0.2)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#ff9800', fontWeight: 600 }}>Fall Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location of Fall"
                  value={fallDetails.location}
                  onChange={(e) => setFallDetails({...fallDetails, location: e.target.value})}
                  placeholder="e.g., Bathroom, Stairs, Kitchen"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Injuries:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['No injuries', 'Bruising', 'Cut/Scrape', 'Swelling', 'Pain', 'Head injury', 'Other'].map(injury => (
                    <Chip
                      key={injury}
                      label={injury}
                      onClick={() => handleArrayToggle(fallDetails.injuries, injury, (arr) => setFallDetails({...fallDetails, injuries: arr}))}
                      color={fallDetails.injuries.includes(injury) ? 'primary' : 'default'}
                      variant={fallDetails.injuries.includes(injury) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Environmental Factors:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Wet floor', 'Poor lighting', 'Clutter', 'Uneven surface', 'No handrail', 'Loose rug'].map(factor => (
                    <Chip
                      key={factor}
                      label={factor}
                      onClick={() => handleArrayToggle(fallDetails.environmentalFactors, factor, (arr) => setFallDetails({...fallDetails, environmentalFactors: arr}))}
                      color={fallDetails.environmentalFactors.includes(factor) ? 'primary' : 'default'}
                      variant={fallDetails.environmentalFactors.includes(factor) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Prevention Measures Taken:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Added non-slip mat', 'Improved lighting', 'Removed clutter', 'Installed handrail', 'Secured rugs', 'Other'].map(measure => (
                    <Chip
                      key={measure}
                      label={measure}
                      onClick={() => handleArrayToggle(fallDetails.preventionMeasures, measure, (arr) => setFallDetails({...fallDetails, preventionMeasures: arr}))}
                      color={fallDetails.preventionMeasures.includes(measure) ? 'primary' : 'default'}
                      variant={fallDetails.preventionMeasures.includes(measure) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Assistance Needed</InputLabel>
                  <Select
                    value={fallDetails.assistanceNeeded ? 'yes' : 'no'}
                    label="Assistance Needed"
                    onChange={(e) => setFallDetails({...fallDetails, assistanceNeeded: e.target.value === 'yes'})}
                  >
                    <MenuItem value="no">No - Patient got up independently</MenuItem>
                    <MenuItem value="yes">Yes - Needed help getting up</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Structured Fields for Allergic Reaction */}
        {eventType === 'Allergic Reaction' && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(233, 30, 99, 0.05)', borderRadius: '12px', border: '1px solid rgba(233, 30, 99, 0.2)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#e91e63', fontWeight: 600 }}>Allergic Reaction Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Allergen / Trigger"
                  value={allergicReactionDetails.allergen}
                  onChange={(e) => setAllergicReactionDetails({...allergicReactionDetails, allergen: e.target.value})}
                  placeholder="e.g., Peanuts, Medication name, Bee sting"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Symptoms:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Rash', 'Itching', 'Swelling', 'Hives', 'Difficulty breathing', 'Nausea', 'Dizziness', 'Other'].map(symptom => (
                    <Chip
                      key={symptom}
                      label={symptom}
                      onClick={() => handleArrayToggle(allergicReactionDetails.symptoms, symptom, (arr) => setAllergicReactionDetails({...allergicReactionDetails, symptoms: arr}))}
                      color={allergicReactionDetails.symptoms.includes(symptom) ? 'primary' : 'default'}
                      variant={allergicReactionDetails.symptoms.includes(symptom) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Severity (1-10): {allergicReactionDetails.severity}</Typography>
                <Slider
                  value={allergicReactionDetails.severity}
                  onChange={(_, val) => setAllergicReactionDetails({...allergicReactionDetails, severity: val as number})}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Response Time (minutes): {allergicReactionDetails.responseTime}m</Typography>
                <Slider
                  value={allergicReactionDetails.responseTime}
                  onChange={(_, val) => setAllergicReactionDetails({...allergicReactionDetails, responseTime: val as number})}
                  min={1}
                  max={60}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Treatment Given"
                  value={allergicReactionDetails.treatmentGiven}
                  onChange={(e) => setAllergicReactionDetails({...allergicReactionDetails, treatmentGiven: e.target.value})}
                  placeholder="e.g., Antihistamine, EpiPen, Called 911"
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Structured Fields for Behavioral Change */}
        {eventType === 'Behavioral Change' && (
          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(156, 39, 176, 0.05)', borderRadius: '12px', border: '1px solid rgba(156, 39, 176, 0.2)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#9c27b0', fontWeight: 600 }}>Behavioral Change Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Observed Behaviors:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Agitation', 'Confusion', 'Aggression', 'Withdrawal', 'Anxiety', 'Restlessness', 'Repetitive actions', 'Other'].map(behavior => (
                    <Chip
                      key={behavior}
                      label={behavior}
                      onClick={() => handleArrayToggle(behavioralChangeDetails.behaviors, behavior, (arr) => setBehavioralChangeDetails({...behavioralChangeDetails, behaviors: arr}))}
                      color={behavioralChangeDetails.behaviors.includes(behavior) ? 'primary' : 'default'}
                      variant={behavioralChangeDetails.behaviors.includes(behavior) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Duration (minutes): {behavioralChangeDetails.duration}m</Typography>
                <Slider
                  value={behavioralChangeDetails.duration}
                  onChange={(_, val) => setBehavioralChangeDetails({...behavioralChangeDetails, duration: val as number})}
                  min={5}
                  max={180}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Possible Triggers:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Pain', 'Hunger', 'Fatigue', 'Overstimulation', 'Change in routine', 'Medication', 'Unknown'].map(trigger => (
                    <Chip
                      key={trigger}
                      label={trigger}
                      onClick={() => handleArrayToggle(behavioralChangeDetails.triggers, trigger, (arr) => setBehavioralChangeDetails({...behavioralChangeDetails, triggers: arr}))}
                      color={behavioralChangeDetails.triggers.includes(trigger) ? 'primary' : 'default'}
                      variant={behavioralChangeDetails.triggers.includes(trigger) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>Interventions Used:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Redirection', 'Calm environment', 'Music', 'Physical activity', 'Medication', 'Social interaction', 'Other'].map(intervention => (
                    <Chip
                      key={intervention}
                      label={intervention}
                      onClick={() => handleArrayToggle(behavioralChangeDetails.interventions, intervention, (arr) => setBehavioralChangeDetails({...behavioralChangeDetails, interventions: arr}))}
                      color={behavioralChangeDetails.interventions.includes(intervention) ? 'primary' : 'default'}
                      variant={behavioralChangeDetails.interventions.includes(intervention) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Intervention Effectiveness (1-10): {behavioralChangeDetails.effectiveness}</Typography>
                <Slider
                  value={behavioralChangeDetails.effectiveness}
                  onChange={(_, val) => setBehavioralChangeDetails({...behavioralChangeDetails, effectiveness: val as number})}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <TextField
          margin="dense"
          label="Additional Notes"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add any additional observations or context..."
          sx={{ mb: 2 }}
        />
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Patient's Mood</Typography>
          <ToggleButtonGroup
            value={mood}
            exclusive
            onChange={(_, newMood) => setMood(newMood)}
            aria-label="patient mood"
          >
            {moods.map(m => (
              <ToggleButton key={m} value={m} aria-label={m}>{m.split(' ')[0]}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Tags</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              size="small"
              variant="outlined"
              label="Add a tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} sx={{ ml: 1 }}>Add</Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map(tag => (
              <Chip key={tag} label={tag} onDelete={() => handleDeleteTag(tag)} />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save Entry</Button>
      </DialogActions>
    </Dialog>
  );
};

export default JournalEntryDialog;
