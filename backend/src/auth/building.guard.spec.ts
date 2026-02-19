import { BuildingGuard } from './building.guard';
import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('BuildingGuard', () => {
    let guard: BuildingGuard;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BuildingGuard,
                Reflector,
                {
                    provide: PrismaService,
                    useValue: {
                        userBuildingRole: {
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        guard = module.get<BuildingGuard>(BuildingGuard);
        prisma = module.get<PrismaService>(PrismaService);
    });

    const mockContext = (headers: any, user: any) =>
    ({
        switchToHttp: () => ({
            getRequest: () => ({
                headers: headers || {},
                params: {},
                query: {},
                user,
            }),
        }),
    } as ExecutionContext);

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should allow if no buildingId is present (fallback behavior)', async () => {
        const context = mockContext({}, { userId: 1, role: 'USER' });
        expect(await guard.canActivate(context)).toBe(true);
    });

    it('should deny if user has no role for the building and is not global ADMIN', async () => {
        const context = mockContext({ 'x-building-id': 'building-1' }, { userId: 1, role: 'USER' });
        jest.spyOn(prisma.userBuildingRole, 'findUnique').mockResolvedValue(null);

        await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });

    it('should allow if user has a role for the building', async () => {
        const context = mockContext({ 'x-building-id': 'building-1' }, { userId: 1, role: 'USER' });
        jest.spyOn(prisma.userBuildingRole, 'findUnique').mockResolvedValue({
            id: 'role-1',
            userId: 1,
            buildingId: 'building-1',
            role: 'TENANT',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        expect(await guard.canActivate(context)).toBe(true);
    });
});
