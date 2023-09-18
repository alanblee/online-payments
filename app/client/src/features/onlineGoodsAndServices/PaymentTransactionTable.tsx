import { Text } from '@mantine/core';
import { Panel, TableWithJsonDisplay } from 'components';
import type { paymentResponse } from 'generated-api-models';

export const PaymentTransactionTable = ({
  transactionData,
}: {
  transactionData: paymentResponse[];
}) => {
  const ths = (
    <tr>
      <th>Transaction ID</th>
      <th>Request ID</th>
      <th>Transaction State</th>
      <th>Amount</th>
    </tr>
  );

  const rows = transactionData.map((item, index) => (
    <tr key={index}>
      <td>{item.transactionId}</td>
      <td>{item.requestId}</td>
      <td>{item.transactionDate}</td>
      <td>{item.transactionState}</td>
      <td>{item.amount}</td>
    </tr>
  ));

  return (
    <Panel
      title="List of Payment Transactions"
      apiCallType="GET"
      apiEndpoint="/payments/{id}"
    >
      <Text>You can use this call to return a specific transaction</Text>
      <TableWithJsonDisplay
        ths={ths}
        apiEndpoint="/payments/{id}"
        json={transactionData}
        rows={rows}
      />
    </Panel>
  );
};
