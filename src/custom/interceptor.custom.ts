import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { logColor, errColor } from '@helper/chalk.helper';
import { ConfigService } from '@nestjs/config';
import { IConfigService } from '@interface/config.interface';
import * as _ from 'lodash';

@Injectable()
export class MorganInterceptor implements NestInterceptor {
    constructor(@Inject(ConfigService) private readonly configService: IConfigService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();
        const now = Date.now();

        console.info('\n');
        if (this.configService.get('debug_global_request_data')) {
            if (!_.isEmpty(req.body)) logColor('[BODY] = ' + JSON.stringify(req.body));
            if (!_.isEmpty(req.query)) logColor('[QUERY] = ' + JSON.stringify(req.query));
            if (!_.isEmpty(req.params)) logColor('[PARAMS] = ' + JSON.stringify(req.params));
        }

        return next.handle().pipe(
            tap(() => {
                logColor(`[${req.method}] ${req.url} :: code: ${res.statusCode} - ${Date.now() - now}ms\n`);
            }),
            catchError(err => {
                errColor(`[${req.method}] ${req.url} :: ${Date.now() - now}ms\n`);
                return throwError(() => err);
            }),
            map(data => ({ statusCode: res.statusCode, data })),
        );
    }
}

/*
    Interceptor trong NestJS được lấy cảm hứng từ lập trình hướng khía cạnh (Aspect Oriented Programming - AOP). 
    
    Trong lập trình AOP, một khía cạnh (aspect) được sử dụng để tách biệt các quan tâm khác nhau của một ứng dụng như ghi nhật ký (logging), xác thực (authentication), đo lường hiệu suất (performance measurement) và nhiều hơn nữa. 
    
    Mỗi khía cạnh có thể được áp dụng vào nhiều lớp và phương thức khác nhau của ứng dụng, giúp giảm thiểu sự lặp lại mã và dễ dàng bảo trì.

    Interceptor trong NestJS hoạt động tương tự như khía cạnh trong AOP. Chúng cho phép bạn thực hiện các hoạt động trước và sau khi một yêu cầu HTTP được xử lý, như ghi nhật ký, xử lý lỗi, thực hiện xác thực và đo lường hiệu suất. Interceptor có thể được áp dụng cho toàn bộ ứng dụng hoặc chỉ cho một phạm vi cụ thể.

    Interceptor là một trong những tính năng mạnh mẽ của NestJS, giúp bạn quản lý các quan tâm của ứng dụng của mình một cách dễ dàng và hiệu quả.

    bind extra logic before / after method execution
    transform the result returned from a function
    transform the exception thrown from a function
    extend the basic function behavior
    completely override a function depending on specific conditions (e.g., for caching purposes)
 */

/**
    Trong ví dụ mã nguồn của MorganInterceptor mà tôi cung cấp, có sự khác biệt giữa Observables và Promises.

    Trong phương thức intercept(), phương thức handle() của đối tượng CallHandler trả về một Observable. Sau đó, toán tử tap() được áp dụng vào Observable để sửa đổi phản hồi hoặc ghi thông tin mà không thay đổi phản hồi thực sự được trả về cho khách hàng.

    Observables là một loại luồng dữ liệu có thể phát ra nhiều giá trị theo thời gian. Observables thường được sử dụng trong lập trình phản ứng và có thể được sử dụng để xử lý các hoạt động bất đồng bộ một cách không chặn.

    Ngược lại, Promise là một bộ chứa giá trị duy nhất đại diện cho hoàn thành hoặc thất bại của một hoạt động bất đồng bộ. Promise có thể được sử dụng để xử lý các hoạt động bất đồng bộ một cách chặn hoặc không chặn, phụ thuộc vào cách chúng được sử dụng.

    Trong NestJS, cả Observables và Promises đều được sử dụng rộng rãi để xử lý các hoạt động bất đồng bộ. Observables thường được sử dụng cho các luồng dữ liệu có thể phát ra nhiều giá trị theo thời gian, trong khi Promises được sử dụng cho các hoạt động bất đồng bộ một giá trị.

    Trong ví dụ mã nguồn cho MorganInterceptor, một Observable được sử dụng vì phương thức handle() trả về một Observable. Sau đó, toán tử tap() được áp dụng vào Observable để sửa đổi phản hồi hoặc ghi thông tin.
 */
