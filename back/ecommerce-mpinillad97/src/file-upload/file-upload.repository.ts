import { Injectable } from "@nestjs/common";
import { UploadApiResponse, v2 as Cloudinary } from "cloudinary";
import toStream = require('buffer-to-stream')

@Injectable()
export class fileUploadRepository{
    constructor(){}

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse>{
        return new Promise((resolve, reject) => {
            const upload = Cloudinary.uploader.upload_stream(
                {resource_type: 'auto'},
                (error, result) => {
                    if(error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            )
            toStream(file.buffer).pipe(upload)
        })
    }
}