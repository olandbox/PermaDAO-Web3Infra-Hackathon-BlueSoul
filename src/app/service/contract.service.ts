import { Inject, Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import { environment } from 'src/environments/environment';
import mainABI from '../contracts/ABI.json';
import voucherABI from '../contracts/voucherABI.json';
import { AlertService } from "./alert.service";
import { WEB3 } from "./provider";
import { SucessModalComponent} from '../pages/components/sucess-modal/sucess-modal.component'
import { FailModalComponent } from '../pages/components/fail-modal/fail-modal.component';
import { HttpService } from './http.service';






@Injectable({
    providedIn: 'root'
})

export class ContractService  {
    // private SLIP = 1.3;

    web3Modal: any;
    web3js: any = null;
    provider: any = null;
    
    voucherContract: any = null;
    mainContract: any = null;
    private _mainContract$ = new BehaviorSubject<boolean>(false);
    readonly mainContract$ = this._mainContract$.asObservable();

    accounts: any;
    private _account$ = new BehaviorSubject<string>('');
    readonly account$ = this._account$.asObservable();


    chainStatus: boolean;
    private _chainStatus$ = new BehaviorSubject<boolean>(true);
    readonly chainStatus$ = this._chainStatus$.asObservable();



    constructor(
        @Inject(WEB3) private web3: any,
        private modalService: NgbModal,
        private alertService: AlertService,
        private httpService: HttpService
    ) {
        // set web3 modal
        let rpc = {};
        rpc[parseInt(environment.chainId, 16)] = environment.rpcUrl[0];
        console.log(rpc)
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    rpc: rpc
                    // infura: 'e010c4cb0ed94e74aecf0558b420daa7'
                }
            }
        }
        this.web3Modal = new Web3Modal({
            network: environment.chainName, // optional
            cacheProvider: true, // optional
            providerOptions, // required
            theme: {
                background: "rgb(39, 49, 56)",
                main: "rgb(199, 199, 199)",
                secondary: "rgb(136, 136, 136)",
                border: "rgba(195, 195, 195, 0.14)",
                hover: "rgb(16, 26, 32)"
            }
        });

        this.mainContract =  new this.web3.eth.Contract(mainABI, environment.contractAddress);
        this._mainContract$.next(true);
        this.voucherContract = new this.web3.eth.Contract(voucherABI, environment.voucherAddress);

        // this._account$.next('')
        if (this.web3Modal.cachedProvider) {
            this.initWeb();
            console.log('有account')
        }

        this.test();

    }

    async test() {
        let test = await this.mainContract.methods.priceByVoucher(601).call();
        console.log(test)
    }

    async initChainStatus() {
        const chainId = await this.web3js.eth.getChainId();
        this.chainStatus = chainId === parseInt(environment.chainId, 16);
        this._chainStatus$.next(this.chainStatus);
        if (!this.chainStatus) {
            this.alertService.create({
                body: 'Switch chain please!',
                color: 'warning',
                time: 4000
            })
        }
    }

    async account() {
        this.provider = await this.web3Modal.connect();
        this.web3js = new Web3(this.provider);
        let accounts = await this.web3js.eth.getAccounts();
        if (accounts.length) {
            return accounts[0].toLowerCase()
        } else {
            return ''
        }
    }

    async getAccount() {
        return await this.web3.eth.getAccounts();
    }
    async initAccount() {
        this.accounts = await this.web3js.eth.getAccounts();
        this._account$.next(this.accounts[0].toLowerCase() || '');
        console.log('init account')
    }
  
    async initWeb() {
        try {
            this.provider = await this.web3Modal.connect();
            this.web3js = new Web3(this.provider);
            

            this.mainContract =  new this.web3js.eth.Contract(mainABI, environment.contractAddress);
            this._mainContract$.next(true);
            this.voucherContract = new this.web3js.eth.Contract(voucherABI, environment.voucherAddress);
    
            await this.initChainStatus();
            if (this.chainStatus) {
                await this.initAccount();

            }
            this.watchProvider();
        } catch (error) {
            console.log(error)
        }

         // todo signatuer
        //  const message = 'abc';
        //  console.log('message: ' + this.web3js.utils.sha3(message))
        //  this.web3js.eth.personal.sign(this.web3js.utils.sha3(message), "0xFA22F2Bf7F3fd1C3d355456d7FE2598bD3a8Ef38".toLowerCase()).then((res) => console.log('signature: ' + res))
        
    }

    async connectAccount() {
        this.web3Modal.clearCachedProvider();
        await this.initWeb();
    }

    async disconnectAccount() {
        this.web3Modal.clearCachedProvider();
        this.accounts = null;
        this._account$.next('');
        this._chainStatus$.next(true);
        this.provider = null;
    }

    watchProvider() {
        this.provider.on("chainChanged", (chainId: string) => {
            global.window.location.reload();
        });
        this.provider.on("accountsChanged", (accounts: string[]) => {
            global.window.location.reload();
        });
        this.provider.on("connect", (info: { chainId: string }) => {
            console.log(info);
        });
        this.provider.on("disconnect", (error: { code: number; message: string }) => {
            this.disconnectAccount();
        });
    }

    async switchChain(): Promise<any> {
        // await this.initWeb();
        try {
            await this.web3js.currentProvider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: environment.chainId }],
            });
        } catch (error) {
            try {
                await this.web3js.currentProvider.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: environment.chainId,
                            chainName: environment.chainName,
                            rpcUrls: environment.rpcUrl,
                            nativeCurrency: {
                            name: "Matic",
                            symbol: "Matic",
                            decimals: 18,
                            },
                        },
                    ],
                });
            } catch (error) {
                this.alertService.create({
                    body: "switch chain failed",
                    color: 'danger',
                    time: 2000
                })
                console.log(error)
            }
        }
    }

    async hexMessage(message) {
        return this.web3js.utils.sha3(message)
    }

    async signature(hexMessage, address) {
        return this.web3js.eth.personal.sign(hexMessage, address.toLowerCase(), '', (error) => {
            if (error) {
                this.alertService.create({
                    body: error.message,
                    color: 'danger',
                    time: 5000
                })
            }
        });
    }


    //------------------ contract -----------------------------
    async getOpenseaUriByName(name: string): Promise<string> {
        try {
            let url = await this.mainContract.methods.tokenURIByName(name).call();
            console.log('url', url)
            url = url.replace(environment.metaURI, environment.oprensearURI + environment.contractAddress + '/')
            url = url.replace('/data.json', '')
            console.log('url', url)
            return url;
        } catch (error) {
            console.log('getOpenseaUriByName error', error)
        }
        return environment.oprensearURI;
    }

    getSlipPriceWei(price: string): string {
        let wPrice = Web3.utils.toWei(price, 'ether')
        let sPrice = Math.floor(parseInt(wPrice.toString()) * environment.slip).toString();
        console.log('origin price: ' + price + ', slip price: ' + sPrice)
        return sPrice;
    }
    getSlipPriceEth(price: string): string {
        let wPrice = this.getSlipPriceWei(price);
        let sPrice = Web3.utils.fromWei(wPrice).toString();
        return sPrice;
    }
    async isApproved(account: string) {
        try {
            return await this.voucherContract.methods.isApprovedForAll(account, environment.contractAddress).call();
        } catch (error) {
            console.log('get isApproved', error);
        }
    }

    async setApprove(approved: boolean) {
        try {
            return await this.voucherContract.methods.setApprovalForAll(environment.contractAddress, approved).send({from: this.accounts[0]});
        } catch (error) {
            throw(error)
        }
    }

    // return wei string
    async getGasFee() {
        const minimumGasPrice = await this.web3.eth.getGasPrice();
        console.log(minimumGasPrice * 1.5);
        return minimumGasPrice * 1.5
        // const polygon = await this.httpService.getPolygonGas();
        // if (polygon.fast && polygon.fast.maxFee) {
        //     const polygonGas = Math.ceil(polygon.fast.maxFee) + '';
        //     const polygonGasWei = this.web3js.utils.toWei(polygonGas, 'gwei');
        //     return polygonGasWei;
        // } else {
        //     return await this.web3.eth.getGasPrice() * 1.5
        // }
    }

    async mint(name: string, price: string) {

        let options = {
            from: this.accounts[0],
            gas: 960000,
            gasPrice: await this.getGasFee(),
            value: price
        }
        return this.mainContract.methods.register(name).send(options)
            .on('receipt', (receipt) => {
                let ngbModalOptions: NgbModalOptions = {
                    backdrop: 'static',
                    keyboard: false,
                    backdropClass: 'modal-mask', windowClass: 'dark', size: 'md', centered: true
                };
                this.modalService.open(
                    SucessModalComponent, 
                    ngbModalOptions
                );
            })
            .on('error', (error, receipt) => {
                if (receipt.transactionHash) {
                    const modalRef = this.modalService.open(
                        FailModalComponent, 
                        {backdropClass: 'modal-mask', windowClass: 'dark', size: 'lg', centered: true}
                    );
                    modalRef.componentInstance.tx = receipt.transactionHash;
                }
            })
    }

    async mintByCard(name: string, cardPrice: string, cardId: number) {
        
        let options = {
            from: this.accounts[0],
            gas: 960000,
            // gasPrice: await this.getGasFee(),
            value: cardPrice
        }
        return this.mainContract.methods.registerByVoucher(name, cardId).send(options)
            .on('receipt', (receipt) => {
                let ngbModalOptions: NgbModalOptions = {
                    backdrop: 'static',
                    keyboard: false,
                    backdropClass: 'modal-mask', windowClass: 'dark', size: 'md', centered: true
                };
                this.modalService.open(
                    SucessModalComponent, 
                    ngbModalOptions
                );
            })
            .on('error', (error, receipt) => {
                console.log(error)
                if (receipt.transactionHash) {
                    const modalRef = this.modalService.open(
                        FailModalComponent, 
                        {backdropClass: 'modal-mask', windowClass: 'dark', size: 'lg', centered: true}
                    );
                    modalRef.componentInstance.tx = receipt.transactionHash;
                }
            })
    }

    async isExist(name: string): Promise<boolean> {
        let isExist: boolean;
        isExist = await this.mainContract.methods.exist(name).call();
        return isExist;
    }

    async getPriceByLen(len: number) {
        try {
            let price = await this.mainContract.methods.priceByLen(len).call();
            return Web3.utils.fromWei(price);
        } catch (error) {
            console.log('get price by len error', error);
        }
    }

    async getPriceByStr(str: string) {
        try {
            let price = await this.mainContract.methods.priceByStr(str).call();
            return Web3.utils.fromWei(price);
        } catch (error) {
            console.log('get price by str error', error);
        }
    }

    async getPriceByCard(cardId: number) {
        try {
            console.log(cardId)
            let price = await this.mainContract.methods.priceByVoucher(cardId).call();
            console.log(price)
            return Web3.utils.fromWei(price);
        } catch (error) {
            console.log('get price by card error', error);
        }
    }

    async getOwner(str: string) {
        try {
            let owner = await this.mainContract.methods.ownerOfByName(str).call();
            return owner;
        } catch (error) {
            console.log('get owner error', error);
        }
    }

    async getSixClaimed(address) {
        try {
            return await this.mainContract.methods.sixClaimed(address).call();
        } catch (error) {
            console.log('getSixClaimed error', error);
        } 
    }
    async getSevenClaimed(address) {
        try {
            return await this.mainContract.methods.sevenClaimed(address).call();
        } catch (error) {
            console.log('sevenClaimed error', error);
        } 
    }
    async getEightClaimed(address) {
        try {
            return await this.mainContract.methods.eightClaimed(address).call();
        } catch (error) {
            console.log('eightClaimed error', error);
        } 
    }

    async getTotal() {
        try {
            return await this.mainContract.methods.totalSupply().call();
        } catch (error) {
            console.log('totalSupply error', error);
        } 
    }

    async convertToStandard(str: string): Promise<string> {
        try {
            return await this.mainContract.methods.convertToOlandStandard(str).call()
        } catch (error) {
            console.log('convertToOlandStandard error', error)
        }
    }

    async getLogicLength(str: string): Promise<number> {
        try {
            return await this.mainContract.methods.logicLength(str).call();
        } catch (error) {
            console.log('convertToOlandStandard error', error)
        }
    }

    async getMetadataUrl(str: string) {
        try {
            return await this.mainContract.methods.tokenURIByName(str).call()
        } catch (error) {
            console.log('tokenURIByName error', error)
        }
    }

    async getUserBalance(account: string) {
        try {
            return await this.mainContract.methods.balanceOf(account).call()
        } catch (error) {
            console.log('getUserBalance error', error)
        }
    }

    async getTokenByIndex(index: number) {
        try {
            return await this.mainContract.methods.tokenOfOwnerByIndex(this.accounts[0], index).call({from: this.accounts[0]})
        } catch (error) {
            console.log('getTokenByIndex error', error)
        }
    }

    async getTokenUri(token: string) {
        try {
            return await this.mainContract.methods.tokenURI(token).call({from: this.accounts[0]})
        } catch (error) {
            console.log('getTokenUri error', error)
        }
    }


    //----------------------voucher contract--------------------------------
    async getCards() {
        try {
            return await this.voucherContract.methods.getNFTs().call()
        } catch (error) {
            console.log('getVouchers error', error)
        }
    }
    async getCardIds(): Promise<any[]> {
        try {
            return await this.voucherContract.methods.getNftIds().call()
        } catch (error) {
            console.log('getVoucherIds error', error)
        }
    }
    async getCard(id: number) {
        try {
            return await this.voucherContract.methods.getNft(id).call()
        } catch (error) {
            console.log('getVoucherId error', error)
        }
    }
    async getBalanceOf(account: string, id: number) {
        try {
            return await this.voucherContract.methods.balanceOf(account, id).call()
        } catch (error) {
            console.log('getBalanceOf error', error)
        } 
    }
    async getBalanceOfBatch(account: string, ids: number[]) {
        const len: number = ids.length;
        const accounts: string[] = Array(len).fill(account);
        try {
            return await this.voucherContract.methods.balanceOfBatch(accounts, ids).call()
        } catch (error) {
            console.log('getBalanceOfBatch error', error)
        } 
    }
}