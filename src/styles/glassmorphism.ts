// Glassmorphism styles for inPEP dashboards
// Color scheme from landing page

export const roleColors = {
  PATIENT: {
    primary: '#2196F3',
    secondary: '#21CBF3',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
  },
  CAREGIVER: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
  },
  PROVIDER: {
    primary: '#FF9800',
    secondary: '#FFC107',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
  },
  INSURER: {
    primary: '#9C27B0',
    secondary: '#E91E63',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
  },
};

export const glassStyles = {
  // Base glass card
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    borderRadius: '16px',
  },

  // Glass card with role color tint
  cardWithTint: (role: keyof typeof roleColors, opacity = 0.1) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${roleColors[role].primary}40`,
    boxShadow: `0 8px 32px 0 ${roleColors[role].primary}20`,
    borderRadius: '16px',
  }),

  // Glass button
  button: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  },

  // Glass header/banner
  banner: (role: keyof typeof roleColors) => ({
    background: `${roleColors[role].primary}20`,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${roleColors[role].primary}40`,
    boxShadow: `0 8px 32px 0 ${roleColors[role].primary}30`,
    borderRadius: '16px',
  }),

  // Solid glass card with gradient
  solidCard: (role: keyof typeof roleColors) => ({
    background: roleColors[role].gradient,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: `0 8px 32px 0 ${roleColors[role].primary}40`,
    borderRadius: '16px',
    color: 'white',
  }),

  // Glass overlay for modals
  overlay: {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  },
};

// Modern, sophisticated background gradients
export const dashboardBackgrounds = {
  PATIENT: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Soft gray-blue
  CAREGIVER: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', // Clean white-gray
  PROVIDER: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)', // Soft warm
  INSURER: 'linear-gradient(135deg, #faf8ff 0%, #f0ebff 100%)', // Soft purple
};

// Premium glass card styles
export const premiumGlass = {
  // Ultra-modern glass card
  card: (role: keyof typeof roleColors) => ({
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 40px 0 ${roleColors[role].primary}20`,
    },
  }),

  // Hero card with gradient
  hero: (role: keyof typeof roleColors) => ({
    background: roleColors[role].gradient,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: `0 20px 60px 0 ${roleColors[role].primary}30`,
    borderRadius: '24px',
    color: 'white',
    border: 'none',
  }),

  // Subtle accent card
  accent: (role: keyof typeof roleColors) => ({
    background: `linear-gradient(135deg, ${roleColors[role].primary}08 0%, ${roleColors[role].secondary}08 100%)`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${roleColors[role].primary}15`,
    boxShadow: `0 4px 20px 0 ${roleColors[role].primary}10`,
    borderRadius: '16px',
  }),
};
