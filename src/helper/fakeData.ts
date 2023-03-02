import { faker } from '@faker-js/faker/locale/de';

export const fakeBasicData = () => {
    function createRandomUser() {
        return {
            _id: faker.datatype.uuid(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
        };
    }

    function movies() {
        return {
            _id: faker.datatype.uuid(),
            title: faker.music.songName(),
            genres: faker.music.genre(),
        };
    }

    return {
        users: Array.from({ length: 3 }).map(() => createRandomUser()),
        movies: Array.from({ length: 10 }).map(() => movies()),
    };
};

export const fakeDatabaseURL = () => {
    return {
        url: faker.address.direction(),
    };
};
