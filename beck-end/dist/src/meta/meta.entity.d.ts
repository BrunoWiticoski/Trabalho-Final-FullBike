import { BicicletaEntity } from 'src/bicicleta/bicicleta.entity';
export declare class MetaEntity {
    id: string;
    nome: string;
    km: number;
    tempo: number;
    media: string;
    data_corrida: string;
    observacao: string;
    bicicletas: BicicletaEntity[];
}
