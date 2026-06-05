import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

export const CambioCostoOperativoUniqueConstraint = [
  "fechaInicio",
  "fechaFin",
  "idTipoMoneda",
  "idPais",
];

@Entity("cambio_costos_operativos")
@Unique(CambioCostoOperativoUniqueConstraint)
export class CambioCostoOperativo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "id_pais", default: 1 })
  idPais?: number;

  @Column({ name: "id_tipo_moneda", default: 5 })
  idTipoMoneda?: number;

  @CreateDateColumn({ name: "fecha_inicio" })
  fechaInicio!: Date;

  @UpdateDateColumn({ name: "fecha_fin" })
  fechaFin!: Date;

  @Column({ name: "valor_aplicable" })
  valorAplicable!: number;

  @Column({ name: "hecho_por", default: "1" })
  hechoPor?: string;

  @CreateDateColumn({ name: "fecha_registro" })
  fechaRegistro?: Date;

  @Column({ name: "modificado_por", default: "1" })
  modificadoPor?: string;

  @UpdateDateColumn({ name: "fecha_modificado" })
  fechaModificado?: Date;
}

// CREATE TABLE qualitasassistance_com_sql.dbo.cambio_costos_operativos (
// 	id int IDENTITY(1,1) NOT NULL,
// 	id_pais int NULL,
// 	fecha_inicio datetime NULL,
// 	fecha_fin datetime NULL,
// 	valor_aplicable float NULL,
// 	id_tipo_moneda int NULL,
// 	hecho_por varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
// 	fecha_registro datetime DEFAULT getdate() NULL,
// 	modificado_por varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
// 	fecha_modificado datetime NULL,
// 	CONSTRAINT PK__cambio_c__3213E83F1C8E8C4E PRIMARY KEY (id)
// );
