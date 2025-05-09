import {Box, Container, Stepper, Step, StepLabel, Paper, Typography} from '@mui/material';
import {useProject} from '../contexts/ProjectContext';
import Header from '../components/Header';
import ProjectConfigForm from '../components/ProjectConfigForm';
import ArchitectureSelector from '../components/ArchitectureSelector';
import LibrarySelector from '../components/LibrarySelector';
import FeatureSelector from '../components/FeatureSelector';
import ProjectPreview from '../components/ProjectPreview';
import {motion} from 'framer-motion';

const steps = [
    'Project Settings',
    'MVVM Architecture',
    'Libraries',
    'Features',
    'Generate'
];

const Home = () => {
    const {state} = useProject();
    const {step} = state;

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <ProjectConfigForm/>;
            case 1:
                return <ArchitectureSelector/>;
            case 2:
                return <LibrarySelector/>;
            case 3:
                return <FeatureSelector/>;
            case 4:
                return <ProjectPreview/>;
            default:
                return 'Unknown step';
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, rgba(25,25,25,0.8) 0%, rgba(75,75,75,0.8) 100%)',
            pt: 2,
            pb: 8
        }}>
            <Header/>
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Paper
                    component={motion.div}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    elevation={0}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        Android Project Craft
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="text.secondary" sx={{mb: 4}}>
                        Create customized Android projects with your preferred architecture and libraries
                    </Typography>

                    <Stepper activeStep={step} alternativeLabel sx={{mb: 4}}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {getStepContent(step)}
                </Paper>
            </Container>
        </Box>
    );
};

export default Home;