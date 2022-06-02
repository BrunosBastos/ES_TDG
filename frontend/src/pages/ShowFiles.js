// material
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
// sections
import {
  FilesListTemplates,
} from '../sections/@dashboard/files';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <FilesListTemplates />
          </Grid>
        </Grid>
      </Container>
    </Page >
  );
}
