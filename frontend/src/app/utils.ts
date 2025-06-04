import { AlertContainerFactory, withoutCommas } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import SailsCalls, { SailsCallbacks } from '@/app/SailsCalls';

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Set value in seconds
export const sleep = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));

export const copyToClipboard = async ({
  alert,
  value,
  successfulText,
}: {
  alert?: AlertContainerFactory;
  value: string;
  successfulText?: string;
}) => {
  const onSuccess = () => {
    if (alert) {
      alert.success(successfulText || 'Copied');
    }
  };
  const onError = () => {
    if (alert) {
      alert.error('Copy error');
    }
  };

  function unsecuredCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
      onError();
    }
    document.body.removeChild(textArea);
  }

  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard
      .writeText(value)
      .then(() => onSuccess())
      .catch(() => onError());
  } else {
    unsecuredCopyToClipboard(value);
  }
};

export function prettyDate(
  input: number | Date | string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: 'long',
    timeStyle: 'short',
    hourCycle: 'h23',
  },
  locale: string = 'en-US',
) {
  const date = typeof input === 'string' ? new Date(input) : input;
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function trimEndSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const prettyAddress = (address: HexString) => {
  return address.slice(0, 6) + '...' + address.slice(-4);
};

export function toNumber(value: string) {
  return +withoutCommas(value);
}









/**
 * ## Get vouchers ids
 * Helper function to get vouchers id from an address
 * @param address Address to check vouchers id
 * @param sails sails instance 
 * @param contractId optional, contract id, if not specified, will use contract id stored in instance
 * @returns array of vouchers id asociated to address
 */
export const vouchersIdOfAddress = (sails: SailsCalls, address: HexString, contractId?: HexString): Promise<HexString[]> => {
  return new Promise(async (resolve, reject) => {
      try {
          const vouchersId = await sails.vouchersInContract(
              address,
              contractId
          )

          resolve(vouchersId);
      } catch (e) {
          reject(e);
      }
      
  });
}

/**
* ## Renew a voucher  
* Function that will renew a voucher if it is expired
* @param sails SailsCalls instance
* @param address address that is afiliated to the voucher
* @param voucherId voucher id to check
* @param amountOfBlocks new amount of block for voucher
* @param callbacks optional, callbacks to each state of action
* @returns void
*/
export const renewVoucher = (
  sails: SailsCalls, 
  address: HexString, 
  voucherId: HexString, 
  amountOfBlocks: number,
  callbacks?: SailsCallbacks
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
      try {
          const isExpired = await sails.voucherIsExpired(
              address,
              voucherId
          );

          if (isExpired) {
              await sails.renewVoucherAmountOfBlocks(
                  address,  
                  voucherId,
                  amountOfBlocks,
                  callbacks
              );
          }
          resolve();
      } catch (e) {
          reject(e);
      }
      
  });
}

/**
* ## Add tokens to an existing voucher
* the function will add tokens to the vouchers if the vouchers balance is less than specified value
* @param sails SailsCalls instance
* @param address address afiliated to the voucher
* @param voucherId voucher id
* @param numOfTokens tokens to add to the voucher
* @param minNumOfTokens min tokens that the voucher needs
* @param callback optional callbacks for each state of the function
* @returns void
*/
export const addTokensToVoucher = (
  sails: SailsCalls, 
  address: HexString,
  voucherId: HexString,
  numOfTokens: number,
  minNumOfTokens: number,
  callback?: SailsCallbacks
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
      try {
          const voucherBalance = await sails.voucherBalance(
              voucherId
          );

          if (voucherBalance < minNumOfTokens) {
              await sails.addTokensToVoucher(
                  address,
                  voucherId,
                  numOfTokens,
                  callback
              )
          }
          resolve();
      } catch (e) {
          reject(e);
      }
  });
}