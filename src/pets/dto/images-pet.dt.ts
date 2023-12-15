import { IsString, IsUrl } from 'class-validator'

export class ImagesDto {
    @IsString()
    readonly public_id: string

    @IsString()
    @IsUrl()
    readonly secure_url: string
}
