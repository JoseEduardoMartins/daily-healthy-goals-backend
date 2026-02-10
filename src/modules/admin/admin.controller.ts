import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ==================== MÉTRICAS ====================

  @Get('metrics')
  @ApiOperation({ summary: 'Obter métricas gerais da aplicação' })
  @ApiResponse({ status: 200, description: 'Métricas retornadas com sucesso' })
  async getMetrics() {
    return await this.adminService.getMetrics();
  }

  // ==================== CRUD USUÁRIOS ====================

  @Get('users')
  @ApiOperation({ summary: 'Listar todos os usuários (não deletados por padrão)' })
  @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean, description: 'Incluir usuários deletados' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  async findAllUsers(@Query('includeDeleted') includeDeleted?: string) {
    const include = includeDeleted === 'true';
    return await this.adminService.findAllUsers(include);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findUserById(@Param('id') id: string) {
    return await this.adminService.findUserById(id);
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.adminService.createUser(createUserDto);
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async deleteUser(@Param('id') id: string) {
    return await this.adminService.deleteUser(id);
  }

  // ==================== CRUD PRODUTOS ====================

  @Get('products')
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  async findAllProducts() {
    return await this.adminService.findAllProducts();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Obter produto por ID' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async findProductById(@Param('id') id: string) {
    return await this.adminService.findProductById(id);
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return await this.adminService.createProduct(createProductDto);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.adminService.updateProduct(id, updateProductDto);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover produto' })
  @ApiParam({ name: 'id', description: 'ID do produto' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async deleteProduct(@Param('id') id: string) {
    return await this.adminService.deleteProduct(id);
  }

  // ==================== CRUD EXERCÍCIOS ====================

  @Get('exercises')
  @ApiOperation({ summary: 'Listar todos os exercícios' })
  @ApiResponse({ status: 200, description: 'Lista de exercícios retornada com sucesso' })
  async findAllExercises() {
    return await this.adminService.findAllExercises();
  }

  @Get('exercises/:id')
  @ApiOperation({ summary: 'Obter exercício por ID' })
  @ApiParam({ name: 'id', description: 'ID do exercício' })
  @ApiResponse({ status: 200, description: 'Exercício retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Exercício não encontrado' })
  async findExerciseById(@Param('id') id: string) {
    return await this.adminService.findExerciseById(id);
  }

  @Post('exercises')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo exercício' })
  @ApiResponse({ status: 201, description: 'Exercício criado com sucesso' })
  async createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    return await this.adminService.createExercise(createExerciseDto);
  }

  @Put('exercises/:id')
  @ApiOperation({ summary: 'Atualizar exercício' })
  @ApiParam({ name: 'id', description: 'ID do exercício' })
  @ApiResponse({ status: 200, description: 'Exercício atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Exercício não encontrado' })
  async updateExercise(@Param('id') id: string, @Body() updateExerciseDto: UpdateExerciseDto) {
    return await this.adminService.updateExercise(id, updateExerciseDto);
  }

  @Delete('exercises/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover exercício' })
  @ApiParam({ name: 'id', description: 'ID do exercício' })
  @ApiResponse({ status: 200, description: 'Exercício removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Exercício não encontrado' })
  async deleteExercise(@Param('id') id: string) {
    return await this.adminService.deleteExercise(id);
  }

  // ==================== CRUD PLANOS ====================

  @Get('plans')
  @ApiOperation({ summary: 'Listar todos os planos' })
  @ApiResponse({ status: 200, description: 'Lista de planos retornada com sucesso' })
  async findAllPlans() {
    return await this.adminService.findAllPlans();
  }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Obter plano por ID' })
  @ApiParam({ name: 'id', description: 'ID do plano' })
  @ApiResponse({ status: 200, description: 'Plano retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  async findPlanById(@Param('id') id: string) {
    return await this.adminService.findPlanById(id);
  }

  @Post('plans')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo plano' })
  @ApiResponse({ status: 201, description: 'Plano criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Já existe um plano com este nome' })
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    return await this.adminService.createPlan(createPlanDto);
  }

  @Put('plans/:id')
  @ApiOperation({ summary: 'Atualizar plano' })
  @ApiParam({ name: 'id', description: 'ID do plano' })
  @ApiResponse({ status: 200, description: 'Plano atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  async updatePlan(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return await this.adminService.updatePlan(id, updatePlanDto);
  }

  @Delete('plans/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover plano' })
  @ApiParam({ name: 'id', description: 'ID do plano' })
  @ApiResponse({ status: 200, description: 'Plano removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiResponse({ status: 400, description: 'Não é possível remover plano com usuários associados' })
  async deletePlan(@Param('id') id: string) {
    return await this.adminService.deletePlan(id);
  }
}
