// material
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
// sections
import {
    HelpTemplates,
} from 'src/sections/@dashboard/help';

// ----------------------------------------------------------------------

export default function Help() {
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Need some help?
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <HelpTemplates />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
