import { BadGatewayException, BadRequestException, Body, Controller, Get, NotFoundException, Post, Res,Req, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import {Response,Request} from 'express'
import { AuthGuard } from './auth.guard';

@Controller()
export class AuthController {

    constructor(
        
        private userService:UserService,
        private jwtService:JwtService
        ){

    }

    @Post('register')
    async register(@Body() body:RegisterDto){

        if(body.password !== body.password_confirm){
            throw new BadGatewayException('Password do not match!!')
        }


        let result = await this.userService.findOne({email: body.email})

        console.log('ressss',result)

        if(result) throw new BadGatewayException('El email se encuentra registrado')
        

        const hashed = await bcrypt.hash(body.password,12)

        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed,
            role: {id:1}
        })
    }


    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response: Response
    ) {
        const user = await this.userService.findOne({email});

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }

        const jwt = await this.jwtService.signAsync({id: user.id});

        response.cookie('jwt', jwt, {httpOnly: true});

        return user;
    }


    @UseGuards(AuthGuard)
   @UseInterceptors(ClassSerializerInterceptor)
    @Get('user')
    async user(@Req() request: Request){
        const cookie = request.cookies['jwt']

        console.log(request.cookies['jwt'])
        
     const data = await this.jwtService.verifyAsync(cookie)

    
     return this.userService.findOne({id: data['id']})

    }


    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({passthrough: true}) response: Response){
        response.clearCookie('jwt')
        return{
            message: 'success'
        }
    }
}
