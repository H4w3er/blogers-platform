import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersQueryRepository } from "../infrastructure/users.query-repository";
import { UserViewDto } from "./view-dto/users.view-dto";
import { UsersService } from "../application/users.service";
import { CreateUserInputDto } from "./input-dto/users.input-dto";
import { GetUsersQueryParams } from "./input-dto/get-users-query-params.input-dto";
import { PaginatedViewDto } from "../../../core/dto/base.paginated.view-dto";
import { BasicAuthGuard } from "../guards/basic/basic-auth.guard";
import { Public } from "../guards/decorators/public.decorator";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../application/usecases/create-user.usecase";
import { DeleteUserCommand } from '../application/usecases/delete-user.usecase';

@Controller("users")
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(":id")
  async getById(@Param("id") id: string): Promise<UserViewDto> {
    return this.usersQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Public()
  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute<CreateUserCommand>(new CreateUserCommand(body));
    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param("id") id: string): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
