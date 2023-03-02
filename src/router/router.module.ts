import { Module } from '@nestjs/common';
import { UserModule } from '@router/user/user.module';
import { MovieModule } from '@router/movie/movie.module';
import { TemplateModule } from '@router/template/template.module';

@Module({
    imports: [UserModule, MovieModule, TemplateModule],
})
export class RouterModule {}
