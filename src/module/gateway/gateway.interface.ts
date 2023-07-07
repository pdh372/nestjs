import { Provider } from '@nestjs/common';

export interface IGatewayModuleOption {
    imports?: any[];
    providers: Provider[];
}
