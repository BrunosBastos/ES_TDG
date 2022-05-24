import { config } from "../consts";

class FileService {

    async uploadFile(file) {
        return fetch(config.API_URL + "/files", {
            method: "POST",
            body: file
        })
    }
}

export default FileService;

