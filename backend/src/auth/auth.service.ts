import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

export type UserRequestBody = Pick<User, 'id' | 'username'>;
export type AccessToken = {
  accessToken: string;
  user: UserRequestBody;
};
export type JwtPayload = { sub: string; username: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    let user;
    try {
      user = await this.usersService.findByUsername(username);
    } catch (error) {}

    if (!user) {
      return null;
    }
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    return user;
  }

  async login({ id, username }: User): Promise<AccessToken> {
    const payload: JwtPayload = { sub: id, username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user: { id, username } };
  }

  async register(createUserDto: CreateUserDto): Promise<AccessToken> {
    // Check if the username is available
    const { username } = createUserDto;
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException('Username already taken');
    }

    const password = await this.hashPassword(createUserDto.password);
    const createdUser = await this.usersService.create({ username, password });
    return await this.login(createdUser);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
