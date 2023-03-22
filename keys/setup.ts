import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';

const PUBLIC_KEY_FILE_NAME = 'public.key';
const PRIVATE_KEY_FILE_NAME = 'private.key';

(async () => {
    try {
        const role = process.argv[2] || 'user';
        const bit = +process.argv[3] || 512;

        if (typeof bit !== 'number') {
            return console.error('ERROR: process.argv[3] is not number');
        }

        const root = path.join(__dirname, role);
        if (!fs.existsSync(root)) {
            fs.mkdirSync(root);
        }

        const files = fs.readdirSync(root);

        if (files.includes(PUBLIC_KEY_FILE_NAME) || files.includes(PRIVATE_KEY_FILE_NAME)) {
            return console.error(
                'ERROR: The key already exists, if you want to create a new one, please delete the old key',
            );
        }

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: bit,
        });
        fs.writeFileSync(`${root}/${PRIVATE_KEY_FILE_NAME}`, privateKey.export({ type: 'pkcs1', format: 'pem' }));
        fs.writeFileSync(`${root}/${PUBLIC_KEY_FILE_NAME}`, publicKey.export({ type: 'pkcs1', format: 'pem' }));

        console.info(`Wrote ${PRIVATE_KEY_FILE_NAME} and ${PUBLIC_KEY_FILE_NAME} into ${root}`);
    } catch (error) {
        console.error(error.message);
    }
})();
