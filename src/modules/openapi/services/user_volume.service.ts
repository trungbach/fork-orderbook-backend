import { Injectable } from '@nestjs/common';
import { UserVolumeRepository } from 'src/repositories/postgre/user_volume.repository';
import { chain, sumBy } from 'lodash';
import { plainToClass } from 'class-transformer';
import { UserVolumeDto } from '../models/user_volume.dto';

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

    return plainToClass(UserVolumeDto, userVolume, {
      excludeExtraneousValues: true,
    });
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

    const result = chain(topVolumes)
      .map((volume) =>
        plainToClass(UserVolumeDto, volume, {
          excludeExtraneousValues: true,
        }),
      )
      .groupBy('address')
      .map((arr) => {
        const { granularity, address, product_id } = arr[0];
        return {
          granularity,
          address,
          productId: product_id,
          volume: sumBy(arr,'volume'),
        };
      })
      .value();

    return result;
  }
}
