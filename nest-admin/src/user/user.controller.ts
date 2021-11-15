import { Body, Controller, Get,Post,UseGuards,UseInterceptors,ClassSerializerInterceptor, Param, Put, Delete, Query } from '@nestjs/common';
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
       async all(@Query('page') page:number): Promise<User[]> {
            return await this.userService.paginate(page)
        }

    
      @Post()
      async create(@Body() body: UserCreateDto): Promise<User>{

        const password = await  bcrypt.hash('1234',12)



        return this.userService.create({
          first_name: body.first_name,
          last_name: body.last_name,
          email: body.email,
          password,
          role: {id: body.role_id}
        })
      }


      @Get(':id')
    async get(@Param('id') id: number) {
        return this.userService.findOne({id});
    }

    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() body: UserCreateDto
    ){

      const {role_id,...data} = body



    await this.userService.update(id,{
      ...data,
      role_id:{
        id:  role_id
      }
    })      

    return this.userService.findOne({id})

    }


    @Delete(':id')
    async delete(@Param('id') id: number){
      return this.userService.delete(id)
    }


}
