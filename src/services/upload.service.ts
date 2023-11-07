import { UPLOADS } from "@/global.types";
import UploadModel from "@/models/upload.model";
import httpStatus from "http-status"

class UploadsService {

    constructor(){
    }

    async upload (uploadId: string | null | undefined, title: string, data: string): Promise<UPLOADS | null>  {

        const queryObject = { _id: uploadId };

        // this url will be gotten after uploading to digital ocean space or aws s3
        const processedUrl = "processedImageUrl" 

        const updateObject = { title, url: processedUrl };
    
        // Set the `upsert` option to create a new document if not found
        const options = { upsert: true, new: true };
    
        const updatedUpload = await UploadModel.findOneAndUpdate(queryObject, updateObject, options);
    
        return updatedUpload;
    }

}

export default UploadsService;