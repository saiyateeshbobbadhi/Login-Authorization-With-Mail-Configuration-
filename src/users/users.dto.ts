import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly password: string;
}
