import { Button, SimpleGrid, Text } from '@mantine/core';
import { useQueries } from '@tanstack/react-query';
import { JsonModal, Panel, TableWithJsonDisplay } from 'components';
import { useGetPayment } from './hooks/useGetPayment';
import { paymentAuthorizeResponseListMock } from 'mocks/paymentAuthorizeResponseList.mock';
import { paymentResponse } from 'generated-api-models';
import { useState } from 'react';
import { IconEye } from '@tabler/icons';
import { transactionManagementType } from 'shared.types';

export const PaymentTransactionTable = ({
  transactionIds,
}: transactionManagementType) => {
  const initialTransactions: paymentResponse[] =
    paymentAuthorizeResponseListMock;

  const [modalOpen, setModalState] = useState<boolean>(false);
  const [modalValue, setModalValue] = useState({});

  const transactions = useQueries({
    queries: transactionIds.map((id) => {
      return {
        queryKey: ['payments', id],
        queryFn: () => useGetPayment(id),
      };
    }),
  });

  const isLoading = transactions.some((query) => query.isLoading);

  const handleModalOpen = (rowData: paymentResponse) => {
    setModalValue(rowData);
    setModalState(true);
  };

  const displayPaymentActions = () => {
    return (
      <SimpleGrid cols={3}>
        <Button compact>Capture</Button>
        <Button compact>Void</Button>
        <Button compact>Refund</Button>
      </SimpleGrid>
    );
  };
  const createRow = (rowData: paymentResponse) => (
    <tr key={rowData.transactionId}>
      <td>
        <Button
          onClick={() => handleModalOpen(rowData)}
          compact
          variant="default"
        >
          <IconEye size={16} />
        </Button>
      </td>
      <td>{rowData.transactionId}</td>
      <td>{rowData.requestId}</td>
      <td>{rowData.transactionDate}</td>
      <td>{rowData.transactionState}</td>
      <td>{rowData.amount}</td>
      <td>{displayPaymentActions()}</td>
    </tr>
  );

  const rows = initialTransactions.map((transaction) => createRow(transaction));

  if (!isLoading) {
    transactions.map(({ data }) => {
      data && rows.unshift(createRow(data));
    });
  }

  const ths = (
    <tr>
      <th></th>
      <th>Transaction ID</th>
      <th>Request ID</th>
      <th>Transaction Date</th>
      <th>Transaction State</th>
      <th>Amount</th>
      <th>Actions</th>
    </tr>
  );

  return (
    <Panel
      title="List of Payment Transactions"
      apiCallType="GET"
      apiEndpoint="/payments/{id}"
    >
      <Text>You can use this call to return a specific transaction</Text>
      <JsonModal
        json={modalValue}
        modalOpen={modalOpen}
        setModalState={setModalState}
        apiEndpoint={`/payments/{id}`}
      />
      <TableWithJsonDisplay ths={ths} rows={rows} />
    </Panel>
  );
};
