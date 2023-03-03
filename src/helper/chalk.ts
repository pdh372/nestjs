import * as util from 'util';
import * as chalk from 'chalk';
export const appColor = (...text: any[]) => {
    console.info(chalk.bgHex('16697a').white(util.inspect(text, { showHidden: false, depth: null, colors: true })));
};

export const logColor = (...text: any[]) => {
    console.info(chalk.bgHex('000').green(util.inspect(text, { showHidden: false, depth: null, colors: true })));
};
