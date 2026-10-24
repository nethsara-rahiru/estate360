import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IotService } from './providers/iot.service';
import { IotCloudFetchService } from './providers/iot-cloud-fetch.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { CreateDeviceAssignmentDto } from './dtos/create-device-assignment.dto';
import { CreateWorkerReadingDto } from './dtos/create-worker-reading.dto';
import { CreateEnvironmentReadingDto } from './dtos/create-environment-reading.dto';
import { ConfigureIotCloudDto } from './dtos/configure-iot-cloud.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('iot')
@UseGuards(AuthGuard, RolesGuard)
export class IotController {
  constructor(
    private readonly iotService: IotService,
    private readonly cloudFetchService: IotCloudFetchService,
  ) {}

  // Devices
  @Roles(Role.ADMIN)
  @Post('devices')
  public createDevice(@Body() createDto: CreateDeviceDto) {
    return this.iotService.createDevice(createDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('devices')
  public findAllDevices() {
    return this.iotService.findAllDevices();
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('devices/:id')
  public findDevice(@Param('id', ParseUUIDPipe) id: string) {
    return this.iotService.findDeviceById(id);
  }

  // Device Assignments
  @Roles(Role.ADMIN, Role.OWNER)
  @Post('assignments')
  public createAssignment(@Body() createDto: CreateDeviceAssignmentDto) {
    return this.iotService.createAssignment(createDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('assignments')
  public findAllAssignments() {
    return this.iotService.findAllAssignments();
  }

  // IoT Readings (Ingest)
  @Roles(Role.ADMIN)
  @Post('readings/worker')
  public createWorkerReading(@Body() dto: CreateWorkerReadingDto) {
    return this.iotService.createWorkerReading(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('readings/worker')
  public findWorkerReadings(
    @Query('estateId') estateId?: string,
    @Query('workerId') workerId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.iotService.findWorkerReadings({
      estateId,
      workerId,
      sessionId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Roles(Role.ADMIN)
  @Post('readings/environment')
  public createEnvironmentReading(@Body() dto: CreateEnvironmentReadingDto) {
    return this.iotService.createEnvironmentReading(dto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('readings/environment')
  public findEnvironmentReadings(
    @Query('estateId') estateId?: string,
    @Query('deviceId') deviceId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.iotService.findEnvironmentReadings({
      estateId,
      deviceId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  // Cloud Fetch & Integration
  @Roles(Role.ADMIN)
  @Get('cloud/config')
  public getCloudConfig() {
    return this.cloudFetchService.getConfig();
  }

  @Roles(Role.ADMIN)
  @Patch('cloud/config')
  public updateCloudConfig(@Body() configDto: ConfigureIotCloudDto) {
    return this.cloudFetchService.updateConfig(configDto);
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('cloud/sync')
  public syncAllFromCloud(
    @Query('estateId') estateId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.cloudFetchService.syncAll({
      estateId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('cloud/sync/worker')
  public syncWorkerFromCloud(
    @Query('estateId') estateId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.cloudFetchService.fetchAndSyncWorkerReadings({
      estateId,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Post('cloud/sync/environment')
  public syncEnvFromCloud(
    @Query('estateId') estateId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.cloudFetchService.fetchAndSyncEnvironmentReadings({
      estateId,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
