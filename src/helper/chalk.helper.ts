import * as chalk from 'chalk';
import { Logger } from '@nestjs/common';

const logger = new Logger('', { timestamp: true });

export const appColor = (...text: any[]) => {
    logger.verbose(chalk.bgHex('16697a').white(text));
};

export const logColor = (...text: any[]) => {
    logger.log(chalk.bgHex('000').green(text));
};

export const socketColor = (...text: any[]) => {
    logger.log(chalk.bgHex('C15DA1').blue(text));
};

export const errColor = (...text: any[]) => {
    logger.error(chalk.bgHex('EF1A11').white(text));
};
