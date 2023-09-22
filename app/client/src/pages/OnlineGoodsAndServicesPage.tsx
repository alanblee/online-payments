import { Badge } from '@mantine/core';
import { PageWrapper } from 'components/PageWrapper/PageWrapper';
import { GITHUB_REPO } from 'data/constants';
import { OnlineGoodsAndServicesPanel } from 'features/onlineGoodsAndServices';

export const OnlineGoodsAndServicesPage = () => {
  return (
    <PageWrapper
      title="Online Goods and Services"
      apiEndpoint="/payments"
      githubLink={`${GITHUB_REPO}/tree/main/app/client/src/features/Payments`}
    >
      <div>
        To make a payment in Online Payments, you send a{' '}
        <Badge>POST /payments</Badge> request.
      </div>
      <OnlineGoodsAndServicesPanel />
    </PageWrapper>
  );
};