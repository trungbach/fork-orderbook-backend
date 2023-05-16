import { Expose } from 'class-transformer';

export class UserVolumeDto {
  @Expose({ name: 'address'})
  address: string;

  @Expose({ name: 'product_id' })
  product_id: number;

  @Expose({ name: 'volume' })
  volume: string;

  @Expose({ name: 'granularity' })
  granularity: number;
}
