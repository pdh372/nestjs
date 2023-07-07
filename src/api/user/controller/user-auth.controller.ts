import { Controller } from '@nestjs/common';
import { USER_ROUTE_AUTH } from '@api/api.router';

const { CONTROLLER } = USER_ROUTE_AUTH;

@Controller({ path: CONTROLLER })
export class UserAuthController {}
