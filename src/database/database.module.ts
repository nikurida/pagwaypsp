import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'pagwaydb',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      migrations: [__dirname + 'migrations/*{.ts,.js}'],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
