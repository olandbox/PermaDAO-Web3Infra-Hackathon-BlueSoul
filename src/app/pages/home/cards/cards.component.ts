import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ContractService } from 'src/app/service/contract.service';
import { environment } from 'src/environments/environment';

import { CardStatus, Card, Cards, SearchInfo } from "../home.model";

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.less']
})
export class CardsComponent implements OnInit, OnChanges {
  @Input() searchInfo: SearchInfo;
  @Input() cardStatus: CardStatus;
  @Input() reducePrice: string;
  @Input() searchName: string;

  CardStatus = CardStatus;
  account: string = '';
  selectedCardId: string;
  cards: Card[] = [];
  cardsLoading: boolean = false;
  isLogin: boolean = true;
  isVoucher: boolean = false;


  openseaVoucher: string = environment.openseaVoucher;


  constructor(
    private contractService: ContractService,
    private router: Router,
    private activatedRoute: ActivatedRoute
   
  ) {

    this.contractService.account$.subscribe(account => {
      this.account = account;
      if (account) {

        this.getCards();
      }
    })

    this.activatedRoute.queryParams.subscribe(queryParams => {

    })
    
  }

  ngOnInit(): void {
    
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  async getCards() {
    this.cardsLoading = true;
    this.cards = [];
    const cardIds = await this.contractService.getCardIds();
    const balances = await this.contractService.getBalanceOfBatch(this.account, cardIds);
    const cards = await this.contractService.getCards();
    this.cards = cards.map((card: any, index: number) => {
      return {
        cardId: +card[0],
        name: card[1],
        length: +card[2],
        priceOff: +card[3],
        selected: +this.searchInfo.selectedCardId === +card[0],
        balance: +balances[index]
      }
    });
    this.cards = this.cards.filter(card => card.balance > 0);
    console.log(this.cards)
    this.cardsLoading = false;
  }

  get selectedCard() {
    return this.cards.find(card => card.cardId === +this.searchInfo.selectedCardId);
  }
  get optionalCard() {
    return this.cards.filter(card => card.length === this.searchInfo.logicLength);
  }


  async openVoucher() {
    if (!this.account) {
      this.isLogin = false;
      return;
    }
    if (this.cardsLoading) {return}
    this.isVoucher = true;
  }


  setCardInfoSelection(evt, card: Card) {
    if (card.length !== this.searchInfo.logicLength) {
      return;
    }
    this.cards.map(item => {
      if (item.cardId === card.cardId) {
        item.selected = evt.target.checked;
      } else {
        item.selected = false;
      }
    })
  }
  cardSelectCancel() {
    this.cards.forEach(card => card.selected = false)
    this.isVoucher = false;
    const url = this.router.url.split('?')[0];
    this.router.navigate([url], {queryParams: {s: this.searchName}});
    
  }
  cardSelectConfirm() {
    
    const card: Card = this.cards.find((card: Card) => card.selected === true)
    this.isVoucher = false;
    const url = this.router.url.split('?')[0];
    if (card && card.cardId) {
      this.router.navigate([url], {queryParams: {voucher: card.cardId, s: this.searchName}});
    } else {
      this.router.navigate([url], {queryParams: {s: this.searchName}});
    }
  }

  cancelCard(card) {
    if (card.selected && this.searchInfo.logicLength !== card.length) {
      card.selected = false;
    }
  }



}
