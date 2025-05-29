import { body, check } from "express-validator";
import { BaseValidator } from "./BaseValidator";
import { Account } from "../models/account.model";

export class OpenAccountValidator extends BaseValidator {
  protected rules() {
    return [
      body("ownerName")
        .notEmpty()
        .withMessage("Owner name is required")
        .bail()
        .isString()
        .withMessage("Owner name must be a string"),

      body("phoneNumber")
        .notEmpty()
        .withMessage("Phone number is required")
        .bail()
        .matches(/^[0-9]{10,11}$/)
        .withMessage("Phone number must be 10 to 11 digits")
        .bail()
        .custom(async (value) => {
          const existing = await Account.findOne({
            where: { phoneNumber: value },
          });

          if (existing) {
            return Promise.reject("Phone number already in use");
          }
        }),
    ];
  }
}
export class DepositValidator extends BaseValidator {
  protected rules() {
    return [
      body("accountId")
        .isUUID(4)
        .withMessage("account id must be a valid UUID"),

      body("amount")
        .isFloat({ gt: 0 })
        .withMessage("amount must be greater than 0"),
    ];
  }
}

export class WithdrawValidator extends BaseValidator {
  protected rules() {
    return [
      body("accountId")
        .isUUID(4)
        .withMessage("account id must be a valid UUID"),

      body("amount")
        .isFloat({ gt: 0 })
        .withMessage("amount must be greater than 0"),
    ];
  }
}

export class BalanceCheckValidator extends BaseValidator {
  protected rules() {
    return [
      check("id").isUUID(4).withMessage("account id must be a valid UUID"),
    ];
  }
}
