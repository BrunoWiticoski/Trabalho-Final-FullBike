import { GeneroEnum } from './genero.enum';

export interface PessoaInterface {
  id?: string;
  nome: string;
  cpf: string | null;
  data_nascimento: string;
  generos: GeneroEnum;
  telefone:number | null;
  cidade: string;
}
