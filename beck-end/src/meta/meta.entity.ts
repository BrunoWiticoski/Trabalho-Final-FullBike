import { IsNumber } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BicicletaEntity } from 'src/bicicleta/bicicleta.entity';

@Entity({ name: 'metas' })
export class MetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column() 
  @IsNumber() 
  km: number;
  
  @Column() 
  @IsNumber()
  tempo: number;
  
  @Column({ length: 20 })
  media: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  data_corrida: string;

  @Column({ length: 50 })
  observacao: string;

  @ManyToMany(() => BicicletaEntity, bicicleta => bicicleta.metas)
  @JoinTable({
    name: 'bicicletas_metas',
    joinColumn: { name: 'meta_id' },
    inverseJoinColumn: { name: 'bicicleta_id' },
  })
  bicicletas: BicicletaEntity[];
}

