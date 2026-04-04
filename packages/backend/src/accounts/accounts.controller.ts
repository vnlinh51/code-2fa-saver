import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

interface RequestWithUser {
  user: {
    userId: string;
    email: string;
  };
}

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả tài khoản 2FA' })
  findAll(@Request() req: RequestWithUser) {
    return this.accountsService.findAll(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm tài khoản 2FA mới' })
  create(@Request() req: RequestWithUser, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(req.user.userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật tài khoản 2FA' })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa tài khoản 2FA' })
  delete(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.accountsService.delete(req.user.userId, id);
  }
}
