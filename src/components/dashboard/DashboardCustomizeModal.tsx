import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';

interface Feature {
  id: string;
  title: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  allFeatures: Feature[];
  selectedFeatures: string[];
  onSave: (selected: string[]) => void;
}

const DashboardCustomizeModal = ({ open, onClose, allFeatures, selectedFeatures, onSave }: Props) => {
  const [localSelected, setLocalSelected] = useState(selectedFeatures);

  useEffect(() => {
    setLocalSelected(selectedFeatures);
  }, [selectedFeatures]);

  const handleToggle = (featureId: string) => {
    const currentIndex = localSelected.indexOf(featureId);
    const newSelected = [...localSelected];

    if (currentIndex === -1) {
      if (newSelected.length < 6) {
        newSelected.push(featureId);
      }
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setLocalSelected(newSelected);
  };

  const handleSave = () => {
    onSave(localSelected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Customize Dashboard</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" gutterBottom>
          Select up to 6 features to display on your dashboard.
        </Typography>
        <FormGroup>
          {allFeatures.map((feature) => (
            <FormControlLabel
              key={feature.id}
              control={
                <Checkbox
                  checked={localSelected.includes(feature.id)}
                  onChange={() => handleToggle(feature.id)}
                  disabled={localSelected.length >= 6 && !localSelected.includes(feature.id)}
                />
              }
              label={feature.title}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardCustomizeModal;
