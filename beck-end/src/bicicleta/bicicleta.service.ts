import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BicicletaEntity } from './bicicleta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BicicletaDto } from './bicicleta.dto';
import { validate } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BicicletaService {
  constructor(
    @InjectRepository(BicicletaEntity)
    private bicicletaRepository: Repository<BicicletaEntity>,
  ) {}

  async findAll() {
    return this.bicicletaRepository.find();
  }

  async findById(id: string): Promise<BicicletaEntity> {
    const findOne = await this.bicicletaRepository.findOne({ where: { id } });
    if (!findOne) {
      throw new NotFoundException('Bicicleta não encontrada com o id ' + id);
    }
    return findOne;
  }

  async remove(id: string) {
    const findById = await this.findById(id);
    await this.bicicletaRepository.remove(findById);
    return { ...findById, id };
  }

  async create(dto: BicicletaDto) {
    const { nome, chassi } = dto;

    // Verificando se já existe uma bicicleta com o mesmo nome
    const existingBicicletaNome = await this.bicicletaRepository.findOne({ where: { nome } });
    if (existingBicicletaNome) {
      throw new BadRequestException(`Já existe uma bicicleta cadastrada com o nome '${nome}'`);
    }

    // Verificando se já existe uma bicicleta com o mesmo chassi
    const existingBicicletaChassi = await this.bicicletaRepository.findOne({ where: { chassi } });
    if (existingBicicletaChassi) {
      throw new BadRequestException(`Já existe uma bicicleta cadastrada com o chassi '${chassi}'`);
    }

    // Validando outras regras (como o tamanho do NTF)
    if (dto.ntf.length !== 44) {
      throw new BadRequestException('O código NTF deve ter exatamente 44 caracteres');
    }

    // Validando com class-validator
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Gerando o ID antes de salvar
    dto.id = uuidv4();

    // Criando e salvando a bicicleta no banco de dados
    const newBicicleta = this.bicicletaRepository.create(dto);
    return this.bicicletaRepository.save(newBicicleta);
  }
  

  async update(id: string, dto: BicicletaDto) {
    // Validando com class-validator
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Verificando se a bicicleta existe pelo ID
    await this.findById(id);

    // Atualizando os dados da bicicleta e salvando no banco de dados
    return this.bicicletaRepository.save({ id, ...dto });
  }

  async searchAdvanced(params: any) {
    const queryBuilder = this.bicicletaRepository.createQueryBuilder('bicicleta');

    if (params.modelo) {
      queryBuilder.andWhere('bicicleta.modelo = :modelo', { modelo: params.modelo });
    }

    if (params.cor) {
      queryBuilder.andWhere('bicicleta.cor = :cor', { cor: params.cor });
    }

    return queryBuilder.getMany();
  }
}
