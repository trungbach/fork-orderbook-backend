import { Injectable } from '@nestjs/common';
import { UserVolumeRepository } from 'src/repositories/postgre/user_volume.repository';
import { plainToClass } from 'class-transformer';
import { UserVolumeDto, UsersVolumeDto } from '../models/user_volume.dto';

@Injectable()
export class UserVolumeService {
  constructor() {
    // inject logging
  }

  async getUserVolume(productId: number, address: string, granularity: number) {
    const userVolume = await UserVolumeRepository.findLastUserVolume(
      productId,
      address,
      granularity,
    );

    return (
      plainToClass(UserVolumeDto, userVolume, {
        excludeExtraneousValues: true,
      }) || {
        address,
        volume: '0',
        granularity,
      }
    );
  }

  async getTopUserVolume(
    productId: number,
    granularity: number,
    startTime: number,
    endTime: number,
  ) {
    const topVolumes = await UserVolumeRepository.findTopUserVolumes(
      granularity,
      productId,
      startTime,
      endTime,
    );

    const result = plainToClass(
      UsersVolumeDto,
      { volumes: topVolumes },
      {
        excludeExtraneousValues: true,
      },
    ).volumes;

    return result;
  }
}
