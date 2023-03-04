import { Module } from '@nestjs/common';
import { UserModule } from '@router/app/user/user.module';
import { MovieModule } from '@router/app/movie/movie.module';
import { TemplateModule } from '@router/app/template/template.module';

@Module({
    imports: [UserModule, MovieModule, TemplateModule],
})
export class RouterModule {}
