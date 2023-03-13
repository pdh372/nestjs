import * as util from 'util';
import * as chalk from 'chalk';

export const appColor = (...text: any[]) => {
    console.info(chalk.bgHex('16697a').white(util.inspect(text, { showHidden: false, depth: null, colors: true })));
};

export const logColor = (...text: any[]) => {
    console.info(chalk.bgHex('000').green(util.inspect(text, { showHidden: false, depth: null, colors: true })));
};

export const socketColor = (...text: any[]) => {
    console.info(chalk.bgHex('C15DA1').blue(text));
};

export const errColor = (...text: any[]) => {
    console.info(chalk.bgHex('EF1A11').white(util.inspect(text, { showHidden: false, depth: null, colors: true })));
};
