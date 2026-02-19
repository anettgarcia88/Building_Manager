import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BuildingGuard } from '../auth/building.guard';
import { CreateBuildingUserDto } from './dto/create-building-user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    /**
     * POST /users/buildings/:buildingId/staff
     * Crear un nuevo usuario para un edificio
     * Requiere ser BUILDING_ADMIN del edificio
     */
    @Post('buildings/:buildingId/staff')
    @UseGuards(JwtAuthGuard, BuildingGuard)
    async createBuildingUser(
        @Param('buildingId') buildingId: string,
        @Body() createUserDto: CreateBuildingUserDto,
    ) {
        try {
            const userBuildingRole = await this.usersService.createBuildingUser(
                buildingId,
                createUserDto,
            );
            return {
                success: true,
                data: userBuildingRole,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: error.message,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    /**
     * GET /users/buildings/:buildingId/staff
     * Obtener todos los usuarios de un edificio
     */
    @Get('buildings/:buildingId/staff')
    @UseGuards(JwtAuthGuard, BuildingGuard)
    async getBuildingUsers(@Param('buildingId') buildingId: string) {
        try {
            const users = await this.usersService.getBuildingUsers(buildingId);
            return {
                success: true,
                data: users,
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * DELETE /users/buildings/:buildingId/staff/:userId
     * Eliminar un usuario de un edificio
     */
    @Delete('buildings/:buildingId/staff/:userId')
    @UseGuards(JwtAuthGuard, BuildingGuard)
    async removeBuildingUser(
        @Param('buildingId') buildingId: string,
        @Param('userId') userId: string,
    ) {
        try {
            await this.usersService.removeBuildingUser(buildingId, userId);
            return {
                success: true,
                message: 'Usuario eliminado del edificio',
            };
        } catch (error) {
            throw new HttpException(
                {
                    success: false,
                    message: error.message,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
