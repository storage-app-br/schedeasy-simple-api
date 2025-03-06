import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { TransactionService } from '../transactions.service';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let mockDataSource: jest.Mocked<Partial<DataSource>>;
  let mockQueryRunner: jest.Mocked<Partial<QueryRunner>>;

  beforeEach(async () => {
    // Cria o mock do QueryRunner com as funções necessárias
    mockQueryRunner = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };

    // Cria o mock do DataSource com o método createQueryRunner
    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    // Cria a instância do serviço com os mocks
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start a transaction', async () => {
    await transactionService.startTransaction();

    // Verifica se o método startTransaction do QueryRunner foi chamado
    expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
    expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
  });

  it('should add an operation to the transaction', async () => {
    const mockOperation = jest.fn().mockResolvedValue('Success');

    // Inicia a transação
    await transactionService.startTransaction();

    // Adiciona a operação
    await transactionService.addToTransaction(mockOperation);

    // Verifica se a operação foi chamada
    expect(mockOperation).toHaveBeenCalled();
  });

  it('should commit the transaction', async () => {
    await transactionService.startTransaction();
    await transactionService.commitTransaction();

    // Verifica se commitTransaction foi chamado
    expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    expect(mockQueryRunner.release).toHaveBeenCalled();
  });

  it('should throw error if transaction is not started', async () => {
    // Verifica se lança erro quando tentativa de adicionar operação sem iniciar a transação
    await expect(transactionService.addToTransaction(jest.fn())).rejects.toThrow(
      'Transaction has not been started!',
    );
  });
});
