import { config } from "../consts";
import useAuthStore from "src/stores/AuthStore";

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
                "username": useAuthStore.getState().token
            },
            mode: "cors",
            method: "POST",
            body: payload
        })
    }

    async getAllFiles(fileType = null) {
        return fetch(config.API_URL + "/2/files" + (fileType ? "?file_type=" + fileType : ""), {
            headers: {
                'username': useAuthStore.getState().token,
                'Accept': 'application/json',
            },
            mode: "cors",
            method: "GET",
        })
    }

    async uploadJsonData(payload) {
        return fetch(config.API_URL + "/3/fill", {
            headers: {
                'Accept': 'application/json',
                "username": useAuthStore.getState().token
            },
            mode: "cors",
            method: "POST",
            body: payload
        })
    }

    async deleteFile(path) {
        return fetch(config.API_URL + "/1/files/" + path, {
            headers: {
                'Accept': 'application/json',
                "username": useAuthStore.getState().token
            },
            mode: "cors",
            method: "DELETE",
        })
    }
}

export default FileService;
