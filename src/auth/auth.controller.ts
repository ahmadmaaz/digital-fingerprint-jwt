import {
  Body,
  Controller,
  Get,
  Post,
  Headers, Res, HttpStatus
} from "@nestjs/common";
import { AuthService } from './auth.service';
import {  Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  signupUser(
    @Body() dto:SignInDTO,
    @Headers() headers: Record<string,string>
  ) {
    console.log(headers)
    return this.authService.signin(dto, headers);

  }

  @Get("/verify")
  verify(
    @Res() res:Response
  ){
    res.status(HttpStatus.OK).send();
  }

}
