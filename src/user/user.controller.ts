import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('api/v1')
@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Adds user
   * @param body
   */
  @Post('/add-user')
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  /**
   * Fetches User by id
   * @param id
   */
  @Get('/get-user/:id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
