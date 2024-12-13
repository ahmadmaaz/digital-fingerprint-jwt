import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from "./auth/auth.module";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
    AuthModule
  ],
  controllers: [AppController],
  providers:[
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ]
})
export class AppModule {}
