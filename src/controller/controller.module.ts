import { Module } from '@nestjs/common';
import { UserModule } from '@src/controller/app/user/user.module';
import { MovieModule } from '@src/controller/app/movie/movie.module';
import { TemplateModule } from '@src/controller/app/template/template.module';

@Module({
    imports: [UserModule, MovieModule, TemplateModule],
})
export class ControllerModule {}
