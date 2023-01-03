import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column
  email: string;

  @Column
  number: string;

  @Column
  password: string;

  @Column
  codeReset: number;

  @Column
  role: string;

  @Column({ defaultValue: false })
  valid: boolean;
}
