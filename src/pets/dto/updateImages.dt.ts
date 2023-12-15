import { IsArray, IsNotEmpty } from 'class-validator'

export class updateImagesDto {
    @IsNotEmpty()
    @IsArray()
    readonly indexes: Array<number>
}
