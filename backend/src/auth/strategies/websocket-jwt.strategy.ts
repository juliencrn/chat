import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../auth.contants';
import { JwtPayload } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WebSocketJwtStrategy extends PassportStrategy(
  Strategy,
  'websocketStrategy',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('access_token'),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<boolean> {
    const user = this.usersService.findById(payload.sub);
    return !!user;
  }
}
