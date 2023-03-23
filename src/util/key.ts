import * as crypto from 'crypto';

function generateRandomString(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|\\:;"<>,.?/~`';
    const randomBytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % chars.length];
    }
    return result;
}

(async () => {
    try {
        const bit = +process.argv[2] || 2048;

        if (typeof bit !== 'number') {
            return console.error('ERROR: process.argv[3] is not number');
        }

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: bit,
        });

        console.log('---------------------PRIVATE KEY-----------------------------');
        console.log(Buffer.from(privateKey.export({ type: 'pkcs1', format: 'pem' })).toString('base64'));
        console.log('---------------------PRIVATE KEY-----------------------------');

        console.log('\n\n');

        console.log('---------------------PUBLIC KEY------------------------------');
        console.log(Buffer.from(publicKey.export({ type: 'pkcs1', format: 'pem' })).toString('base64'));
        console.log('---------------------PUBLIC KEY------------------------------');

        console.log('\n\n');

        console.log('---------------------SECRET KEY------------------------------');
        // 512 bit / 8 = 64 char
        console.log(generateRandomString(512 / 8));
        console.log('---------------------SECRET KEY------------------------------');
    } catch (error) {
        console.error(error.message);
    }
})();
