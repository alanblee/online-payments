import { rest } from 'msw';
import { API_URL } from 'data/constants';
import type { payment } from '../generated-api-models/index';
import { manipulateJsonResponse } from './utils';

const previousPayments = new Map();
export const handlers = [
  // Match create payment requests and update response to match
  rest.post(`${API_URL}/api/payments`, async (req, res, ctx) => {
    const {
      amount,
      paymentMethodType,
      merchant,
      currency,
      captureMethod,
      isAmountFinal,
      initiatorType,
    } = (await req.json()) as payment;
    const requestId = req.headers.get('request-id') as string;
    const merchantId = req.headers.get('merchant-id') as string;

    const response = manipulateJsonResponse({
      merchantId,
      merchant,
      requestId,
      amount,
      paymentMethodType,
      currency,
      captureMethod,
      isAmountFinal,
      initiatorType,
    });
    previousPayments.set(response.transactionId, response);
    return res(ctx.json(response));
  }),
  rest.get(`${API_URL}/api/payments/*`, async (req, res, ctx) => {
    const { 0: requestId } = req.params;
    console.log(requestId);
    console.log(req.params);
    console.log(previousPayments);
    const response = previousPayments.get(requestId);
    if (response) {
      return res(ctx.json(response));
    }
    return res(
      ctx.status(404),
      ctx.json({
        responseStatus: 'ERROR',
        responseCode: 'NOT_FOUND',
        responseMessage: 'Transaction was not found',
      }),
    );
  }),
];
