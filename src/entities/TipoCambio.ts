import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity("tipo_cambio")
@Unique(["moneda", "fechaValor"])
export class TipoCambio {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  moneda!: string;

  @Column()
  valor!: number;

  @Column({ name: "fecha_valor" })
  fechaValor!: Date;

  @CreateDateColumn({ name: "fecha_registro" })
  fechaRegistro?: Date;

  @UpdateDateColumn({ name: "fecha_modificacion", nullable: true })
  fechaModificacion?: Date = new Date();
}
