import { Tabs, Tab } from '@mui/material';

interface VerticalTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const VerticalTabs = ({ value, onChange }: VerticalTabsProps) => {
  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={value}
      onChange={onChange}
      aria-label="Vertical tabs example"
      sx={{ borderRight: 1, borderColor: 'divider' }}
    >
      <Tab label="Patient" />
      <Tab label="Caregiver" />
      <Tab label="Healthcare Provider" />
      <Tab label="Health Insurer" />
    </Tabs>
  );
};

export default VerticalTabs;
