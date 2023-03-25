import { Controller, Get } from '@nestjs/common';
import { AuthService } from '@service/auth/auth.service';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { userSerialization } from '@serialization/user.serialization';
import { UserDecorator, UserAuthGuard } from '@custom/guard/user-auth';
import { User } from '@repository/mongodb/model/user.model';
import { USER_ROUTE } from '@router/router.const';

// @UseGuards(UserJwtGuard)
@Controller({ path: USER_ROUTE.AUTH.CONTROLLER })
export class UserAuthController {
    constructor(private authService: AuthService, private models: MongodbService) {}

    @Get(USER_ROUTE.AUTH.ROUTE.ME)
    @UserAuthGuard()
    getMe(@UserDecorator() user: User) {
        return { user: userSerialization(user) };
    }
}
