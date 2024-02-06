import { Member } from "../../functions/shared/src";

type Account = {
  id: string;
  ownerMember: Member;
  initiatives: string[];
};

class AccountManager {
  private account: Account;

  constructor(account: Account) {
    this.account = account;
  }

  addInitiative(initiative: string) {
    // Add implementation here
  }

  getBalance(): number {
    // Add implementation here
    return this.balance;
  }
}

class AccountsManagerRepo {
  private accounts: Accounts | undefined;

  constructor(accounts: Accounts | undefined) {
    this.accounts = accounts;
  }

  addAccountManagerForInitiative(initiative: string) {
    // Add implementation here
  }

  getAccountManagerForInitiative(initiative: string) {
    // Add implementation here
  }
}
