import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiHeader } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { UsersService } from '../users/users.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos (filtrados por tipo/plano do usuário)' })
  @ApiQuery({ name: 'pain_state_id', required: false, description: 'Filtrar por estado de dor' })
  @ApiHeader({ name: 'user-id', required: false, description: 'ID do usuário (opcional)' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  async findAll(
    @Query('pain_state_id') painStateId?: string,
    @Request() req?: any,
  ) {
    const user = await this.getUserFromRequest(req);
    
    if (painStateId) {
      return this.productsService.findByPainStateId(painStateId, user);
    }
    return this.productsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter produto por ID' })
  @ApiParam({ name: 'id', description: 'UUID do produto' })
  @ApiHeader({ name: 'user-id', required: false, description: 'ID do usuário (opcional)' })
  @ApiResponse({ status: 200, description: 'Produto retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findOne(@Param('id') id: string, @Request() req?: any) {
    const user = await this.getUserFromRequest(req);
    return this.productsService.findOne(id, user);
  }

  private async getUserFromRequest(req: any) {
    if (!req) return undefined;
    
    const userId = req.headers['user-id'] || req.user?.id;
    if (!userId) return undefined;

    try {
      return await this.usersService.findOne(userId);
    } catch {
      return undefined;
    }
  }
}
