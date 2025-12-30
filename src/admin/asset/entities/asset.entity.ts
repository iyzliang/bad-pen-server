import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '@/admin/user/entities';
import { ArticleEntity } from '@/admin/article/entities';

@Entity('assets')
export class AssetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string; // 图片访问地址 (通常是 CDN 或 OSS 地址)

  @Column()
  filename: string; // 原始文件名

  @Column({ nullable: true })
  mimeType: string; // 例如 image/jpeg

  @Column({ nullable: true })
  size: number; // 文件大小 (bytes)

  @ManyToOne(() => UserEntity, (user) => user.assets)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => ArticleEntity, (article) => article.cover)
  articles: ArticleEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({
    nullable: true,
    comment: '软删除时间',
  })
  deletedAt: Date | null;
}
