import { User } from '@repository/mongodb/model/user.model';

export function userSerialization(user: User) {
    return {
        _id: user._id?.toString(),
        mobileNumber: user.mobileNumber,
    };
}
