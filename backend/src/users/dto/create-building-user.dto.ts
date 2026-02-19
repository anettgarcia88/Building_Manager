import { IsEmail, IsString, IsEnum, MinLength, IsOptional, Matches } from 'class-validator';
import { BuildingUserRole } from '@prisma/client';

export class CreateBuildingUserDto {
    @IsEmail()
    email: string;

    @IsEnum(BuildingUserRole)
    role: BuildingUserRole;

    @IsString()
    firstName: string;

    @IsString()
    lastName1: string;

    @IsString()
    @IsOptional()
    lastName2?: string;

    @IsString()
    @IsOptional()
    @Matches(/^\d{4,10}(-\d{1,2})?$/, {
        message: 'Formato de Cédula inválido. Ejemplo: 1234567-89',
    })
    ci?: string;
}