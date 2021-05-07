import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import configs from 'config';
import { AuthModule } from './auth/auth.module';
import { CreateUsers } from './users/create-users.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: configs.database.type,
    host: configs.database.host,
    port: configs.database.port,
    username: configs.database.username,
    password: configs.database.password,
    database: configs.database.dbName,
    entities: [
      User,
      CreateUsers
    ],
    synchronize: configs.database.sync,
    logging: true,
  }),AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
