import { AuthGateway } from './auth.socket';
import { PublicGateway } from './public.socket';

export const SOCKET_PROVIDERS = [AuthGateway, PublicGateway];
