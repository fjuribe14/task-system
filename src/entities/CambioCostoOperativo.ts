import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity("cambio_costos_operativos")
@Unique(["idTipoMoneda", "fechaInicio"])
export class CambioCostoOperativo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "id_pais" })
  idPais?: number = 1;

  @Column({ name: "id_tipo_moneda" })
  idTipoMoneda?: number = 5;

  @CreateDateColumn({ name: "fecha_inicio" })
  fechaInicio!: Date;

  @UpdateDateColumn({ name: "fecha_fin" })
  fechaFin!: Date;

  @Column({ name: "valor_aplicable" })
  valorAplicable!: number;

  @Column({ name: "hecho_por" })
  hechoPor?: string = "1";

  @CreateDateColumn({ name: "fecha_registro" })
  fechaRegistro?: Date = new Date();

  @Column({ name: "modificado_por" })
  modificadoPor?: string = "1";

  @UpdateDateColumn({ name: "fecha_modificado" })
  fechaModificado?: Date = new Date();
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
