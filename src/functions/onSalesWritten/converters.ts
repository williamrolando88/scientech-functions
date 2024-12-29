import { DoubleEntryAccounting } from '../../common/types/doubleEntryAccounting';
import { Sale } from '../../common/types/sale';

const documentIdentifier = ({ billingDocument }: Sale) =>
  `Factura emitida: ${billingDocument.establishment}-${billingDocument.emissionPoint}-${billingDocument.sequentialNumber}`;

export const billingDocument2DoubleEntryData = (
  sale: Sale
): Omit<DoubleEntryAccounting, 'createdAt'> => {
  const data = sale.billingDocument;

  const transactions = [
    {
      accountId: '',
      debit: 0,
      credit: 0,
    },
  ];

  const accounts = transactions.map((t) => t.accountId);

  return {
    id: sale.id,
    issueDate: data.issueDate,
    description: `${documentIdentifier(sale)}\n\n${data.description}`,
    ref: { ...data.ref, sellId: sale.id },
    transactions,
    accounts,
    locked: true,
    updatedAt: new Date(),
  };
};
