import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserVolumeService } from '../services/user_volume.service';

@ApiTags('Volumes of users')
@Controller('/v1/volumes')
export class UserVolumeController {
  constructor(private readonly userVolumeService: UserVolumeService) {}

  @Get('/:product_id/current-volume/:address')
  async getVolumeUser(
    @Param('product_id') product_id: number,
    @Param('address') address: string,
    @Query('granularity') granularity: number,
  ) {
    const data =  await this.userVolumeService.getUserVolume(
      product_id,
      address,
      granularity,
    );

    return data;
  }

  @ApiParam({
    name: 'product_id',
    required: true,
    description: 'query by product id',
    type: Number,
  })
  @Get('/:product_id')
  async getTopVolumeUsers(
    @Param('product_id') product_id: number,
    @Query('granularity') granularity: number,
    @Query('startTime') startTime: number,
    @Query('endTime') endTime: number,
  ) {
    return await this.userVolumeService.getTopUserVolume(
      product_id,
      granularity,
      startTime,
      endTime,
    );
  }
}
