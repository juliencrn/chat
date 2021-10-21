import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import to from "await-to-js";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/users/schemas/user.schema";
import { UsersService } from "src/users/users.service";

export type UserRequestBody = Pick<User, "id" | "username">;
export type AccessToken = {
  accessToken: string;
};
export type JwtPayload = { sub: string; username: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const [err, user] = await to(this.usersService.findByUsername(username));
    if (!user || err) {
      return null;
    }

    const match = this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    return user;
  }

  async login({ id, username }: User): Promise<AccessToken> {
    const payload: JwtPayload = { sub: id, username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async register(createUserDto: CreateUserDto): Promise<AccessToken> {
    await this.validateIfUsernameIsAvailable(createUserDto.username);
    const password = this.hashPassword(createUserDto.password);
    const createdUser = await this.usersService.create({
      username: createUserDto.username,
      password,
    });
    return await this.login(createdUser);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private async validateIfUsernameIsAvailable(username: string): Promise<void> {
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException("Username already taken");
    }
  }
}
