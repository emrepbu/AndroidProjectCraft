import { Grid } from '@mui/material';
import type { ReactNode } from 'react';

interface GridItemProps {
  children: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

const GridItem = ({ children, xs, sm, md, lg, xl }: GridItemProps) => {
  return (
    <Grid 
      sx={{ 
        gridColumn: {
          xs: xs ? `span ${xs}` : undefined,
          sm: sm ? `span ${sm}` : undefined,
          md: md ? `span ${md}` : undefined,
          lg: lg ? `span ${lg}` : undefined,
          xl: xl ? `span ${xl}` : undefined,
        }
      }}
    >
      {children}
    </Grid>
  );
};

export default GridItem;