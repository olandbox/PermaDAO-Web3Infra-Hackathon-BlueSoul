// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  chainName: 'moonbase-alphanet',
  chainId: '0x507', // 1287
  rpcUrl: ['https://rpc.api.moonbase.moonbeam.network'],

  contractAddress: '0x9eBDa263b3868970E117519903C597211A7B447B',
  voucherAddress: '0x7806E7fC775C19fd747A93AB2C7EE96dE61C6574',
  openseaVoucher: 'https://testnets.opensea.io/collection/olandbox-land-vouchers-test-v3',
  oprensearURI: 'https://testnets.opensea.io/assets/mumbai/',
  polygonscanURI: 'https://moonbase.moonscan.io/token/',
  metaURI: 'https://test.metadata.oland.info/oland/',
  microWebsite: 'https://test.moonbeam.oland.info/',

  slip: 1.1, // 滑点
  polygonGasApi: 'https://gasstation-mumbai.matic.today/v2',
  

  // chainName: 'matic',
  // chainId: '0x89', //137
  // rpcUrl: ['https://polygon-mainnet.public.blastapi.io'],
  // contractAddress: '0x8e0564F8Ec6c2f6e636cac9a719927d59cc00624',
  // voucherAddress: '0x1957A4D72BCec91Db7a296B5C11c46Ad7e467e77',
  // openseaVoucher: 'https://opensea.io/collection/olandbox-land-vouchers',
  // oprensearURI: 'https://opensea.io/assets/matic/',
  // polygonscanURI: 'https://polygonscan.com/tx/',
  // metaURI: 'https://metadata.oland.info/oland/',
  // microWebsite: 'https://www.oland.info/',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
