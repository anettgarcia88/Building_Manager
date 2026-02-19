import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await argon2.verify(user.password, pass))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    // Fetch user's buildings with their specific roles
    const validBuildings = await this.prisma.userBuildingRole.findMany({
      where: { userId: user.id },
      include: { building: { select: { id: true, name: true, slug: true } } },
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        buildings: validBuildings.map((vb) => ({
          id: vb.buildingId,
          name: vb.building.name,
          slug: vb.building.slug,
          role: vb.role, // BuildingUserRole
          firstName: vb.firstName,
          lastName1: vb.lastName1,
        })),
      },
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verificar que las contraseñas coincidan
    if (changePasswordDto.newPassword !== changePasswordDto.passwordConfirmation) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Verificar contraseña actual
    const isPasswordValid = await argon2.verify(user.password, changePasswordDto.currentPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña actual incorrecta');
    }

    // Hash la nueva contraseña
    const hashedPassword = await argon2.hash(changePasswordDto.newPassword);

    // Actualizar en la base de datos
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: 'Contraseña cambiada exitosamente',
    };
  }
}
