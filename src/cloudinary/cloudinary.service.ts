import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryResponse } from './cloudinary.response'
import { CloudinaryUploadOptions } from './interface/interface.cloudinary'
const streamifier = require('streamifier')

@Injectable()
export class CloudinaryService {
    async uploadFiles(
        files: Express.Multer.File[],
        options: CloudinaryUploadOptions,
    ): Promise<CloudinaryResponse[]> {
        const uploadPromises: Promise<CloudinaryResponse>[] = []
        files.forEach((file) => {
            const uploadPromise = new Promise<CloudinaryResponse>(
                (resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { ...options, folder: 'animals' },
                        (error, result) => {
                            if (error) return reject(error)
                            resolve(result)
                        },
                    )
                    streamifier.createReadStream(file.buffer).pipe(uploadStream)
                },
            )

            uploadPromises.push(uploadPromise)
        })

        return Promise.all(uploadPromises)
    }

    async deleteFile(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }
}
