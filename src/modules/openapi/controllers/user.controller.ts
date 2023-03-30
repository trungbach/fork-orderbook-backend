import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService, UserService } from '../services';

@ApiTags('Users')
@Controller('v1/users')
export class UserController {
  constructor() {
    // inject dependencies
  }
}
