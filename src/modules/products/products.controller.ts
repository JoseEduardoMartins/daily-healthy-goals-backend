import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar produtos (filtrados automaticamente por role/plano do token)' })
  @ApiQuery({ name: 'pain_state_id', required: false, description: 'Filtrar por estado de dor' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  async findAll(
    @Query('pain_state_id') painStateId: string | undefined,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    if (painStateId) {
      return this.productsService.findByPainStateId(painStateId, user);
    }
    return this.productsService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter produto por ID' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiResponse({ status: 200, description: 'Produto retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.productsService.findOne(id, user);
  }
}
