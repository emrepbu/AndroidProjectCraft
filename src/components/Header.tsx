import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import AndroidIcon from '@mui/icons-material/Android';

const Header = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <AppBar position="static" elevation={0} sx={{ background: 'transparent', backdropFilter: 'blur(10px)' }}>
      <Toolbar>
        <Box display="flex" alignItems="center">
          <AndroidIcon sx={{ color: '#3DDC84', fontSize: 32, mr: 1 }} />
          <Typography variant="h5" component="div" fontWeight="bold">
            AndroidProjectCraft
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;