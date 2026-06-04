import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("job_logs")
export class JobLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  jobName!: string;

  @Column({ nullable: true })
  status?: "started" | "completed" | "failed" | "skipped";

  @Column({ nullable: true })
  message?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
