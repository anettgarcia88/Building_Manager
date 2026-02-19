import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClosingService } from './closing.service';

@Injectable()
export class ClosingScheduler {
    private readonly logger = new Logger(ClosingScheduler.name);

    constructor(private readonly closingService: ClosingService) { }

    // Run at 00:00 on the 1st day of every month
    @Cron('0 0 1 * *')
    async handleMonthlyClosing() {
        const today = new Date();
        // Calculate previous month and year
        let month = today.getMonth(); // 0-11, where 0 is Jan. If today is Feb 1st (1), we want Jan (0).
        let year = today.getFullYear();

        if (month === 0) {
            month = 12; // December
            year = year - 1;
        }

        this.logger.log(`Starting automatic closing for ${month}/${year}...`);

        try {
            const result = await this.closingService.executeMonthlyClosing(month, year);
            this.logger.log(`Automatic closing completed: ${result.message}`);
        } catch (error) {
            this.logger.error(`Automatic closing failed`, error.stack);
        }
    }
}
