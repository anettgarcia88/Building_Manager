import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, BuildingUserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import { generateRandomPassword } from '../utils/password';
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) { }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const hashedPassword = await argon2.hash(data.password);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  /**
   * Crear un usuario para un edificio específico
   * Genera una contraseña aleatoria y la envía por email
   */
  async createBuildingUser(
    buildingId: string,
    createUserDto: {
      email: string;
      role: BuildingUserRole;
      firstName: string;
      lastName1: string;
      lastName2?: string;
      ci?: string;
    },
  ) {
    // Generar contraseña aleatoria
    const temporaryPassword = generateRandomPassword();

    // Verificar si el usuario ya existe
    let user = await this.findOne(createUserDto.email);

    if (!user) {
      // Crear nuevo usuario con la contraseña generada
      const hashedPassword = await argon2.hash(temporaryPassword);
      user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          role: 'TENANT', // Rol global por defecto
        },
      });
    }

    // Obtener datos del edificio
    const building = await this.prisma.building.findUnique({
      where: { id: buildingId },
      select: { name: true },
    });

    // Crear o actualizar relación de usuario con el edificio
    const userBuildingRole = await this.prisma.userBuildingRole.upsert({
      where: {
        userId_buildingId: {
          userId: user.id,
          buildingId,
        },
      },
      update: {
        role: createUserDto.role,
        firstName: createUserDto.firstName,
        lastName1: createUserDto.lastName1,
        lastName2: createUserDto.lastName2,
        ci: createUserDto.ci,
      },
      create: {
        userId: user.id,
        buildingId,
        role: createUserDto.role,
        firstName: createUserDto.firstName,
        lastName1: createUserDto.lastName1,
        lastName2: createUserDto.lastName2,
        ci: createUserDto.ci,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Enviar email con la contraseña temporal
    await this.emailService.sendTemporaryPassword(
      createUserDto.email,
      createUserDto.firstName,
      temporaryPassword,
      building?.name || 'El edificio',
    );

    return {
      ...userBuildingRole,
      message: 'Usuario creado. Contraseña temporal enviada por email.',
    };
  }

  /**
   * Obtener todos los usuarios de un edificio
   */
  async getBuildingUsers(buildingId: string) {
    return this.prisma.userBuildingRole.findMany({
      where: { buildingId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Eliminar usuario de un edificio
   */
  async removeBuildingUser(buildingId: string, userId: string) {
    return this.prisma.userBuildingRole.delete({
      where: {
        userId_buildingId: {
          userId,
          buildingId,
        },
      },
    });
  }
}
