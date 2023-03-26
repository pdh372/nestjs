import { Controller, Get } from '@nestjs/common';
import { AuthService } from '@src/service/auth/auth.service';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { userSerialization } from '@src/serialization/user.serialization';
import { UserDecorator, UserAuth } from '@custom/guard/user-auth';
import { User } from '@repository/mongodb/model/user.model';
import { USER_ROUTE } from '@src/api/api.const';

@UserAuth()
@Controller({ path: USER_ROUTE.AUTH.CONTROLLER })
export class UserAuthController {
    constructor(private authService: AuthService, private models: MongodbService) {}

    @Get(USER_ROUTE.AUTH.ROUTE.ME)
    getMe(@UserDecorator() user: User) {
        console.log(user);
        return { user: userSerialization(user) };
    }
}
