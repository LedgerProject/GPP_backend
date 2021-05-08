import { Filter } from '@loopback/repository';
import { UserTokenRepository } from '../repositories';
import { USER_BLOCK_REQUEST_TOKEN_DEFAULT_VALIDITY_IN_MINS, MINUTES_IN_MILLISECONDS } from '../constants';

/* 
  This function check if a token is expired (and remove it from db)
*/
export async function checkExpiredTokens(userTokenRepository: UserTokenRepository) {
  let resetKeys = 0;
  let deletedTokens = 0;

  // Reset the key, header, checksum and iv for expired token
  const currentDate = new Date();
  const filter: Filter = {where: {'validUntil': {lt: currentDate}, 'key': {neq: ''}}};
  const foundTokens = await userTokenRepository.find(filter);

  foundTokens.forEach(function (token) {
    token.key = '';
    token.header = '';
    token.checksum = '';
    token.iv = '';

    userTokenRepository.updateById(token.idUserToken, token);
    resetKeys++;
  });

  // Delete token expired for 24 hours
  const last24Hours = new Date(new Date().getTime() - 24 * USER_BLOCK_REQUEST_TOKEN_DEFAULT_VALIDITY_IN_MINS * MINUTES_IN_MILLISECONDS).getTime();

  const filterTokenDelete: Filter = {where: {'validUntil': {lt: last24Hours}}};
  const foundTokensDelete = await userTokenRepository.find(filterTokenDelete);

  foundTokensDelete.forEach(function (token) {
    userTokenRepository.deleteById(token.idUserToken);
    deletedTokens++;
  });

  console.log(".checkExpiredTokens gpp-cronjobs: reset", resetKeys, "keys, deleted", deletedTokens, "tokens");
}