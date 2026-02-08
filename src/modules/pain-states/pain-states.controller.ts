import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PainStatesService } from './pain-states.service';

@ApiTags('pain-states')
@Controller('pain-states')
export class PainStatesController {
  constructor(private readonly painStatesService: PainStatesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os estados de dor/humor' })
  @ApiResponse({ status: 200, description: 'Lista de estados de dor retornada com sucesso' })
  findAll() {
    return this.painStatesService.findAll();
  }
}
