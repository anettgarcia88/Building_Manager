import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { BuildingGuard } from '../auth/building.guard'; // Not needed for creating/listing buildings

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Post('units')
  @UseGuards(JwtAuthGuard)
  createUnit(@Body() body: { number: string; floor: number; buildingId: string }) {
    return this.propertiesService.createUnit({
      number: body.number,
      floor: Number(body.floor),
      building: { connect: { id: body.buildingId } },
      status: 'VACANT',
      sizeSqM: 0, // Default or add to form later
    });
  }

  @Get('buildings/:id/units')
  @UseGuards(JwtAuthGuard)
  findAllUnits(@Param('id') id: string) {
    return this.propertiesService.findAllUnits(id);
  }

  @Post('buildings')
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() body: { name: string; address: string; description?: string }) {
    return this.propertiesService.createBuilding(
      {
        name: body.name,
        address: body.address,
        description: body.description,
        status: 'ACTIVE',
      },
      req.user.userId,
    );
  }

  @Get('buildings')
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    console.log('GET /properties/buildings - User:', req.user);
    return this.propertiesService.findAllForUser(req.user.userId);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const building = await this.propertiesService.findBySlug(slug);
    if (!building) {
      // throw new NotFoundException('Building not found');
      return null;
    }
    return building;
  }
}
