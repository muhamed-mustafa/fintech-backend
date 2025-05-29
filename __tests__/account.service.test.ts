import { AccountService } from "../src/services/account.service";
import { Account } from "../src/models/account.model";
import { Transaction } from "../src/models/transaction.model";

jest.mock("../src/models/account.model");
jest.mock("../src/models/transaction.model");

const mockUUID = "123e4567-e89b-12d3-a456-426614174000";

const mockAccount = {
  id: mockUUID,
  ownerName: "Muhammed Mustafa",
  balance: 100,
  save: jest.fn(),
  getBalance: () => 100
};

describe("AccountService", () => {
  const service = new AccountService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an account", async () => {
    (Account.create as jest.Mock).mockResolvedValue(mockAccount);

    const result = await service.createAccount({ ownerName: "Muhammed Mustafa", phoneNumber: "01555733311" });
    expect(result).toBe(mockAccount);
  });

  it("should deposit funds", async () => {
    (Account.findByPk as jest.Mock).mockResolvedValue({ ...mockAccount, save: jest.fn() });
    (Transaction.create as jest.Mock).mockResolvedValue({ id: "tx-123" });

    const result = await service.deposit({ accountId: mockUUID, amount: 50 });
    expect(result.id).toBe("tx-123");
  });

  it("should not deposit to non-existing account", async () => {
    (Account.findByPk as jest.Mock).mockResolvedValue(null);
    await expect(
      service.deposit({ accountId: "non-existent-uuid", amount: 50 })
    ).rejects.toThrow("Account not found");
  });

  it("should withdraw funds", async () => {
    (Account.findByPk as jest.Mock).mockResolvedValue({ ...mockAccount, save: jest.fn() });
    (Transaction.create as jest.Mock).mockResolvedValue({ id: "tx-456" });

    const result = await service.withdraw({ accountId: mockUUID, amount: 50 });
    expect(result.id).toBe("tx-456");
  });

  it("should fail to withdraw due to insufficient balance", async () => {
    (Account.findByPk as jest.Mock).mockResolvedValue({ ...mockAccount, balance: 10 });
    await expect(
      service.withdraw({ accountId: mockUUID, amount: 50 })
    ).rejects.toThrow("Insufficient funds");
  });

  it("should get account balance", async () => {
    (Account.findByPk as jest.Mock).mockResolvedValue(mockAccount);
    const result = await service.getBalance(mockUUID);
    expect(result).toBe(100);
  });

  it("should throw when balance check account not found", async () => {
    (Account.findByPk as jest.Mock).mockResolvedValue(null);
    await expect(service.getBalance("non-existent-uuid")).rejects.toThrow("Account not found");
  });
});
