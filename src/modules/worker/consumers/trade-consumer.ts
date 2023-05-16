import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TradeUserEvent } from '../types';
import { logErrorConsole } from 'src/utils/log-provider';
import { UserVolume } from 'src/entities/postgre';
import { roundTime } from 'src/utils/date';
import { UserVolumeRepository } from 'src/repositories/postgre/user_volume.repository';
import { sum } from 'lodash';

@Processor('trade-queue')
export class TradeConsumer {
  private GRANULARITY_ARR = [60, 1440];
  constructor() {
    // inject logging service
  }

  @Process('trade-job')
  async mainProcessTrade(job: Job<Array<TradeUserEvent>>): Promise<void> {
    const events = job.data;
    try {
      return await this.handleTradeUserEvent(events);
    } catch (err) {
      logErrorConsole(TradeConsumer.name, this.mainProcessTrade.name, err);
      throw new Error(err);
    }
  }

  private async handleTradeUserEvent(events: TradeUserEvent[]) {
    const userVolumeInsertDb: Array<UserVolume> = [];

    for (const event of events) {
      const { productId, userId, volume, time } = event;
      for (const granularity of this.GRANULARITY_ARR) {
        const newTime = roundTime(new Date(time), granularity);
        let userVolume = await UserVolumeRepository.findOne({
          where: {
            productId: +productId,
            userId: +userId,
            granularity: +granularity,
            time: newTime,
          },
        });

        if (!userVolume) {
          userVolume = new UserVolume();
          userVolume.userId = userId;
          userVolume.productId = +productId;
          userVolume.granularity = granularity;
          userVolume.time = newTime;
          userVolume.volume = volume;
        } else {
          userVolume.volume = sum([+userVolume.volume, volume]);
        }

        userVolumeInsertDb.push(userVolume);
      }
    }
    if (userVolumeInsertDb.length > 0) {
      await this.handleUpsertDb(userVolumeInsertDb);
    }
    return;
  }

  private async handleUpsertDb(userVolumes: Array<UserVolume>) {
    await UserVolumeRepository.upsert(userVolumes, [
      'productId',
      'userId',
      'granularity',
      'time',
    ]);
  }
}
