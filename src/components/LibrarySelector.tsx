import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  FormControl, 
  FormHelperText, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  Typography 
} from '@mui/material';
import { useProject } from '../contexts/ProjectContext';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const LibrarySelector = () => {
  const { state, updateConfig, setStep } = useProject();
  const { config } = state;

  // Ensure all libraries are set to required values
  useEffect(() => {
    const requiredConfig = {
      ui: 'compose',
      async: 'coroutines',
      imageLoading: 'coil',
      database: 'room',
      networking: 'retrofit',
      di: 'hilt'
    };
    
    const updates = Object.entries(requiredConfig).reduce((acc, [key, value]) => {
      if (config[key as keyof typeof requiredConfig] !== value) {
        acc[key as keyof typeof requiredConfig] = value as any;
      }
      return acc;
    }, {} as Partial<typeof config>);
    
    if (Object.keys(updates).length > 0) {
      updateConfig(updates);
    }
  }, [config, updateConfig]);

  const handleNext = () => {
    setStep(3);
  };

  const handleBack = () => {
    setStep(0);
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
            Select Libraries
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose the libraries and frameworks for your Android project
          </Typography>
          
          <Grid container spacing={3}>
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth>
                <InputLabel id="ui-framework-label">UI Framework</InputLabel>
                <Select
                  labelId="ui-framework-label"
                  value="compose"
                  label="UI Framework"
                  disabled={true}
                >
                  <MenuItem value="compose">Jetpack Compose</MenuItem>
                </Select>
                <FormHelperText>
                  Modern declarative UI toolkit for Android development
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth>
                <InputLabel id="networking-label">Networking</InputLabel>
                <Select
                  labelId="networking-label"
                  value="retrofit"
                  label="Networking"
                  disabled={true}
                >
                  <MenuItem value="retrofit">Retrofit</MenuItem>
                </Select>
                <FormHelperText>
                  Type-safe HTTP client by Square with strong Android community support
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth>
                <InputLabel id="database-label">Database</InputLabel>
                <Select
                  labelId="database-label"
                  value="room"
                  label="Database"
                  disabled={true}
                >
                  <MenuItem value="room">Room</MenuItem>
                </Select>
                <FormHelperText>
                  SQLite abstraction library by Google with Kotlin coroutines support
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth>
                <InputLabel id="di-label">Dependency Injection</InputLabel>
                <Select
                  labelId="di-label"
                  value="hilt"
                  label="Dependency Injection"
                  disabled={true}
                >
                  <MenuItem value="hilt">Hilt</MenuItem>
                </Select>
                <FormHelperText>
                  Google's recommended DI solution built on Dagger with Android-specific support
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth>
                <InputLabel id="image-loading-label">Image Loading</InputLabel>
                <Select
                  labelId="image-loading-label"
                  value="coil"
                  label="Image Loading"
                  disabled={true}
                >
                  <MenuItem value="coil">Coil</MenuItem>
                </Select>
                <FormHelperText>
                  Kotlin-first image loading library with Compose support
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth>
                <InputLabel id="async-label">Async Framework</InputLabel>
                <Select
                  labelId="async-label"
                  value="coroutines"
                  label="Async Framework"
                  disabled={true}
                >
                  <MenuItem value="coroutines">Coroutines</MenuItem>
                </Select>
                <FormHelperText>
                  Kotlin coroutines for structured concurrency and async programming
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
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

export default LibrarySelector;