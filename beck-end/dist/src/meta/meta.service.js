"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MetaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const meta_entity_1 = require("./meta.entity");
const typeorm_2 = require("@nestjs/typeorm");
const bicicleta_entity_1 = require("../bicicleta/bicicleta.entity");
let MetaService = MetaService_1 = class MetaService {
    constructor(metaRepository, bicicletaRepository) {
        this.metaRepository = metaRepository;
        this.bicicletaRepository = bicicletaRepository;
        this.logger = new common_1.Logger(MetaService_1.name);
    }
    findAll() {
        return this.metaRepository.find();
    }
    async findById(id) {
        const findOne = await this.metaRepository.findOne({ where: { id } });
        if (!findOne) {
            this.logger.error(`Meta não encontrada com o id ${id}`);
            throw new common_1.NotFoundException('Meta não encontrado com o id ' + id);
        }
        return findOne;
    }
    async remove(id) {
        const findById = await this.findById(id);
        await this.metaRepository.remove(findById);
        return { ...findById, id };
    }
    async create(dto) {
        try {
            if (!dto.data_corrida) {
                throw new common_1.BadRequestException('O campo "Data Corrida" é obrigatório.');
            }
            if (!dto.media) {
                throw new common_1.BadRequestException('O campo "media" é obrigatório.');
            }
            if (new Date(dto.data_corrida) > new Date()) {
                throw new common_1.BadRequestException('A data da corrida não pode ser maior que a data atual.');
            }
            const novaMeta = this.metaRepository.create(dto);
            const metaSalva = await this.metaRepository.save(novaMeta);
            this.logger.log(`Nova meta criada com sucesso. ID: ${metaSalva.id}`);
            return metaSalva;
        }
        catch (error) {
            this.logger.error(`Erro ao criar nova meta: ${error.message}`);
            throw error;
        }
    }
    async update({ id, ...dto }) {
        try {
            console.log('Dados recebidos para atualização:', dto);
            await this.findById(id);
            const metaAtualizada = await this.metaRepository.save({ id, ...dto });
            this.logger.log(`Meta atualizada com sucesso. ID: ${metaAtualizada.id}`);
            return metaAtualizada;
        }
        catch (error) {
            this.logger.error(`Erro ao atualizar meta: ${error.message}`);
            throw error;
        }
    }
    async searchAdvanced(params) {
        const queryBuilder = this.metaRepository.createQueryBuilder('meta');
        if (params.data_corrida) {
            queryBuilder.andWhere('meta.data_corrida = :data_corrida', { data_corrida: params.data_corrida });
        }
        if (params.media) {
            queryBuilder.andWhere('meta.media = :media', { media: params.media });
        }
        return queryBuilder.getMany();
    }
};
exports.MetaService = MetaService;
exports.MetaService = MetaService = MetaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(meta_entity_1.MetaEntity)),
    __param(1, (0, typeorm_2.InjectRepository)(bicicleta_entity_1.BicicletaEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], MetaService);
//# sourceMappingURL=meta.service.js.map