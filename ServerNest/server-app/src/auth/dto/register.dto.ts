import { IsEmail, IsNotEmpty, IsString } from "class-validator"


export class RegisterDto{
    @IsNotEmpty()
    @IsString()
    name: string


    //@IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

}