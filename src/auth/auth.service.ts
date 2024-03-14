import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.model';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers user to system
   * @param createUserDto
   */
  async register(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;
    const saltRounds = 10;

    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    return await this.userService.create({
      firstName,
      lastName,
      email,
      password: await hash(password, saltRounds),
    });
  }

  /**
   * Allows user to login
   * @param params
   */
  async login(params: LoginDto) {
    const { email, password } = params;

    // Find the user by email
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if the password is correct
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const payload = { id: user.id, email: user.email };
    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token: this.jwtService.sign(payload),
    };
  }
}
