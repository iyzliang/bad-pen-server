import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { UserEntity } from '@/admin/user/entities';
import { TagEntity } from '@/admin/tag/entities';
import { AssetEntity } from '@/admin/asset/entities';

export enum ArticleStatus {
  /**
   * 草稿
   */
  DRAFT = 'DRAFT',
  /**
   * 已发布
   */
  PUBLISHED = 'PUBLISHED',
  /**
   * 定时发布
   */
  SCHEDULED = 'SCHEDULED',
}

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  // 文章简介
  @Column({ type: 'varchar', nullable: true, length: 500 })
  summary: string;

  // 使用 text 类型存储 Markdown 内容
  @Column({ type: 'varchar' })
  content: string;

  // 文章封面图（关联到 Asset 实体）
  @ManyToOne(() => AssetEntity, { nullable: true, onDelete: 'SET NULL' })
  cover: AssetEntity | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: '预估阅读时间（分钟），根据字数自动计算',
  })
  readingTimeMinutes: number | null;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
  })
  status: ArticleStatus;

  // 定时发布时间或实际发布时间
  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  user: UserEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.articles, { cascade: true })
  @JoinTable()
  tags: TagEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date; // 软删除支持
}
