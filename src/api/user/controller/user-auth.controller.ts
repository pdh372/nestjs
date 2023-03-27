import { Controller, Get } from '@nestjs/common';
import { AuthService } from '@service/auth/auth.service';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { userSerialization } from '@serialization/user.serialization';
import { User } from '@repository/mongodb/model/user.model';
import { USER_ROUTE_AUTH } from '@api/api.router';
import { UserAccessTokenDecorator, UserAccessTokenGuard } from '@guard/access-token';

const { CONTROLLER, ROUTE } = USER_ROUTE_AUTH;

@Controller({ path: CONTROLLER })
export class UserAuthController {
    constructor(private authService: AuthService, private models: MongodbService) {}

    @UserAccessTokenGuard({ isLean: true })
    @Get(ROUTE.ME)
    getMe(@UserAccessTokenDecorator() user: User) {
        return { user: userSerialization(user) };
    }
}
