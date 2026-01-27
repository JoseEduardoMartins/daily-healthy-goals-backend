import { Controller, Get } from '@nestjs/common';
import { PainStatesService } from './pain-states.service';

@Controller('pain-states')
export class PainStatesController {
  constructor(private readonly painStatesService: PainStatesService) {}

  @Get()
  findAll() {
    return this.painStatesService.findAll();
  }
}
