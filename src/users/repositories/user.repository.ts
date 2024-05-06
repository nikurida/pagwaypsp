import { DataSource, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<Users> {
  constructor(public dataSource: DataSource) {
    super(Users, dataSource.createEntityManager());
  }
}
