import { config } from "../consts";

class MetricService {
    static myInstance = null;

    static getInstance() {
        if (!this.myInstance) {
            this.myInstance = new MetricService();
        }
        return this.myInstance;
    }

    async getEC2NetworkIn() {
        return fetch(config.METRICS_API_URL + "/EC2/NetworkIn", {
            headers: {
                "Accept": "application/json"
            },
            mode: "cors",
            method: "GET",
        })
    }

    async getEC2NetworkOut() {
        return fetch(config.METRICS_API_URL + "/EC2/NetworkOut", {
            headers: {
                'Accept': 'application/json',
            },
            mode: "cors",
            method: "GET",
        })
    }

    async getEC2NetworkPacketsIn() {
        return fetch(config.METRICS_API_URL + "/EC2/NetworkPacketsIn", {
            headers: {
                'Accept': 'application/json',
            },
            mode: "cors",
            method: "GET",
        })
    }

    async getEC2NetworkPacketsOut() {
        return fetch(config.METRICS_API_URL + "/EC2/NetworkPacketsOut", {
            headers: {
                'Accept': 'application/json',
            },
            mode: "cors",
            method: "GET",
        })
    }

    async getS3NumberOfObjects() {
        return fetch(config.METRICS_API_URL + "/S3/NumberOfObjects/AllStorageTypes", {
            headers: {
                'Accept': 'application/json',
            },
            mode: "cors",
            method: "GET",
        })
    }

    async getS3BucketSize() {
        return fetch(config.METRICS_API_URL + "/S3/BucketSizeBytes/StandardStorage", {
            headers: {
                'Accept': 'application/json',
            },
            mode: "cors",
            method: "GET",
        })
    }
}

export default MetricService;
