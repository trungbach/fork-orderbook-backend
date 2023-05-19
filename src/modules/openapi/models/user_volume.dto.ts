import { Expose, Type } from 'class-transformer';

export class UsersVolumeDto {
  @Expose()
  @Type(() => UserVolumeDto)
  volumes: UserVolumeDto[];
}
export class UserVolumeDto {
  @Expose({ name: 'address' })
  address: string;

  //   @Expose({ name: 'product_id' })
  //   user_id: number;

  @Expose({ name: 'total_volume' })
  total_volume: string;

  //   @Expose({ name: 'granularity' })
  //   granularity: number;
}
