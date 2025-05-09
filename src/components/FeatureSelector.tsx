import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography 
} from '@mui/material';
import { useProject } from '../contexts/ProjectContext';
import { motion } from 'framer-motion';

const FeatureSelector = () => {
  const { setStep } = useProject();

  const handleNext = () => {
    setStep(4);
  };

  const handleBack = () => {
    setStep(2);
  };

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
            Project Features
          </Typography>
          <Typography variant="body1" paragraph>
            Your project will include a basic Android application structure with the following standard features:
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Material 3 theming with dynamic color support
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Navigation component for screen transitions
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • ViewModels with SavedStateHandle for state preservation
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • Lifecycle-aware components
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Proper permission handling
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

export default FeatureSelector;