import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    jobtitle: string;

    @ApiProperty()
    department: string;

    @ApiProperty()
    location: string;

    @ApiProperty()
    age: number;

    @ApiProperty()
    salary: number;
}