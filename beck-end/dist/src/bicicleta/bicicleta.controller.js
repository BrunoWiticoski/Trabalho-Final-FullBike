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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BicicletaController = void 0;
const common_1 = require("@nestjs/common");
const bicicleta_service_1 = require("./bicicleta.service");
const bicicleta_dto_1 = require("./bicicleta.dto");
const class_validator_1 = require("class-validator");
let BicicletaController = class BicicletaController {
    constructor(bicicletaService) {
        this.bicicletaService = bicicletaService;
    }
    async findAll() {
        return this.bicicletaService.findAll();
    }
    async findById(id) {
        return this.bicicletaService.findById(id);
    }
    async remove(id) {
        return this.bicicletaService.remove(id);
    }
    async create(dto) {
        console.log('Dados recebidos no backend:', dto);
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        return this.bicicletaService.create(dto);
    }
    async update(id, dto) {
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        return this.bicicletaService.update(id, dto);
    }
};
exports.BicicletaController = BicicletaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BicicletaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BicicletaController.prototype, "findById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BicicletaController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bicicleta_dto_1.BicicletaDto]),
    __metadata("design:returntype", Promise)
], BicicletaController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bicicleta_dto_1.BicicletaDto]),
    __metadata("design:returntype", Promise)
], BicicletaController.prototype, "update", null);
exports.BicicletaController = BicicletaController = __decorate([
    (0, common_1.Controller)('bicicletas'),
    __metadata("design:paramtypes", [bicicleta_service_1.BicicletaService])
], BicicletaController);
//# sourceMappingURL=bicicleta.controller.js.map