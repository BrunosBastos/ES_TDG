import { config } from "../consts";

class FileService {
    static myInstance = null;

    static getInstance() {
        if (!this.myInstance) {
            // Interceptor();
            this.myInstance = new FileService();
        }
        return this.myInstance;
    }

    async uploadFile(payload) {
        return fetch(config.API_URL + "/1/files", {
            headers: {
                'Accept': 'application/json',
            },
            mode: "cors",
            method: "POST",
            body: payload
        })
    }

    async getAllFiles() {
        return fetch(config.API_URL + "/2/files", {
            headers: {
                'Accept': 'application/json',
            },
            mode: "cors",
            method: "GET",
        })
    }

}

export default FileService;
