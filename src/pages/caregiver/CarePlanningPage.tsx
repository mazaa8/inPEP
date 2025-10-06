import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Stack,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  MedicalInformationOutlined,
  AccessibilityNewOutlined,
  ContactsOutlined,
  AssignmentIndOutlined,
  RemoveCircleOutline,
  AddCircleOutline,
  FavoriteBorder,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import CaregiverPageWrapper from '../../components/layout/CaregiverPageWrapper';
import { roleColors } from '../../styles/glassmorphism';

const initialCarePlanData = {
  individualNeeds: {
    name: 'Abdeen White',
    dob: 'October 15, 1945',
    conditions: ['Heart Diseases', 'Chronic Pancreatitis', 'Mild Cognitive Impairment'],
    personalCare: ['Assistance with bathing twice a week', 'Medication reminders', 'Meal preparation'],
  },
  preferences: {
    goals: 'Maintain independence at home for as long as possible.',
    lifestyle: 'Enjoys listening to classical music, gardening, and watching old movies.',
    values: 'Quiet mornings and social interactions in the afternoon.',
  },
  medicalInfo: {
    primaryCarePhysician: { name: 'Dr. Alan Grant', contact: '555-0101' },
    specialists: [{ name: 'Dr. Ellie Sattler (Cardiologist)', contact: '555-0102' }],
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    ],
    allergies: 'Penicillin',
  },
  supportServices: {
    therapies: ['Physical therapy once a week for mobility'],
    homeHealthAide: { name: 'Sarah Connor', agency: 'FutureCare Home Health', contact: '555-0103' },
  },
  roles: {
    primaryCaregiver: { name: 'Nora (Daughter)', responsibilities: 'Assists with daily needs, groceries, meals, and companionship.' },
    secondaryCaregiver: { name: 'Sarah (Daughter)', responsibilities: 'Manages finances, schedules appointments, provides transport.' },
  },
};

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <Accordion 
    defaultExpanded 
    sx={{ 
      mb: 3,
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '20px !important',
      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
      '&:before': {
        display: 'none',
      },
      '&.Mui-expanded': {
        margin: '0 0 24px 0',
      },
    }}
  >
    <AccordionSummary 
      expandIcon={<ExpandMoreIcon sx={{ color: roleColors.CAREGIVER.primary }} />}
      sx={{
        borderRadius: '20px',
        '&:hover': {
          background: 'rgba(76, 175, 80, 0.05)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          background: roleColors.CAREGIVER.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
        }}>
          <Box sx={{ color: 'white', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>{title}</Typography>
      </Box>
    </AccordionSummary>
    <AccordionDetails sx={{ 
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '0 0 20px 20px',
      p: 3,
    }}>
      {children}
    </AccordionDetails>
  </Accordion>
);

const CarePlanningPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [carePlanData, setCarePlanData] = useState(initialCarePlanData);
  const [errors, setErrors] = useState<any>({});

  const handleMenuNavigation = (path: string) => {
    navigate(path);
  };

  const validate = () => {
    const newErrors: any = {};
    if (!carePlanData.roles.primaryCaregiver.name.trim()) {
      newErrors.primaryCaregiverName = 'Primary caregiver name is required.';
    }
    if (!carePlanData.medicalInfo.primaryCarePhysician.name.trim()) {
      newErrors.physicianName = 'Physician name is required.';
    }
    if (!carePlanData.medicalInfo.primaryCarePhysician.contact.trim()) {
      newErrors.physicianContact = 'Physician contact is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleAddItem = (path: string, newItem: any) => {
    setCarePlanData(prevData => {
      const keys = path.split('.');
      const newData = { ...prevData };
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = [...current[keys[keys.length - 1]], newItem];
      return newData;
    });
  };

  const handleRemoveItem = (path: string, index: number) => {
    setCarePlanData(prevData => {
      const keys = path.split('.');
      const newData = { ...prevData };
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      const array = current[keys[keys.length - 1]];
      array.splice(index, 1);
      current[keys[keys.length - 1]] = [...array];

      return newData;
    });
  };

  const handleSave = () => {
    if (validate()) {
      console.log('Care plan saved:', carePlanData);
      setIsEditing(false);
      setErrors({});
    }
  };

    const handleInputChange = (path: string, value: any) => {
    const errorKeyMap: { [key: string]: string } = {
      'roles.primaryCaregiver.name': 'primaryCaregiverName',
      'medicalInfo.primaryCarePhysician.name': 'physicianName',
      'medicalInfo.primaryCarePhysician.contact': 'physicianContact',
    };

    const errorKey = errorKeyMap[path];
    if (errorKey && errors[errorKey]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
    setCarePlanData(prevData => {
      const keys = path.split('.');
      const newData = { ...prevData };
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const match = key.match(/(\w+)\[(\d+)\]/);
        if (match) {
          const arrayKey = match[1];
          const index = parseInt(match[2], 10);
          current[arrayKey] = [...(current[arrayKey] || [])];
          current = current[arrayKey][index];
        } else {
          current[key] = { ...(current[key] || {}) };
          current = current[key];
        }
      }

      const lastKey = keys[keys.length - 1];
      const lastMatch = lastKey.match(/(\w+)\[(\d+)\]/);
      if (lastMatch) {
        const arrayKey = lastMatch[1];
        const index = parseInt(lastMatch[2], 10);
        current[arrayKey][index] = value;
      } else {
        current[lastKey] = value;
      }

      return newData;
    });
  };

  return (
    <CaregiverPageWrapper
      title={`Wellness Care Plan for ${carePlanData.individualNeeds.name}`}
      subtitle="A person-centered roadmap for health, social, and personal care"
      icon={<FavoriteBorder />}
    >
      {/* Edit Controls */}
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '16px',
        p: 2,
        mb: 3,
        display: 'flex',
        justifyContent: 'flex-end',
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
      }}>
        <Stack direction="row" spacing={1}>
          {isEditing ? (
            <>
              <Button 
                variant="contained" 
                onClick={handleSave}
                sx={{
                  background: roleColors.CAREGIVER.gradient,
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                Save
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => { setIsEditing(false); setCarePlanData(initialCarePlanData); setErrors({}); }}
                sx={{
                  borderColor: roleColors.CAREGIVER.primary,
                  color: roleColors.CAREGIVER.primary,
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => setIsEditing(true)}
              sx={{
                background: roleColors.CAREGIVER.gradient,
                color: 'white',
                fontWeight: 700,
              }}
            >
              Edit Plan
            </Button>
          )}
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Section icon={<AccessibilityNewOutlined />} title="Patient Profile">
          <Grid container spacing={2}>
            {/* Basic Info Row */}
            <Grid item xs={12}>
              <Box sx={{
                background: 'rgba(76, 175, 80, 0.08)',
                borderRadius: '12px',
                p: 2,
                border: '1px solid rgba(76, 175, 80, 0.2)',
              }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    {isEditing ? (
                      <TextField
                        label="Date of Birth"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={carePlanData.individualNeeds.dob}
                        onChange={(e) => handleInputChange('individualNeeds.dob', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                            borderRadius: '8px',
                          },
                        }}
                      />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                          Date of Birth
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#1b5e20', fontWeight: 600, mt: 0.5 }}>
                          {carePlanData.individualNeeds.dob}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                      Health Conditions
                    </Typography>
                    {isEditing ? (
                      <Box>
                        {carePlanData.individualNeeds.conditions.map((item, index) => (
                          <Stack direction="row" spacing={1} key={index} sx={{ mb: 0.5 }}>
                            <TextField 
                              size="small" 
                              fullWidth 
                              defaultValue={item} 
                              onChange={e => handleInputChange(`individualNeeds.conditions[${index}]`, e.target.value)}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  bgcolor: 'white',
                                  borderRadius: '8px',
                                },
                              }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => handleRemoveItem('individualNeeds.conditions', index)}
                              sx={{ color: '#d32f2f' }}
                            >
                              <RemoveCircleOutline fontSize="small" />
                            </IconButton>
                          </Stack>
                        ))}
                        <Button 
                          size="small"
                          startIcon={<AddCircleOutline />} 
                          onClick={() => handleAddItem('individualNeeds.conditions', '')} 
                          sx={{ 
                            mt: 0.5,
                            color: roleColors.CAREGIVER.primary,
                            fontSize: '0.8rem',
                          }}
                        >
                          Add Condition
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {carePlanData.individualNeeds.conditions.map((item, index) => (
                          <Chip 
                            key={index}
                            label={item} 
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(76, 175, 80, 0.15)',
                              color: '#1b5e20',
                              fontWeight: 500,
                              fontSize: '0.8rem',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Personal Care */}
            <Grid item xs={12}>
              <Box sx={{
                background: 'rgba(76, 175, 84, 0.08)',
                borderRadius: '12px',
                p: 2,
                border: '1px solid rgba(76, 175, 80, 0.2)',
              }}>
                <Typography variant="caption" sx={{ color: 'rgba(27, 94, 32, 0.6)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', mb: 1 }}>
                  Personal Care Needs
                </Typography>
                {isEditing ? (
                  <Box>
                    {carePlanData.individualNeeds.personalCare.map((item, index) => (
                      <Stack direction="row" spacing={1} key={index} sx={{ mb: 0.5 }}>
                        <TextField 
                          size="small" 
                          fullWidth 
                          defaultValue={item} 
                          onChange={e => handleInputChange(`individualNeeds.personalCare[${index}]`, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'white',
                              borderRadius: '8px',
                            },
                          }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveItem('individualNeeds.personalCare', index)}
                          sx={{ color: '#d32f2f' }}
                        >
                          <RemoveCircleOutline fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                    <Button 
                      size="small"
                      startIcon={<AddCircleOutline />} 
                      onClick={() => handleAddItem('individualNeeds.personalCare', '')} 
                      sx={{ 
                        mt: 0.5,
                        color: roleColors.CAREGIVER.primary,
                        fontSize: '0.8rem',
                      }}
                    >
                      Add Item
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {carePlanData.individualNeeds.personalCare.map((item, index) => (
                      <Chip 
                        key={index}
                        label={item} 
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(76, 175, 80, 0.15)',
                          color: '#1b5e20',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Goals & Preferences */}
            <Grid item xs={12}>
              <Box sx={{
                background: '#3f704d ',
                borderRadius: '12px',
                p: 2,
                border: '1px solid #3f704d ',
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {isEditing ? (
                      <TextField
                        label="Personal Goals"
                        variant="outlined"
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        value={carePlanData.preferences.goals}
                        onChange={(e) => handleInputChange('preferences.goals', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                            borderRadius: '8px',
                          },
                        }}
                      />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#6cd780', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                          Personal Goals
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, mt: 0.5 }}>
                          {carePlanData.preferences.goals}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {isEditing ? (
                      <TextField 
                        label="Lifestyle" 
                        variant="outlined" 
                        fullWidth 
                        size="small"
                        multiline 
                        rows={2} 
                        defaultValue={carePlanData.preferences.lifestyle} 
                        onChange={(e) => handleInputChange('preferences.lifestyle', e.target.value)} 
                        sx={{ 
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                            borderRadius: '8px',
                          },
                        }} 
                      />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#6cd780', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        Lifestyle
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffff', fontWeight: 500, mt: 0.5 }}>
                          {carePlanData.preferences.lifestyle}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {isEditing ? (
                      <TextField 
                        label="Values" 
                        variant="outlined" 
                        fullWidth 
                        size="small"
                        multiline 
                        rows={2} 
                        defaultValue={carePlanData.preferences.values} 
                        onChange={(e) => handleInputChange('preferences.values', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'white',
                            borderRadius: '8px',
                          },
                        }}
                      />
                    ) : (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#6cd780', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        Values
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffff', fontWeight: 500, mt: 0.5 }}>
                          {carePlanData.preferences.values}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Section>

        <Section icon={<MedicalInformationOutlined />} title="Medical Information">
                    {isEditing ? (
            <Stack direction="row" spacing={1} width="100%">
              <TextField size="small" label="Physician Name" fullWidth defaultValue={carePlanData.medicalInfo.primaryCarePhysician.name} onChange={e => handleInputChange('medicalInfo.primaryCarePhysician.name', e.target.value)} error={!!errors.physicianName} helperText={errors.physicianName} />
              <TextField size="small" label="Contact" fullWidth defaultValue={carePlanData.medicalInfo.primaryCarePhysician.contact} onChange={e => handleInputChange('medicalInfo.primaryCarePhysician.contact', e.target.value)} error={!!errors.physicianContact} helperText={errors.physicianContact} />
            </Stack>
          ) : (
            <Typography variant="subtitle1"><strong>Primary Care Physician:</strong> {carePlanData.medicalInfo.primaryCarePhysician.name} ({carePlanData.medicalInfo.primaryCarePhysician.contact})</Typography>
          )}
                    <Typography variant="subtitle1" mt={2}><strong>Specialists:</strong></Typography>
          {isEditing ? (
            <>
              {carePlanData.medicalInfo.specialists.map((s, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center" width="100%" sx={{mb: 1}}>
                  <TextField size="small" label="Name" fullWidth defaultValue={s.name} onChange={e => handleInputChange(`medicalInfo.specialists[${index}].name`, e.target.value)} />
                  <TextField size="small" label="Contact" fullWidth defaultValue={s.contact} onChange={e => handleInputChange(`medicalInfo.specialists[${index}].contact`, e.target.value)} />
                  <IconButton size="small" onClick={() => handleRemoveItem('medicalInfo.specialists', index)}><RemoveCircleOutline /></IconButton>
                </Stack>
              ))}
              <Button startIcon={<AddCircleOutline />} onClick={() => handleAddItem('medicalInfo.specialists', { name: '', contact: '' })} sx={{ mt: 1 }}>
                Add Specialist
              </Button>
            </>
          ) : (
            <Typography variant="subtitle1">{carePlanData.medicalInfo.specialists.map(s => `${s.name} (${s.contact})`).join(', ')}</Typography>
          )}
          <Typography variant="subtitle1" mt={2}><strong>Medications:</strong></Typography>
          <List dense>
            {carePlanData.medicalInfo.medications.map((med, index) => (
              <ListItem key={index} sx={{ p: isEditing ? 1 : 'auto' }}>
                {isEditing ? (
                  <Stack direction="row" spacing={1} alignItems="center" width="100%">
                    <TextField size="small" label="Name" fullWidth defaultValue={med.name} onChange={e => handleInputChange(`medicalInfo.medications[${index}].name`, e.target.value)} />
                    <TextField size="small" label="Dosage" fullWidth defaultValue={med.dosage} onChange={e => handleInputChange(`medicalInfo.medications[${index}].dosage`, e.target.value)} />
                    <TextField size="small" label="Frequency" fullWidth defaultValue={med.frequency} onChange={e => handleInputChange(`medicalInfo.medications[${index}].frequency`, e.target.value)} />
                    <IconButton size="small" onClick={() => handleRemoveItem('medicalInfo.medications', index)}><RemoveCircleOutline /></IconButton>
                  </Stack>
                ) : (
                  <ListItemText primary={`${med.name} (${med.dosage}, ${med.frequency})`} />
                )}
              </ListItem>
            ))}
          </List>
          {isEditing && (
            <Button startIcon={<AddCircleOutline />} onClick={() => handleAddItem('medicalInfo.medications', { name: '', dosage: '', frequency: '' })} sx={{ mt: 1 }}>
              Add Medication
            </Button>
          )}
                    {isEditing ? (
            <TextField label="Allergies" variant="outlined" fullWidth size="small" value={carePlanData.medicalInfo.allergies} onChange={(e) => handleInputChange('medicalInfo.allergies', e.target.value)} />
          ) : (
            <Typography variant="subtitle1"><strong>Allergies:</strong> {carePlanData.medicalInfo.allergies}</Typography>
          )}
        </Section>

        <Section icon={<ContactsOutlined />} title="Medical Services & Contacts">
                    <Typography variant="subtitle1"><strong>Therapies:</strong></Typography>
          {isEditing ? (
            <>
              {carePlanData.supportServices.therapies.map((therapy, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    defaultValue={therapy}
                    onChange={e => handleInputChange(`supportServices.therapies[${index}]`, e.target.value)}
                  />
                  <IconButton size="small" onClick={() => handleRemoveItem('supportServices.therapies', index)}>
                    <RemoveCircleOutline />
                  </IconButton>
                </Stack>
              ))}
              <Button
                startIcon={<AddCircleOutline />}
                onClick={() => handleAddItem('supportServices.therapies', '')}
                sx={{ mt: 1 }}
              >
                Add Therapy
              </Button>
            </>
          ) : (
            <List dense sx={{p:0}}>
              {carePlanData.supportServices.therapies.map((therapy, index) => (
                  <ListItem key={index} sx={{p:0}}><ListItemText primary={therapy} /></ListItem>
              ))}
            </List>
          )}
                    {isEditing ? (
            <Stack direction="row" spacing={1} width="100%" sx={{mt: 1}}>
              <TextField size="small" label="Aide Name" defaultValue={carePlanData.supportServices.homeHealthAide.name} onChange={e => handleInputChange('supportServices.homeHealthAide.name', e.target.value)} />
              <TextField size="small" label="Agency" defaultValue={carePlanData.supportServices.homeHealthAide.agency} onChange={e => handleInputChange('supportServices.homeHealthAide.agency', e.target.value)} />
              <TextField size="small" label="Contact" defaultValue={carePlanData.supportServices.homeHealthAide.contact} onChange={e => handleInputChange('supportServices.homeHealthAide.contact', e.target.value)} />
            </Stack>
          ) : (
            <Typography variant="subtitle1"><strong>Home Health Aide:</strong> {carePlanData.supportServices.homeHealthAide.name}, {carePlanData.supportServices.homeHealthAide.agency} ({carePlanData.supportServices.homeHealthAide.contact})</Typography>
          )}
        </Section>

        <Section icon={<AssignmentIndOutlined />} title="Caregiver Profile">
                    {isEditing ? (
            <TextField size="small" label="Primary Caregiver" defaultValue={carePlanData.roles.primaryCaregiver.name} onChange={e => handleInputChange('roles.primaryCaregiver.name', e.target.value)} error={!!errors.primaryCaregiverName} helperText={errors.primaryCaregiverName} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1"><strong>Primary Caregiver:</strong></Typography>
            <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>{carePlanData.roles.primaryCaregiver.name}</Typography>
          </Box>
          )}
                    {isEditing ? (
            <TextField label="Primary Caregiver Responsibilities" variant="outlined" fullWidth multiline rows={2} value={carePlanData.roles.primaryCaregiver.responsibilities} onChange={(e) => handleInputChange('roles.primaryCaregiver.responsibilities', e.target.value)} />
          ) : (
            <Typography variant="body2" sx={{ pl: 2 }}><em>Responsibilities:</em> {carePlanData.roles.primaryCaregiver.responsibilities}</Typography>
          )}
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
              <Button variant="outlined" size="small" onClick={() => handleMenuNavigation('/caregiver/grocery-list')}>Grocery Shopping List</Button>
              <Button variant="outlined" size="small" onClick={() => handleMenuNavigation('/caregiver/heredibles')}>Heredibles™</Button>
              <Button variant="outlined" size="small" onClick={() => handleMenuNavigation('/caregiver/pharmacy')}>Pharmacy & Medications</Button>
              <Button variant="outlined" size="small" onClick={() => handleMenuNavigation('/caregiver/care-tips')}>Caregiving Tips</Button>
            </Stack>
                    {isEditing ? (
            <TextField size="small" label="Secondary Caregiver" sx={{mt: 1}} defaultValue={carePlanData.roles.secondaryCaregiver.name} onChange={e => handleInputChange('roles.secondaryCaregiver.name', e.target.value)} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="subtitle1"><strong>Secondary Caregiver:</strong></Typography>
            <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>{carePlanData.roles.secondaryCaregiver.name}</Typography>
          </Box>
          )}
                    {isEditing ? (
            <TextField label="Secondary Caregiver Responsibilities" variant="outlined" fullWidth multiline rows={2} value={carePlanData.roles.secondaryCaregiver.responsibilities} onChange={(e) => handleInputChange('roles.secondaryCaregiver.responsibilities', e.target.value)} />
          ) : (
            <Typography variant="body2" sx={{ pl: 2 }}><em>Responsibilities:</em> {carePlanData.roles.secondaryCaregiver.responsibilities}</Typography>
          )}
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
              <Button variant="outlined" size="small" onClick={() => handleMenuNavigation('/caregiver/appointments-billing')}>Appointments & Billing</Button>
              <Button variant="outlined" size="small" onClick={() => handleMenuNavigation('/caregiver/payment-methods')}>Payment Methods</Button>
            </Stack>
        </Section>
      </Box>
    </CaregiverPageWrapper>
  );
};

export default CarePlanningPage;
