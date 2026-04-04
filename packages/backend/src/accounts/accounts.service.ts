import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Account, AccountDocument } from './accounts.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async findAll(userId: string): Promise<AccountDocument[]> {
    return this.accountModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ name: 1 })
      .exec();
  }

  async create(
    userId: string,
    dto: CreateAccountDto,
  ): Promise<AccountDocument> {
    return this.accountModel.create({
      userId: new Types.ObjectId(userId),
      ...dto,
    });
  }

  async update(
    userId: string,
    accountId: string,
    dto: UpdateAccountDto,
  ): Promise<AccountDocument> {
    const account = await this.accountModel.findById(accountId);
    if (!account) throw new NotFoundException('Tài khoản không tồn tại');
    if (account.userId.toString() !== userId) throw new ForbiddenException();

    Object.assign(account, dto);
    return account.save();
  }

  async delete(userId: string, accountId: string): Promise<void> {
    const account = await this.accountModel.findById(accountId);
    if (!account) throw new NotFoundException('Tài khoản không tồn tại');
    if (account.userId.toString() !== userId) throw new ForbiddenException();
    await account.deleteOne();
  }
}
