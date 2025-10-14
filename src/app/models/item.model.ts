export interface Item {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  createdAt?: Date;
  updatedAt?: Date;
}
