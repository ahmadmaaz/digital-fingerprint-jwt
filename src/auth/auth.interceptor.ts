import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { Observable } from 'rxjs';
import * as crypto from 'crypto';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // Whitelisting the signin endpoint

    if(request.url.includes("/signin")){
      return next.handle();
    }

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }

    let decoded: any;
    try {
      decoded = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const tokenFingerprint = decoded?.fingerprint;
    if (!tokenFingerprint) {
      throw new UnauthorizedException('Token does not contain a fingerprint');
    }

    const requiredPlatform   = request.headers['sec-ch-ua-platform'] ?? '';
    const requiredLanguage   = request.headers['accept-language']    ?? '';
    const requiredEncoding   = request.headers['accept-encoding']    ?? '';
    const requiredWebGLHash  = request.headers['x-webgl-hash']       ?? '';

    const requiredHeaders:string = `${requiredPlatform}${requiredLanguage}${requiredEncoding}${requiredWebGLHash}`;

    const expectedHash:string = crypto
      .createHash('sha256')
      .update(requiredHeaders)
      .digest('hex');

    if (expectedHash !== tokenFingerprint) {
      //Here we can have the logic of revocation
      // We can have a third party service like redis where we revoke the accessToken and store it in memory
      throw new UnauthorizedException('Fingerprint mismatch: token invalid for this client environment');
    }

    return next.handle();
  }
}