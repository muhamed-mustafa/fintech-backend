import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  HasMany,
} from "sequelize-typescript";
import { Transaction } from "./transaction.model";

@Table({ tableName: "accounts", modelName: "Account", timestamps: true })
export class Account extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  ownerName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[0-9]{10,15}$/,
    },
  })
  phoneNumber!: string;

  @Column({ type: DataType.DECIMAL(20, 10), defaultValue: "0.0000000000" })
  balance!: string; 

  @HasMany(() => Transaction)
  transactions!: Transaction[];

  getBalance(): number {
    return parseFloat(this.balance);
  }

  setBalance(value: number) {
    this.balance = value.toFixed(10);
  }
}
