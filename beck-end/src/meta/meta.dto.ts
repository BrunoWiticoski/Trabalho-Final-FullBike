import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class MetaDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  km: number;

  @IsNumber()
  tempo: number;

  @IsString()
  @IsNotEmpty()
  media: string;

  @IsDateString()
  @IsNotEmpty()
  data_corrida: string;

  @IsString()
  observacao: string;
}
