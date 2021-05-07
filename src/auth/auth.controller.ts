import {Controller, UseGuards, HttpStatus, Response, Request, Get, Post, Body, Put, Param, Delete} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/users.dto';
import { LoginUserDto } from './login.dto';
import { AuthGuard } from '@nestjs/passport';
import { MailResponse } from './interfaces/response.interface';
import { ResponseError, ResponseSuccess } from './dto/response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Response() res, @Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).json(result);
    }
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Response() res, @Body() login: LoginUserDto) {
    const user = await this.usersService.findByEmail(login.email);
    if (!user) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'User Not Found',
      });
    } else {
      //debug('start getting the token');
      const token = this.authService.createToken(user);
      //debug(token.accessToken);
      return res.status(HttpStatus.OK).json(token);
    }
  }

  @UseGuards(AuthGuard('local'))
  @Get('email-verification/:email')
  public async sendEmailVerification(@Param() params): Promise<MailResponse> {
    try {
      await this.authService.createEmailToken(params.email);
      var isEmailSent = await this.authService.sendEmailVerification(params.email);
      if(isEmailSent){
        return new ResponseSuccess("LOGIN.EMAIL_RESENT", null);
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error) {
      return new ResponseError("LOGIN.ERROR.SEND_EMAIL", error);
    }
  }


}
