import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
// components
import { BaseOptionChart } from '../../../components/chart';

// ----------------------------------------------------------------------

MetricsGraph.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function MetricsGraph({ title, subheader, chartLabels, chartData, unit, ...other }) {
  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      redrawOnParentResize: true
    },
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: chartLabels,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} ${unit}`;
          }
          return y;
        },
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1, minHeight: 364 }} dir="ltr">
        {
          chartLabels.length > 0 && chartData[0].data.length > 0
            ?
            <ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
            :
            <div style={{height: 364, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <CircularProgress />
            </div>
        }
      </Box>
    </Card>
  );
}
