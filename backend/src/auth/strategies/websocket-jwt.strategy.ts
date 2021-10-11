import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

import { jwtConstants } from "../auth.contants";
import { JwtPayload } from "../auth.service";

@Injectable()
export class WebSocketJwtStrategy extends PassportStrategy(
  Strategy,
  "websocketStrategy",
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter("accessToken"),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<boolean> {
    const user = await this.usersService.findById(payload.sub);
    return !!user;
  }
}
