import { User } from 'src/model/user.model';

export const userSerialization = (user: User) => {
    return {
        _id: user._id?.toString(),
    };
};
