import { json } from 'express';
import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (acc: Balance, valorAtual: Transaction) => {
        if (valorAtual.type === 'income') {
          acc.income += valorAtual.value;
        } else {
          acc.outcome += valorAtual.value;
        }

        acc.total = acc.income - acc.outcome;

        return acc;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const balance = this.getBalance();

    const transaction = new Transaction({ title, value, type });

    if (type === 'outcome' && balance.total - value < 0) {
      throw Error('x');
    }

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
