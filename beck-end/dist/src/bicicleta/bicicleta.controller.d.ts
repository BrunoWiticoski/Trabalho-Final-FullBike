import { BicicletaService } from './bicicleta.service';
import { BicicletaDto } from './bicicleta.dto';
export declare class BicicletaController {
    private bicicletaService;
    constructor(bicicletaService: BicicletaService);
    findAll(): Promise<import("./bicicleta.entity").BicicletaEntity[]>;
    findById(id: string): Promise<import("./bicicleta.entity").BicicletaEntity>;
    remove(id: string): Promise<{
        id: string;
        nome: string;
        marca: string;
        modelo: string;
        medidaaro: import("./aros.enum").TamanhoArosEnum;
        chassi: string;
        cor: string;
        ntf: string;
        metas: import("../meta/meta.entity").MetaEntity[];
    }>;
    create(dto: BicicletaDto): Promise<import("./bicicleta.entity").BicicletaEntity>;
    update(id: string, dto: BicicletaDto): Promise<{
        id: string;
        nome: string;
        marca: string;
        modelo: string;
        medidaaro: import("./aros.enum").TamanhoArosEnum;
        chassi: string;
        cor: string;
        ntf: string;
    } & import("./bicicleta.entity").BicicletaEntity>;
}
