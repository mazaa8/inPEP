import { Typography, Grid, Card, CardContent } from '@mui/material';
import { Lightbulb as TipsIcon } from '@mui/icons-material';
import CaregiverPageWrapper from '../../../components/layout/CaregiverPageWrapper';

const CaregivingTipsPage = () => {
  const tips = [
    { title: 'Take Care of Yourself First', description: 'You can\'t pour from an empty cup. Schedule regular breaks and maintain your own health.' },
    { title: 'Build a Support Network', description: 'Connect with other caregivers, join support groups, and don\'t hesitate to ask for help.' },
    { title: 'Stay Organized', description: 'Keep medical records, medications, and appointments well-organized. Use our tools to help!' },
    { title: 'Communicate Openly', description: 'Maintain clear communication with healthcare providers and family members about care needs.' },
    { title: 'Recognize Warning Signs', description: 'Know the signs of caregiver burnout: exhaustion, anxiety, depression, or irritability.' },
    { title: 'Celebrate Small Wins', description: 'Acknowledge your daily achievements, no matter how small they may seem.' },
  ];

  return (
    <CaregiverPageWrapper
      title="Caregiving Tips"
      subtitle="Expert advice and practical tips for caregivers"
      icon={<TipsIcon />}
    >
      <Grid container spacing={3}>
        {tips.map((tip, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
              transition: 'all 0.3s ease',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
              },
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20', mb: 2 }}>
                  💡 {tip.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.8)' }}>
                  {tip.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </CaregiverPageWrapper>
  );
};

export default CaregivingTipsPage;
