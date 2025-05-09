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
  TextField, 
  Typography 
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useProject } from '../contexts/ProjectContext';

const validationSchema = yup.object({
  projectName: yup
    .string()
    .matches(/^[a-zA-Z][a-zA-Z0-9_]*$/, 'Project name must start with a letter and contain only letters, numbers, and underscores')
    .required('Project name is required'),
  packageName: yup
    .string()
    .matches(
      /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$/,
      'Package name must be in format: com.example.myapp'
    )
    .required('Package name is required'),
  minSdkVersion: yup
    .number()
    .min(16, 'Minimum SDK version must be at least 16')
    .max(34, 'Minimum SDK version cannot exceed 34')
    .required('Minimum SDK version is required'),
  targetSdkVersion: yup
    .number()
    .min(21, 'Target SDK version must be at least 21')
    .max(34, 'Target SDK version cannot exceed 34')
    .required('Target SDK version is required'),
});

const ProjectConfigForm = () => {
  const { state, updateConfig, setStep } = useProject();
  const { config } = state;

  const formik = useFormik({
    initialValues: {
      projectName: config.projectName,
      packageName: config.packageName,
      minSdkVersion: config.minSdkVersion,
      targetSdkVersion: config.targetSdkVersion,
    },
    validationSchema,
    onSubmit: (values) => {
      updateConfig({
        ...values,
        useKotlinDsl: true,
        architecture: 'mvvm'
      });
      setStep(1);
    },
  });

  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Project Configuration
            </Typography>
            <Grid container spacing={3}>
                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField
                    fullWidth
                    id="projectName"
                    name="projectName"
                    label="Project Name"
                    variant="outlined"
                    value={formik.values.projectName}
                    onChange={formik.handleChange}
                    error={formik.touched.projectName && Boolean(formik.errors.projectName)}
                    helperText={formik.touched.projectName && formik.errors.projectName}
                  />
                </Grid>
                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField
                    fullWidth
                    id="packageName"
                    name="packageName"
                    label="Package Name"
                    variant="outlined"
                    value={formik.values.packageName}
                    onChange={formik.handleChange}
                    error={formik.touched.packageName && Boolean(formik.errors.packageName)}
                    helperText={formik.touched.packageName && formik.errors.packageName}
                  />
                </Grid>
                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField
                    fullWidth
                    id="minSdkVersion"
                    name="minSdkVersion"
                    label="Minimum SDK Version"
                    type="number"
                    variant="outlined"
                    value={formik.values.minSdkVersion}
                    onChange={formik.handleChange}
                    error={formik.touched.minSdkVersion && Boolean(formik.errors.minSdkVersion)}
                    helperText={formik.touched.minSdkVersion && formik.errors.minSdkVersion}
                  />
                </Grid>
                <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField
                    fullWidth
                    id="targetSdkVersion"
                    name="targetSdkVersion"
                    label="Target SDK Version"
                    type="number"
                    variant="outlined"
                    value={formik.values.targetSdkVersion}
                    onChange={formik.handleChange}
                    error={formik.touched.targetSdkVersion && Boolean(formik.errors.targetSdkVersion)}
                    helperText={formik.touched.targetSdkVersion && formik.errors.targetSdkVersion}
                  />
                </Grid>
                <Grid sx={{ gridColumn: 'span 12' }}>
                  <FormControl fullWidth>
                    <InputLabel id="kotlin-dsl-label">Build Script Language</InputLabel>
                    <Select
                      labelId="kotlin-dsl-label"
                      id="useKotlinDsl"
                      name="useKotlinDsl"
                      value={true}
                      label="Build Script Language"
                      disabled={true}
                    >
                      <MenuItem value="true">Kotlin DSL (build.gradle.kts)</MenuItem>
                    </Select>
                    <FormHelperText>
                      Gradle build scripts with Kotlin DSL
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ minWidth: 120 }}
          >
            Next
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProjectConfigForm;