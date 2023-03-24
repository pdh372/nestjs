import { Body, Controller, Post, ConflictException, NotFoundException, UseInterceptors } from '@nestjs/common';
import { AuthService } from '@router/auth/auth.service';
import { UserSignUpDTO, UserLoginDTO } from '@router/user/user.dto';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { ERROR_USER } from '@constant/error.const';
import { hashPassword, comparePassword } from '@util/string';
import { LockActionMetadata } from '@custom/interceptor/lock-action/lock-action.metadata';
import { LA_TYPE } from '@custom/interceptor/lock-action/lock-action.const';
import { TL_TYPE } from '@custom/interceptor/temp-lock/temp-lock.const';
import { TempLockMetadata } from '@custom/interceptor/temp-lock/temp-lock.metadata';
import { LockActionInterceptor } from '@custom/interceptor/lock-action/lock-action.interceptor';
import { TempLockInterceptor } from '@custom/interceptor/temp-lock/temp-lock.interceptor';

@Controller({ path: 'user/public' })
export class UserPublicController {
    constructor(private authService: AuthService, private models: MongodbService) {}

    @UseInterceptors(LockActionInterceptor, TempLockInterceptor)
    @TempLockMetadata({ lockType: TL_TYPE.SIGNUP })
    @LockActionMetadata({ lockType: LA_TYPE.SIGNUP })
    @Post('signup')
    async handleSignup(@Body() body: UserSignUpDTO) {
        const { mobileNumber, password } = body;

        const isExists = await this.models.User.exists({ mobileNumber });
        if (isExists) throw new ConflictException({ info: ERROR_USER.ACCOUNT_EXISTS });

        const newUser = await this.models.User.create({
            password: await hashPassword(password),
            mobileNumber,
        });

        return {
            token: this.authService.signUserToken({ _id: newUser._id }),
            user: newUser,
        };
    }

    @UseInterceptors(TempLockInterceptor)
    @TempLockMetadata({ lockType: TL_TYPE.LOGIN })
    @Post('login')
    async handleLogin(@Body() body: UserLoginDTO) {
        const { mobileNumber, password } = body;

        const user = await this.models.User.findOne({ mobileNumber });
        if (!user) {
            throw new NotFoundException({ info: ERROR_USER.ACCOUNT_NOT_FOUND });
        }
        if (!(await comparePassword(password, user.password))) {
            throw new NotFoundException({ info: ERROR_USER.ACCOUNT_NOT_FOUND });
        }

        return {
            token: this.authService.signUserToken({ _id: user._id }),
            user,
        };
    }
}
