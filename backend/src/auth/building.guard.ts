import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuildingGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 1. Get buildingId from Headers (x-building-id) or Query/Body (fallback)
    const buildingId =
      request.headers['x-building-id'] ||
      request.params.buildingId ||
      request.query.buildingId;

    if (!buildingId) {
      // Some endpoints might not need buildingId (e.g. "list my buildings" or "create building")
      // We need a decorator to skip this check if needed, OR we enforce it for "In-Building" routes.
      // For Phase 3, we assume most routes are in-building.
      // If no buildingId, we allow IF the route is public or global-admin specific.
      // But to be strict:
      return true;
    }

    // 2. Attach to request for easy access
    request.buildingId = buildingId;

    // 3. User must have access to this building or be SUPERADMIN (Global)
    if (user.role === 'ADMIN') {
      // Assuming global ADMIN for now. Phase 3 says "User X -> admin in Building A".
      // The User model has a global 'role'. If it is USER, we check UserBuildingRole.
      // If it is ADMIN, maybe they are Superadmin?
      // Let's check UserBuildingRole.
    }

    // Check if user has a role for this building
    const userRole = await this.prisma.userBuildingRole.findUnique({
      where: {
        userId_buildingId: {
          userId: user.userId,
          buildingId: buildingId,
        },
      },
    });

    if (!userRole && user.role !== 'ADMIN') {
      // Assuming 'ADMIN' global role is superadmin
      throw new ForbiddenException('You do not have access to this building');
    }

    return true;
  }
}
