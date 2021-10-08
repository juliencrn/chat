import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PublicUser, UserDocument } from 'src/users/schemas/user.schema';

export type AccessToken = { accessToken: string; user: PublicUser };
export type JwtPayload = PublicUser;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<PublicUser | null> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    return this.usersService.toPublic(user as UserDocument);
  }

  async login(user: PublicUser): Promise<AccessToken> {
    const payload: JwtPayload = user;
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user };
  }

  async register(createUserDto: CreateUserDto): Promise<AccessToken> {
    // Check if the username is available
    const { username } = createUserDto;
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new BadRequestException('Username already taken');
    }

    const password = await this.hashPassword(createUserDto.password);
    const createdUser = await this.usersService.create({ username, password });
    const user = this.usersService.toPublic(createdUser);
    return await this.login(user);
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
