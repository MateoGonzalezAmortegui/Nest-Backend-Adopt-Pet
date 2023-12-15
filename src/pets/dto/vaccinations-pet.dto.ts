import { IsArray, IsNotEmpty } from 'class-validator'

export class VaccinationsDto {
    @IsNotEmpty()
    @IsArray()
    readonly name: Array<string>
}
