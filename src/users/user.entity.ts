import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRO } from './users.ro';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  emailToken: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean = true): UserRO {
    const { id, email } = this;
    const responseObject: UserRO = {
      id,
      email
    };

    return responseObject;
  }
}
