import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get(':id')
  getUserDetails(@Param('id') id: number) {
    return {
      type: typeof id,
      id,
    };
  }
}
