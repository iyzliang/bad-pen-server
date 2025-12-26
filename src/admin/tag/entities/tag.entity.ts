import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { ArticleEntity } from '@/admin/article/entities';
import { UserEntity } from '@/admin/user/entities';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, unique: true })
  name: string;

  @ManyToMany(() => ArticleEntity, (article) => article.tags)
  @JoinTable()
  articles: ArticleEntity[];

  @ManyToOne(() => UserEntity, (user) => user.tags)
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
