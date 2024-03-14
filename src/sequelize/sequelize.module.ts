import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { sequelizeConfig } from '../config/sequelize.config';
import { User } from 'src/user/entities/user.model';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    SequelizeModule.forFeature([User]),
  ],
})
export class SequelizeConfigModule {}
