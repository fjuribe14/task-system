import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

export const CambioMonedaUniqueConstraint = ["idTipoMoneda", "fechaInicio"];

@Entity("cambio_moneda")
@Unique(CambioMonedaUniqueConstraint)
export class CambioMoneda {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "id_pais", default: 1 })
  idPais?: number;

  @Column({ name: "id_tipo_moneda", nullable: true, default: 5 })
  idTipoMoneda?: number;

  @CreateDateColumn({ name: "fecha_inicio" })
  fechaInicio!: Date;

  @UpdateDateColumn({ name: "fecha_fin", nullable: true })
  fechaFin?: Date;

  @Column({ name: "valor_moneda" })
  valorMoneda!: number;

  @Column({ name: "usuario", default: "1" })
  usuario?: string;

  @Column({ name: "valor_moneda_reconversion", nullable: true })
  valorMonedaReconversion?: number;
}

// TABLE qualitasassistance_com_sql.dbo.cambio_moneda (
// 	id_pais int NULL,
// 	fecha_inicio datetime NULL,
// 	fecha_fin datetime NULL,
// 	valor_moneda float NULL,
// 	id int IDENTITY(1,1) NOT NULL,
// 	usuario varchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
// 	valor_moneda_reconversion float DEFAULT NULL NULL,
// 	id_tipo_moneda int NULL,
// 	CONSTRAINT PK_cambio_moneda PRIMARY KEY (id),
// 	CONSTRAINT fk_id_tipo_moneda_cambio_moneda FOREIGN KEY (id_tipo_moneda) REFERENCES qualitasassistance_com_sql.dbo.tipo_moneda(id)
// );
