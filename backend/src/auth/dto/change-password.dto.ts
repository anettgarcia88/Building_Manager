import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    currentPassword: string;

    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/[A-Z]/, { message: 'La contraseña debe contener al menos una letra mayúscula' })
    @Matches(/[0-9]/, { message: 'La contraseña debe contener al menos un número' })
    newPassword: string;

    @IsString()
    passwordConfirmation: string;
}
