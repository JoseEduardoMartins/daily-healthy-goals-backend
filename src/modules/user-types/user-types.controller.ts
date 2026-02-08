import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserTypesService } from './user-types.service';

@ApiTags('user-types')
@Controller('user-types')
export class UserTypesController {
  constructor(private readonly userTypesService: UserTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os tipos de usuário' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de usuário retornada com sucesso' })
  findAll() {
    return this.userTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter tipo de usuário por ID' })
  @ApiParam({ name: 'id', description: 'UUID do tipo de usuário' })
  @ApiResponse({ status: 200, description: 'Tipo de usuário retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tipo de usuário não encontrado' })
  findOne(@Param('id') id: string) {
    return this.userTypesService.findOne(id);
  }
}
