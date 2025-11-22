import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Esto debe coincidir con el nombre de tu tabla en init.sql
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'password_hash' }) // Coincide con el nombre de la columna en init.sql
  passwordHash: string;
}