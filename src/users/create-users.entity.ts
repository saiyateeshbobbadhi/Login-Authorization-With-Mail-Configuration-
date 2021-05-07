import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class CreateUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  jobtitle: string;

  @Column()
  department: string;

  @Column()
  location: string;

  @Column()
  age: number;

  @Column()
  salary: number;
}