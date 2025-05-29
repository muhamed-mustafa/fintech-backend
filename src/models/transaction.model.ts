import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Account } from "./account.model";

@Table({
  tableName: "transactions",
  modelName: "Transaction",
  timestamps: true,
})
export class Transaction extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id!: string;

  @ForeignKey(() => Account)
  @Column(DataType.UUID)
  accountId!: string;

  @Column(DataType.ENUM("deposit", "withdraw"))
  type!: "deposit" | "withdraw";

  @Column(DataType.DECIMAL(10, 2))
  amount!: number;

  @BelongsTo(() => Account)
  account!: Account;
}
