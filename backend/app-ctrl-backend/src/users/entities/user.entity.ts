import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  senha: string;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @Column({ nullable: true })
  ultimoAcesso: Date;

  @Column({ type: 'json', nullable: true, default: '{}' })
  configuracoes: Record<string, any>;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  dataAtualizacao: Date;
}