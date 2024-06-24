import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MetaEntity } from './meta.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaDto } from './meta.dto';
import { BicicletaEntity } from 'src/bicicleta/bicicleta.entity';

@Injectable()
export class MetaService {
  private readonly logger = new Logger(MetaService.name);

  constructor(
    @InjectRepository(MetaEntity)
    private metaRepository: Repository<MetaEntity>,
    @InjectRepository(BicicletaEntity)
    private bicicletaRepository: Repository<BicicletaEntity>,
  ) {}

  findAll() {
    return this.metaRepository.find();
  }

  async findById(id: string): Promise<MetaEntity> {
    const findOne = await this.metaRepository.findOne({ where: { id } });
    if (!findOne) {
      this.logger.error(`Meta não encontrada com o id ${id}`);
      throw new NotFoundException('Meta não encontrado com o id ' + id);
    }
    return findOne;
  }

  async remove(id: string) {
    const findById = await this.findById(id);
    await this.metaRepository.remove(findById);
    return { ...findById, id };
  }

  async create(dto: MetaDto) {
    try {
      // Primeira regra de negócio
      if (!dto.data_corrida) {
        throw new BadRequestException('O campo "Data Corrida" é obrigatório.');
      }
  
      // Segunda regra de negócio
      if (!dto.media) {
        throw new BadRequestException('O campo "media" é obrigatório.');
      }

      // Valida se o campo Data da corrida é maior que a data atual
      if (new Date(dto.data_corrida) > new Date()) {
        throw new BadRequestException('A data da corrida não pode ser maior que a data atual.');
      } 
  
      // Salvar no banco de dados
      const novaMeta = this.metaRepository.create(dto);
      const metaSalva = await this.metaRepository.save(novaMeta);
  
      this.logger.log(`Nova meta criada com sucesso. ID: ${metaSalva.id}`);
      return metaSalva;
    } catch (error) {
      this.logger.error(`Erro ao criar nova meta: ${error.message}`);
      throw error;
    }
  }
  

  async update({ id, ...dto }: MetaDto) {
    try {
      console.log('Dados recebidos para atualização:', dto);
      await this.findById(id);
      const metaAtualizada = await this.metaRepository.save({ id, ...dto });
      this.logger.log(`Meta atualizada com sucesso. ID: ${metaAtualizada.id}`);
      return metaAtualizada;
    } catch (error) {
      this.logger.error(`Erro ao atualizar meta: ${error.message}`);
      throw error;
    }
  }

  async searchAdvanced(params: any) {
    const queryBuilder = this.metaRepository.createQueryBuilder('meta');

    if (params.data_corrida) {
      queryBuilder.andWhere('meta.data_corrida = :data_corrida', { data_corrida: params.data_corrida });
    }

    if (params.media) {
      queryBuilder.andWhere('meta.media = :media', { media: params.media });
    }

    return queryBuilder.getMany();
  }
}
