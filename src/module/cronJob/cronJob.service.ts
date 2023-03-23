import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { MongodbService } from '@repository/mongodb/mongodb.service';

@Injectable()
export class CronJobService {
    private readonly logger = new Logger(CronJobService.name);

    constructor(private readonly models: MongodbService) {}

    // @Cron('45 * * * * *')
    // handleCron45s() {
    //     this.logger.debug('Called when the current second is 45');
    // }

    // @Cron(CronExpression.EVERY_5_SECONDS)
    // async handleCron10s() {
    //     const xxx = await this.models.ErrorLog.find();
    //     this.logger.debug('Called every 5 seconds: ERROR.LENGTH = ' + xxx.length);
    // }
}
