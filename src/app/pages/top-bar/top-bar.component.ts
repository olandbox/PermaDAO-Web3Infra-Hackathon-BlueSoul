import { Component, OnInit} from '@angular/core';
import { NavigationEnd, ActivatedRoute, Router  } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ContractService } from 'src/app/service/contract.service';
import { HttpService } from 'src/app/service/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.less'],
})
export class TopBarComponent implements OnInit {

  isMenuCollapsed = true;
  menuList = [
    { title: 'Home', link: `${environment.microWebsite}home`, navigation: false, isShow: true },
    { title: 'Mint', link: 'oland/r/mint', navigation: true, isShow: true },
    { title: 'My Land', link: 'oland/r/land', navigation: true, isShow: true },
    { title: 'Blue Soul', link: 'detail', navigation: true, isShow: true },
    { title: 'Q&A', link: `${environment.microWebsite}detail?templateId=2`, navigation: false, isShow: true },
    { title: 'About', link: `${environment.microWebsite}detail?templateId=3`, navigation: false, isShow: true },
    { title: '3D Oland', link: `http://test.unity.oland.info`, navigation: false, isShow: !environment.production},

  ]
  currentLink: string = '';
  alert: string = '';
  account: string = '';
  account$: Observable<string>;
  chainStatus$: Observable<boolean>;

  constructor(

    private router: Router,
    private contractService: ContractService,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.account$ = this.contractService.account$;
    this.chainStatus$ = this.contractService.chainStatus$;
    console.log(1)
    this.account$.subscribe(address => {
      console.log(address)
      this.account = address;
    })
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((res: NavigationEnd) => {
      this.currentLink = decodeURI(res.urlAfterRedirects).trim().replace(/\s{2,}/g, ' ').toLowerCase();
    });
  }

  collapseMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    if (this.isMenuCollapsed) {
      (document.querySelector('.bg') as HTMLElement).style.maxHeight = '';
      (document.querySelector('.bg') as HTMLElement).style.overflow = '';
    } else {
      (document.querySelector('.bg') as HTMLElement).style.maxHeight = '100vh';
      (document.querySelector('.bg') as HTMLElement).style.overflow = 'hidden';
    }
  }

  async connect(): Promise<boolean>  {
    await this.contractService.connectAccount();
    if (this.account) {
      const noncestr: any = await this.httpService.noncestr(this.account);
      const hexMessage = await this.contractService.hexMessage(noncestr.data);
      const signature = await this.contractService.signature(hexMessage, this.account);
      if (signature) {
        await this.httpService.login(this.account, signature, hexMessage, noncestr.data);
      }
      return true;
    }
    return false;
  }

  disconnect(): void {
    this.contractService.disconnectAccount().then(() => {
      localStorage.clear();
    })
  }

  switchChain(): void {
    this.contractService.switchChain()
  }

  async link(link: any): Promise<void> {
    this.isMenuCollapsed = true;
    (document.querySelector('.bg') as HTMLElement).style.maxHeight = '';
    (document.querySelector('.bg') as HTMLElement).style.overflow = '';
    if (link.navigation) {
      if (link.link === 'detail') {
        if (!this.account) {
          const isConnect = await this.connect();
          !!isConnect ? this.router.navigate([this.account + '.verify', 'edit']) : this.link(link);
        } else {
          this.router.navigate([this.account + '.verify', 'edit']);
        }
      } else {
        this.router.navigateByUrl(link.link);
      }
    } else {
      global.window.location.href = link.link;
    }
  }



}
