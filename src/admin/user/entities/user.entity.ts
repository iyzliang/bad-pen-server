import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AssetEntity } from '../../asset/entities';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 50, nullable: true })
  username: string;

  @Column({ nullable: true })
  avatar: string; // 头像URL

  @Column({ nullable: true })
  bio: string; // 个人简介

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastPasswordUpdatedAt: Date;

  @OneToMany(() => AssetEntity, (asset) => asset.user)
  assets: AssetEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
