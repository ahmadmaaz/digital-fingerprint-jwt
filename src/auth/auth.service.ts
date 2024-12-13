import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}



  signin(dto:SignInDTO,headers:Record<string,string>){
    const requiredHeaders= `${headers["sec-ch-ua-platform"]}${headers["accept-language"]}${headers["accept-encoding"]}${headers["x-webgl-hash"]}`;

    const hash = crypto.createHash('sha256').update(requiredHeaders).digest('hex');

    const accessToken=this.jwtService.sign({
      username: "admin",
      fingerprint: hash
    });
    console.log(accessToken)
    return {
      accessToken:accessToken
    };

  }


}
