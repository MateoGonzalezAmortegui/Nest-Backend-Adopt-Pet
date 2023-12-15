import {
    IsArray,
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUrl,
    Min,
    MinLength,
    ValidateIf,
    ValidateNested,
} from 'class-validator'
import { ImagesDto } from './images-pet.dt'
import { VaccinationsDto } from './vaccinations-pet.dto'
import { Type } from 'class-transformer'

export class CreatePetDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly animal: string

    @IsNotEmpty()
    @IsString()
    readonly breed: string

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    readonly description: string

    @IsNotEmpty()
    @IsString()
    readonly gender: string

    @IsNotEmpty()
    @IsString()
    readonly years: string

    @ValidateIf((params) => params.years === '0')
    @IsString()
    readonly months: string

    @IsNotEmpty()
    @IsString()
    readonly latitude: string

    @IsNotEmpty()
    @IsString()
    readonly longitude: string

    @IsOptional()
    @ValidateNested({ each: true }) //* Indica que la validación se aplica a cada elemento del array
    @Type(() => VaccinationsDto) //* Le indica a class-transformer el tipo de la clase anidada
    readonly vaccinations: VaccinationsDto[]

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ImagesDto)
    readonly images: ImagesDto[]
}
