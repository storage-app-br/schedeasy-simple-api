import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionService {
  private queryRunner: QueryRunner;

  constructor(private readonly dataSource: DataSource) { }

  // Inicia uma transação e mantém o queryRunner ativo para adicionar novas operações.
  async startTransaction() {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.startTransaction();
  }

  // Adiciona uma operação à transação ativa.
  async addToTransaction(operation: () => Promise<any>) {
    if (!this.queryRunner) {
      throw new Error('Transaction has not been started!');
    }
    return operation();
  }

  // Finaliza a transação com commit.
  async commitTransaction() {
    if (!this.queryRunner) {
      throw new Error('Transaction has not been started!');
    }
    await this.queryRunner.commitTransaction();
    await this.queryRunner.release();
  }

  // Finaliza a transação com rollback.
  async rollbackTransaction() {
    if (!this.queryRunner) {
      throw new Error('Transaction has not been started!');
    }
    await this.queryRunner.rollbackTransaction();
    await this.queryRunner.release();
  }
}
