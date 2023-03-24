import { Controller, Get } from '@nestjs/common';
import { AuthService } from '@service/auth/auth.service';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { userSerialization } from '@serialization/user.serialization';
import { UserDecorator, UserAuthGuard } from '@custom/guard/user-auth';
import { User } from '@repository/mongodb/model/user.model';

// @UseGuards(UserJwtGuard)
@Controller({ path: 'user/auth' })
export class UserAuthController {
    constructor(private authService: AuthService, private models: MongodbService) {}

    @Get('me')
    @UserAuthGuard()
    getMe(@UserDecorator() user: User) {
        return { user: userSerialization(user) };
    }
}
