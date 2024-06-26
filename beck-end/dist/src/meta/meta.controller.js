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
exports.MetaController = void 0;
const common_1 = require("@nestjs/common");
const meta_service_1 = require("./meta.service");
const meta_dto_1 = require("./meta.dto");
let MetaController = class MetaController {
    constructor(metaService) {
        this.metaService = metaService;
    }
    async findAll() {
        return this.metaService.findAll();
    }
    async findById(id) {
        return this.metaService.findById(id);
    }
    async remove(id) {
        return this.metaService.remove(id);
    }
    async create(dto) {
        return this.metaService.create(dto);
    }
    update(id, dto) {
        return this.metaService.update({ id, ...dto });
    }
};
exports.MetaController = MetaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetaController.prototype, "findById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MetaController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [meta_dto_1.MetaDto]),
    __metadata("design:returntype", Promise)
], MetaController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, meta_dto_1.MetaDto]),
    __metadata("design:returntype", void 0)
], MetaController.prototype, "update", null);
exports.MetaController = MetaController = __decorate([
    (0, common_1.Controller)('metas'),
    __metadata("design:paramtypes", [meta_service_1.MetaService])
], MetaController);
//# sourceMappingURL=meta.controller.js.map