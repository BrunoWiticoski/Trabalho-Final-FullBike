// pessoas.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PessoasEntity } from './pessoas.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoasDto } from './pessoas.dto';
import { validate } from 'class-validator';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(PessoasEntity)
    private pessoasRepository: Repository<PessoasEntity>,
  ) {}

  findAll() {
    return this.pessoasRepository.find();
  }

  async findById(id: string): Promise<PessoasEntity> {
    const findOne = await this.pessoasRepository.findOne({ where: { id } });
    if (!findOne) {
      throw new NotFoundException('Pessoa não encontrada com o id ' + id);
    }
    return findOne;
  }

  async remove(id: string) {
    const findById = await this.findById(id);
    await this.pessoasRepository.remove(findById);
    return { ...findById, id };
  }

  async create(dto: PessoasDto) {
    dto.cpf = dto.cpf.replace(/[^\d]/g, '');
    
    // Primeira regra de negócio: Verificar se o CPF já está em uso
    const pessoaComCpfExistente = await this.pessoasRepository.findOne({ where: { cpf: dto.cpf } });
    if (pessoaComCpfExistente) {
      throw new BadRequestException('O CPF inserido já está em uso.');
    }
    
    // Segunda regra de negócio: Verificar se o nome já está em uso
    const pessoaExistente = await this.pessoasRepository.findOne({ where: { nome: dto.nome } });
    if (pessoaExistente) {
      throw new BadRequestException('O nome inserido já está em uso.');
    }
    
    // Validação usando class-validator
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const novaPessoa = this.pessoasRepository.create(dto);
    return this.pessoasRepository.save(novaPessoa);
  }

  async update({ id, ...dto }: PessoasDto) {
    if (dto.cpf) {
      dto.cpf = dto.cpf.replace(/[^\d]/g, '');
    }
    
    if (dto.telefone) {
      dto.telefone = dto.telefone.replace(/[^\d]/g, '');
    }

    // Verificar se o nome já está em uso por outra pessoa
    const pessoaExistente = await this.pessoasRepository.findOne({ where: { nome: dto.nome } });
    if (pessoaExistente && pessoaExistente.id !== id) {
      throw new BadRequestException('O nome inserido já está em uso.');
    }
    
    // Validar a data de nascimento não estar no futuro
    if (new Date(dto.data_nascimento) > new Date()) {
      throw new BadRequestException('A data de nascimento não pode ser maior que a data atual.');
    }    

    // Verificar se a pessoa com o ID especificado existe
    await this.findById(id);
    
    // Atualizar os dados da pessoa
    return this.pessoasRepository.save({ id, ...dto });
  }

  // Filtrar pessoas por nome e/ou CPF
  async searchAdvanced(params: any) {
    const queryBuilder = this.pessoasRepository.createQueryBuilder('pessoa');

    if (params.nome) {
      queryBuilder.andWhere('pessoa.nome = :nome', { nome: params.nome });
    }

    if (params.cpf) {
      queryBuilder.andWhere('pessoa.cpf = :cpf', { cpf: params.cpf });
    }

    return queryBuilder.getMany();
  }
}
