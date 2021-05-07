import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from 'src/auth/interfaces/emailverification.interface';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUsersDto } from './create-users.dto';
import { CreateUsers } from './create-users.entity';
import { User } from './user.entity';
import { CreateUserDto } from './users.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CreateUsers)
    private createusersRepository: Repository<CreateUsers>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByEmail(userEmail: string): Promise<User | null> {
    return await this.userRepository.findOne({ email: userEmail });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOneOrFail(id);
  }

  async create(user: CreateUserDto): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(id: number,newValue: CreateUserDto,): Promise<User | null> {
    const user = await this.userRepository.findOneOrFail(id);
    if (!user.id) {
      // tslint:disable-next-line:no-console
      console.error("user doesn't exist");
    }
    await this.userRepository.update(id, newValue);
    return await this.userRepository.findOne(id);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

   /**
   * function to register the user
   * @Param CreateUserDto
   */
  async register(userDto: CreateUserDto): Promise<User> {
    const { email } = userDto;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException(
        'User already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.userRepository.create(userDto);
    return await this.userRepository.save(user);
  }

  /**
   * function to update emailtoken aganist the email
   * @Param EmailVerification
   */
  async updateEmailToken(email: string, emailToken: string ) : Promise<boolean> {
    const updatedResult = await this.userRepository.update({ email: email}, {emailToken: emailToken});
    return true;
  }
  /**
   * Function to save users 
   * @param createuserDto 
   */

  async createUsers(createuserDto: CreateUsersDto): Promise<CreateUsers> {
    const { name } = createuserDto;
    let user = await this.createusersRepository.findOne({ where: { name } });
    if (user) {
      throw new HttpException(
        'User already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.createusersRepository.create(createuserDto);
    return await this.createusersRepository.save(user);
  }

}
