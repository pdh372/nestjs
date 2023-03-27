import { Controller, Get } from '@nestjs/common';
import { AuthService } from '@service/auth/auth.service';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { userSerialization } from '@serialization/user.serialization';
import { UserDecorator, UserAuth } from '@guard/user-auth';
import { User } from '@repository/mongodb/model/user.model';
import { USER_ROUTE_AUTH } from '@api/api.router';

const { CONTROLLER, ROUTE } = USER_ROUTE_AUTH;

@UserAuth()
@Controller({ path: CONTROLLER })
export class UserAuthController {
    constructor(private authService: AuthService, private models: MongodbService) {}

    @Get(ROUTE.ME)
    getMe(@UserDecorator() user: User) {
        return { user: userSerialization(user) };
    }
}
