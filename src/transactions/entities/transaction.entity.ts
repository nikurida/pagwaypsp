import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  descricao: string;

  @Column('decimal', { precision: 5, scale: 2 })
  valor: number;
}
