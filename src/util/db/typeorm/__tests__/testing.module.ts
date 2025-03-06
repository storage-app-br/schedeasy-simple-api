import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { API_ENTITIES } from '../typeorm.config';

type moduleProps = {
  imports?: any[];
  providers?: any[];
  controllers?: any[];
}

export const TESTING_MODULE = async ({ imports, providers, controllers }: moduleProps): Promise<TestingModule> => {
  return await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:', // Banco de dados em memória para testes
        entities: API_ENTITIES, // Entidades que você deseja usar
        synchronize: true, // Criação automática das tabelas
      }),
      TypeOrmModule.forFeature(API_ENTITIES),
      ...(imports || []),
    ],
    providers: [...(providers || [])],
    controllers: [...(controllers || [])],
  }).compile();
};