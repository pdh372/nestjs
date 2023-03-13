import { Injectable } from '@nestjs/common';
import { fakeDatabaseURL } from '@helper/fakeData.helper';

@Injectable()
export class MyCustomProvide {
    _databaseURL = fakeDatabaseURL();

    log() {
        return `here is my custom provide`;
    }

    getDatabaseURL() {
        return this._databaseURL.url;
    }
}
