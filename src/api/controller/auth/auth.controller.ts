import { Body, Controller, Post, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongodbService } from '@repository/mongodb/mongodb.service';
import { AUTH } from 'src/constant/error.const';

@Controller({ path: 'auth' })
export class AuthController {
    constructor(private readonly models: MongodbService, private readonly jwtService: JwtService) {}

    @Post('user')
    async createUser(@Body() body: any) {
        const user = await this.models.User.findOne({ mobileNumber: body.mobileNumber });

        if (!user) throw new NotFoundException({ info: AUTH.MOBILE_NUMBER_NOT_FOUND }, AUTH.MOBILE_NUMBER_NOT_FOUND);
        // console.log(this.jwtService.)
        const token = this.jwtService.sign({ _id: user._id });
        return {
            token,
            user,
        };
    }
}
