import { TamanhoArosEnum } from './aros.enum';
import { MetaEntity } from 'src/meta/meta.entity';
export declare class BicicletaEntity {
    id: string;
    nome: string;
    marca: string;
    modelo: string;
    medidaaro: TamanhoArosEnum;
    chassi: string;
    cor: string;
    ntf: string;
    metas: MetaEntity[];
}
