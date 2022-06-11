import { useEffect, useState } from 'react';
// material
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
// sections
import { MetricsGraph } from 'src/sections/@dashboard/metrics';
// service
import MetricService from 'src/services/MetricService';

// ----------------------------------------------------------------------

export default function DashboardApp() {
    const service = MetricService.getInstance();
    const [data, setData] = useState({
        NetworkIn: null,
        NetworkOut: null,
        NetworkPacketsIn: null,
        NetworkPacketsOut: null,
        CPUUtilization: null,
        NumberOfObjects: null,
        BucketSizeBytes: null,
    });
    const [labels, setLabels] = useState({
        EC2: [],
        S3: [],
    });

    const transformData = (awsService, res) => {
        const dataType = res.Label;
        res = res.Datapoints
            ?.sort((a, b) => a.Timestamp > b.Timestamp ? 1 : -1)
            .slice(-11);

        const newData = res.map((d) => parseInt(d.Average));
        const unit = res[0].Unit || "";
        setData((prevData) => ({ ...prevData, [dataType]: { unit, data: newData } }))

        if (labels[awsService].length === 0) {
            const newLabels = res.map(d => d.Timestamp);
            setLabels((prevLabels) => ({ ...prevLabels, [awsService]: newLabels }));
        }
    }

    useEffect(() => {
        service.getEC2NetworkIn()
            .then(res => res.json())
            .then(res => transformData("EC2", res))
            .catch(console.error);

        service.getEC2NetworkOut()
            .then(res => res.json())
            .then(res => transformData("EC2", res))
            .catch(console.error);

        service.getEC2NetworkPacketsIn()
            .then(res => res.json())
            .then(res => transformData("EC2", res))
            .catch(console.error);

        service.getEC2NetworkPacketsOut()
            .then(res => res.json())
            .then(res => transformData("EC2", res))
            .catch(console.error);

        service.getEC2CPU()
            .then(res => res.json())
            .then(res => transformData("EC2", res))
            .catch(console.error);

        service.getS3NumberOfObjects()
            .then(res => res.json())
            .then(res => transformData("S3", res))
            .catch(console.error);

        service.getS3BucketSize()
            .then(res => res.json())
            .then(res => transformData("S3", res))
            .catch(console.error);
    }, [])

    return (
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    EC2 Metrics
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6}>
                        <MetricsGraph
                            title="Network"
                            subheader={`Average (${data.NetworkIn?.unit || ""})`}
                            chartLabels={labels.EC2 || []}
                            unit={data.NetworkIn?.unit || ""}
                            chartData={[
                                {
                                    name: 'NetworkIn',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: data.NetworkIn?.data || [],
                                },
                                {
                                    name: 'NetworkOut',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: data.NetworkOut?.data || [],
                                }
                            ]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <MetricsGraph
                            title="Network Packets"
                            subheader={`Average (${data.NetworkPacketsIn?.unit || ""})`}
                            chartLabels={labels.EC2 || []}
                            unit={data.NetworkPacketsIn?.unit || ""}
                            chartData={[
                                {
                                    name: 'NetworkPacketsIn',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: data.NetworkPacketsIn?.data || [],
                                },
                                {
                                    name: 'NetworkPacketsOut',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: data.NetworkPacketsOut?.data || [],
                                }
                            ]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <MetricsGraph
                            title="CPU Utilization"
                            subheader={`Average (${data.CPUUtilization?.unit || ""})`}
                            chartLabels={labels.EC2 || []}
                            unit={data.CPUUtilization?.unit || ""}
                            chartData={[
                                {
                                    name: 'CPUUtilization',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: data.CPUUtilization?.data || [],
                                }
                            ]}
                        />
                    </Grid>
                </Grid>

                <Typography variant="h4" sx={{ mb: 5, mt: 5 }}>
                    S3 Metrics
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6}>
                        <MetricsGraph
                            title="Bucket Number of Objects"
                            subheader={`Average (${data.NumberOfObjects?.unit || ""})`}
                            chartLabels={labels.S3 || []}
                            unit={data.NumberOfObjects?.unit || ""}
                            chartData={[
                                {
                                    name: 'NumberOfObjects',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: data.NumberOfObjects?.data || [],
                                },
                            ]}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <MetricsGraph
                            title="Bucket Storage Size"
                            subheader={`Average (${data.BucketSizeBytes?.unit || ""})`}
                            chartLabels={labels.S3 || []}
                            unit={data.BucketSizeBytes?.unit || ""}
                            chartData={[
                                {
                                    name: 'BucketSizeBytes',
                                    type: 'area',
                                    fill: 'gradient',
                                    data: data.BucketSizeBytes?.data || [],
                                },
                            ]}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
