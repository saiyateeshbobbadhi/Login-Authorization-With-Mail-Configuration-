import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/user.entity';
import { UserRO } from 'src/users/users.ro';
import { debug } from 'console';
import { RegistrationStatus } from './interfaces/registrationStatus.interface';
import { CreateUserDto } from 'src/users/users.dto';
import { EmailVerification } from './interfaces/emailverification.interface';
import config from 'config';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(AuthService.name);
  
  /**
   * Function to register
   * @param user 
   */
  async register(user: CreateUserDto) {
    let status: RegistrationStatus = {
      success: true,
      message: 'user register',
    };
    try {
      await this.usersService.register(user);
    } catch (err) {
      status = { success: false, message: err };
    }
    return status;
  }
  createToken(user: User) {
    const expiresIn = config.expires_in;
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      'Codebrains',
      { expiresIn },
    );
    return {
      expiresIn,
      accessToken,
    };
  }
  /**
   * Function to Validate the Token
   * @param payload 
   */
  async validateUserToken(payload: JwtPayload): Promise<User> {
    return await this.usersService.findById(payload.id);
  }
  /**
   * Function to Validate the user
   * @param email 
   * @param password 
   */
  async validateUser(email: string, password: string): Promise<UserRO> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.comparePassword(password)) {
      this.logger.log('password check success');
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Function to creating a mail token
   * @param email 
   */
  async createEmailToken(email: string): Promise<boolean> {
    var emailVerification = await this.usersService.findByEmail(email); 
    if (emailVerification){
      const emailToken= (Math.floor(Math.random() * (9000000)) + 1000000).toString() //Generate 7 digits number
      const emailVerificationUpdate = await this.usersService.updateEmailToken(email,emailToken);
      return true;
      
    } else {
      return false;
    } 
  }
  /**
   * Function to Send a mail to user
   * @param email \
   */
  async sendEmailVerification(email: string): Promise<boolean> {   
    var model = await this.usersService.findByEmail(email);

    if(model && model.emailToken){
        let transporter = nodemailer.createTransport({
            host: config.mail.host,
            port: config.mail.port,
            secure: config.mail.secure,
            auth: {
                user: config.mail.user,
                pass: config.mail.pass
            }
        });
    
        let mailOptions = {
          from: '"Company" <' + config.mail.user + '>', 
          to: email,
          subject: 'Verify Email', 
          text: 'Verify Email', 
          html: 'Hi! <br><br> Please Find The Below Link to Reset Your Password<br><br>'+
          '<a href='+ config.host.url + ':' + config.host.port +'/auth/email/verify/'+ model.emailToken + '>Click here to Reset Your Password</a>'
        };
    
        var sent = await new Promise<boolean>(async function(resolve, reject) {
          return await transporter.sendMail(mailOptions, async (error, info) => {
              if (error) {      
                console.log('Message sent: %s', error);
                return reject(false);
              }
              console.log('Message sent: %s', info.messageId);
              resolve(true);
          });      
        })

        return sent;
    } else {
      return false;
    }
  }
}
