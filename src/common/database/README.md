# 数据库模块

数据库模块基于 TypeORM 和 PostgreSQL，提供了数据库连接和实体管理功能。

## 配置

在 `.env` 文件中配置数据库连接信息：

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=username
DB_PASSWORD=password
DB_DATABASE=postgres
DB_SYNC=true
DB_MIGRATIONS_RUN=true
DB_POOL_SIZE=10
DB_POOL_MIN=2
```

### 配置说明

- `DB_HOST` - 数据库主机地址（默认：localhost）
- `DB_PORT` - 数据库端口（默认：5432）
- `DB_USERNAME` - 数据库用户名（默认：postgres）
- `DB_PASSWORD` - 数据库密码
- `DB_DATABASE` - 数据库名称（默认：postgres）
- `DB_SYNC` - 是否自动同步数据库结构（生产环境应设为 false，使用迁移）
- `DB_MIGRATIONS_RUN` - 是否自动运行迁移
- `DB_POOL_SIZE` - 最大连接数（默认：10）
- `DB_POOL_MIN` - 最小连接数（默认：2）

## 使用方式

### 1. 创建实体（Entity）

在项目中创建实体文件，文件名以 `.entity.ts` 结尾：

```typescript
// src/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. 在模块中注册实体

在需要使用实体的模块中导入 `TypeOrmModule`：

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
```

### 3. 在服务中使用 Repository

在服务中注入 `Repository`：

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
```

### 4. 使用 DataSource（高级用法）

如果需要直接使用 DataSource 执行原生 SQL：

```typescript
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async customQuery() {
    return this.dataSource.query('SELECT * FROM users WHERE id = $1', ['123']);
  }
}
```

## 数据库迁移

### 生成迁移文件

```bash
# 生成迁移文件
npm run typeorm migration:generate -- -n MigrationName

# 或者手动创建迁移文件
npm run typeorm migration:create -- -n MigrationName
```

### 运行迁移

```bash
# 运行所有待执行的迁移
npm run typeorm migration:run

# 回滚最后一次迁移
npm run typeorm migration:revert
```

### 迁移文件示例

```typescript
// src/migrations/1234567890-CreateUserTable.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

## 模块特性

1. **全局模块**：使用 `@Global()` 装饰器，注册后可在任意模块中使用
2. **自动实体扫描**：自动扫描 `**/*.entity{.ts,.js}` 文件
3. **自动迁移扫描**：自动扫描 `migrations/*{.ts,.js}` 文件
4. **连接池管理**：配置了连接池参数，优化数据库连接性能
5. **日志集成**：当 `LOG_LEVEL=debug` 时，会输出 SQL 查询日志

## 注意事项

1. **生产环境**：`DB_SYNC` 应设为 `false`，使用迁移来管理数据库结构变更
2. **连接池**：根据实际负载调整 `DB_POOL_SIZE` 和 `DB_POOL_MIN`
3. **迁移**：建议在开发环境使用 `DB_MIGRATIONS_RUN=true` 自动运行迁移
4. **实体位置**：实体文件应放在项目目录中，文件名以 `.entity.ts` 结尾

