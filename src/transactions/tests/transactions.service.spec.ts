import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/transactions.dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let repo: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            save: jest.fn().mockResolvedValue(new Transaction()),
            create: jest.fn().mockReturnValue(new Transaction()),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repo = module.get(getRepositoryToken(Transaction));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repo).toBeDefined();
  });

  it('should create a transaction', async () => {
    const dto = new CreateTransactionDto(); // Populate dto as needed
    expect(await service.create(dto)).toBeInstanceOf(Transaction);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });
});
