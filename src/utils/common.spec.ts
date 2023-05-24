import { transformOrderContract } from './app.common';
import { OrderDirectionContract } from './constant';

// test round quarter hour
test('test transformOrderContract direction sell', () => {
  const input = [
    {
      order_id: 57858,
      status: 'open',
      direction: 'sell',
      bidder_addr: 'orai1ejvyzku2upg0q5a6n9nd9cwa29a830hegc488r',
      offer_asset: {
        info: {
          native_token: {
            denom: 'orai',
          },
        },
        amount: '1000000',
      },
      ask_asset: {
        info: {
          token: {
            contract_addr: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
          },
        },
        amount: '4000000',
      },
      filled_offer_amount: '0',
      filled_ask_amount: '0',
    },
  ];
  const realResult = transformOrderContract(input, OrderDirectionContract.SELL);
  const expectResult = [['4', '1']]; // price, amount
  expect(realResult).toEqual(expectResult);
});

test('test transformOrderContract direction buy', () => {
  const input = [
    {
      order_id: 58139,
      status: 'open',
      direction: 'buy',
      bidder_addr: 'orai1krzyd6jhmvf99x09m8gs5rlj2sfeh4n62wzng9',
      offer_asset: {
        info: {
          token: {
            contract_addr: 'orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh',
          },
        },
        amount: '343800000',
      },
      ask_asset: {
        info: {
          native_token: {
            denom: 'orai',
          },
        },
        amount: '90000000',
      },
      filled_offer_amount: '0',
      filled_ask_amount: '0',
    },
  ];
  const realResult = transformOrderContract(input, OrderDirectionContract.BUY);
  const expectResult = [['3.82', '90']]; // price, amount
  expect(realResult).toEqual(expectResult);
});
