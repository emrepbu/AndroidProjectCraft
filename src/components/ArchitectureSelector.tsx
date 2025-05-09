import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useProject } from '../contexts/ProjectContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const ArchitectureSelector = () => {
  const { state, updateConfig, setStep } = useProject();
  const { config } = state;

  // Ensure MVVM architecture is selected
  useEffect(() => {
    if (config.architecture !== 'mvvm') {
      updateConfig({ architecture: 'mvvm' });
    }
  }, [config.architecture, updateConfig]);
  const handleNext = () => setStep(2); // Go to Libraries selection
  const handleBack = () => setStep(0); // Go back to Project Config

  return (
    <Box>
      <Card 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{ mb: 3 }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Architecture Selection
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This project will use the <strong>MVVM (Model-View-ViewModel)</strong> architecture pattern.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            MVVM separates UI from business logic with observable data models, promoting a clean separation of concerns.
            It's well-suited for Android applications and works seamlessly with modern Android development patterns.
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          sx={{ minWidth: 120 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ minWidth: 120 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ArchitectureSelector;