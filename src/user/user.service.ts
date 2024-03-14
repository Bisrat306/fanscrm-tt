import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  /**
   * Creates user
   * @param userData
   */
  async create(userData: CreateUserDto): Promise<User> {
    const user = await this.findOneByEmail(userData.email);
    if (user) {
      throw new UnauthorizedException('Email already exists');
    }
    const newUser = await this.userModel.create(userData);
    console.log({ newUser: newUser.dataValues });
    return newUser;
  }

  /**
   * Find user by id
   * @param id
   */
  async findOne(id: number) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Finds user by email
   * @param email
   */
  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
      attributes: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
    return user;
  }
}
