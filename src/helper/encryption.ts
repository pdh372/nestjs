import * as crypto from 'crypto';
import * as _ from 'lodash';

const key = 'e0fbmmbrZoKbw5BZFo1LTi0SVWhBo3GD';
const iv = 'W0cMY4tTLVeaJLaA';

const encrypt = (value: string) => {
    if (!_.isString(value)) return value;
    if (!value || value === 'null' || value === 'undefined') return '';
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(value + '', 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};

const decrypt = (encrypted: string) => {
    try {
        if (!encrypted || encrypted === 'null' || encrypted === 'undefined') return '';
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = decipher.update(encrypted, 'base64', 'utf8');
        return decrypted + decipher.final('utf8');
    } catch (err) {
        console.error(err);
        return encrypted;
    }
};

const typeOf = (value: any): 'string' | 'undefined' | 'symbol' | 'number' | 'null' | 'array' | 'object' => {
    const str: string = Object.prototype.toString.call(value);
    return str.slice(8, -1).toLowerCase() as any;
};

const encryptModel = (value: any): any => {
    switch (typeOf(value)) {
        case 'array': {
            return value.map(encryptModel);
        }
        case 'object': {
            const keys = Object.keys(value);
            return Object.fromEntries(keys.map(k => [k, encryptModel(value[k])]));
        }

        default: {
            return encrypt(value);
        }
    }
};

const decryptModel = (value: any): any => {
    switch (typeOf(value)) {
        case 'array': {
            return value.map(decryptModel);
        }
        case 'object': {
            const keys = Object.keys(value);
            return Object.fromEntries(keys.map(k => [k, decryptModel(value[k])]));
        }

        default: {
            return decrypt(value);
        }
    }
};

function decryptFields(ENCRYPT_FIELDS: string[]) {
    return function (data: { [x: string]: any }) {
        ENCRYPT_FIELDS.forEach(field => {
            if (data && data[field]) data[field] = decryptModel(data[field]);
        });
    };
}

export { decryptFields, encryptModel, decryptModel };
