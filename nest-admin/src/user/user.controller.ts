import { Body, Controller, Get,Post,UseGuards,UseInterceptors,ClassSerializerInterceptor, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcryptjs'
import { UserCreateDto } from './models/user-create.dto';
import {AuthGuard} from "../auth/auth.guard";

@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

     @Get()
       async all(): Promise<User[]> {
            return await this.userService.all()
        }

    
      @Post()
      async create(@Body() body: UserCreateDto): Promise<User>{

        const password = await  bcrypt.hash('1234',12)

        return this.userService.create({
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          password
        })
      }


      @Get(':id')
    async get(@Param('id') id: number) {
        return this.userService.findOne({id});
    }


}
