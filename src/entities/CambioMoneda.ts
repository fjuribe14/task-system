import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity("cambio_moneda")
@Unique(["idTipoMoneda", "fechaInicio"])
export class CambioMoneda {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "id_pais" })
  idPais?: number = 1;

  @Column({ name: "id_tipo_moneda" })
  idTipoMoneda?: number = 5;

  @CreateDateColumn({ name: "fecha_inicio" })
  fechaInicio?: Date = new Date();

  @UpdateDateColumn({ name: "fecha_fin" })
  fechaFin?: Date = new Date();

  @Column({ name: "valor_moneda" })
  valorMoneda!: number;

  @Column({ name: "usuario" })
  usuario?: string = "1";

  @Column({ name: "valor_moneda_reconversion" })
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
