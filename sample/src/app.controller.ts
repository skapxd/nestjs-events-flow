import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsService } from './events/events.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('users')
  createUser(@Body() createUserDto: { username: string; email: string }): {
    userId: number;
  } {
    const userId = this.eventsService.createUser(
      createUserDto.username,
      createUserDto.email,
    );

    return { userId };
  }
}
