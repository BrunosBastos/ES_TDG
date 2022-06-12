// material
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
// sections
import {
  FilesListTemplates,
} from 'src/sections/@dashboard/files';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Show Files">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Show Files
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6}>
            <FilesListTemplates />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <FilesListTemplates filledTemplates />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
