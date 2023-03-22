import * as chalk from 'chalk';

export const appColor = (...text: any[]) => {
    console.info(chalk.bgHex('16697a').white(text));
};

export const logColor = (...text: any[]) => {
    console.info(chalk.bgHex('000').green(text));
};

export const socketColor = (...text: any[]) => {
    console.info(chalk.bgHex('C15DA1').blue(text));
};

export const errColor = (...text: any[]) => {
    console.info(chalk.bgHex('EF1A11').white(text));
};
