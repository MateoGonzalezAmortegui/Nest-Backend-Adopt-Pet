import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUrl } from 'class-validator'

export class ImagesDto {
    @ApiProperty()
    @IsString()
    readonly public_id: string

    @ApiProperty()
    @IsString()
    @IsUrl()
    readonly secure_url: string
}
