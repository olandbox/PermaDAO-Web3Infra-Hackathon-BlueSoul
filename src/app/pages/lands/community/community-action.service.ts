import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';

import { Link } from "./community.model";
import { category } from "src/app/constants/lands";
import { DeleteDialog } from "../../components/deleteDialog/delete-dialog";
import { UploadDialog } from "../../components/upload-dialog/upload-dialog";
import { ChainDialog } from "../dialogs/chain-dialog/chain-dialog";
import { LinkDialog } from "../dialogs/link-dialog/link-dialog";
import { ShareDialog } from "../lands-footer/lands-footer.component";
import { CommunityApiService } from "./community-api.service";
import { CommunityStoreService } from "./community-store.service";


@Injectable({
    providedIn: 'root'
})
export class CommunityActionService {
    defaultTouch = { x: 0, y: 0, time: 0 };

    constructor(
        private communityStoreService: CommunityStoreService,
        private communityApiService: CommunityApiService,
        private matDialog: MatDialog,
        ) {

    }

    toIsoString(date: Date) {
        var tzo = -date.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-',
            pad = function(num) {
                return (num < 10 ? '0' : '') + num;
            };
      
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            dif + pad(Math.floor(Math.abs(tzo) / 60)) +
            ':' + pad(Math.abs(tzo) % 60);
    }

    tooltipCopy(e) {
        e.show()
        setTimeout(()=>{e.hide()}, 1000)
    }

    share(url: string) {
        this.matDialog.open(ShareDialog, {
            panelClass: 'recommend-dialog',
            width: 'calc(100vw - 30px)',
            maxWidth: '1110px',
            data: {
                url: url
            }
        })
    }

    touchStart(event) {
        const touchObj = event.changedTouches[0];
        this.defaultTouch.x = touchObj.pageX;
        this.defaultTouch.y = touchObj.pageY;
        this.defaultTouch.time = event.timeStamp; 
    }

    touchEnd(event, link: Link) {
        const touchObj = event.changedTouches[0];
        const distX = touchObj.pageX - this.defaultTouch.x;
        if (Math.abs(distX) > 10) {
          if (distX < 0) {
            // left
            this.communityStoreService.swipeLinkOn(link);
          } else {
            // right
            this.communityStoreService.swipeLinkOff();
          }
        }
    }

    focusProperty(link: Link, propertyName: string) {
        link.actions[propertyName + 'Editing'] = true;
        this.communityStoreService.updateLink(link);
    }
    blurProperty(link: Link, propertyName: string) {
        if (propertyName === category.url) {
            this.validUrl(link);
        }
        link.actions[propertyName + 'Editing'] = false;

        this.communityApiService.updateLink(link).subscribe((updateLink: Link) => {
            this.communityStoreService.replaceLink(link, updateLink)
        }) 
    }

    

    changeLinkStatus(e, link: Link) {
        const isChecked = e.currentTarget.checked ? 1 : 0;
        link.properties.status = isChecked;

        link.actions.isChanging = true;
        this.communityApiService.updateLink(link).subscribe((updateLink: Link) => {
            this.communityStoreService.replaceLink(link, updateLink);
            link.actions.isChanging = false;
        })
    }
    
    delete(link: Link) {
        const deleteDialog = this.matDialog.open(DeleteDialog, {
          panelClass: 'lands-add-dialog',
          width: 'calc(100vw - 30px)',
          maxWidth: '1110px'
        })
        deleteDialog.afterClosed().subscribe(result => {
          if (result) {
            link.actions.isChanging = true;
            this.communityApiService.deleteLink(link).subscribe(res => {
              if (res.code === 0) {
                this.communityStoreService.removeLink(link);
                link.actions.isChanging = false;
              }
            })
          }
        })
    }

    changeImage(link: Link) {
        if (link.properties.category === category.image) {
            this.upload(link);
        } else {
            let dialog;
            if (link.properties.category === category.url) {
                dialog = LinkDialog;
            } else if (link.properties.category === category.wallet || link.properties.category === category.smartContract) {
                dialog = ChainDialog
            }
            const recommendDialog = this.matDialog.open(dialog, {
                panelClass: 'recommend-dialog',
                width: 'calc(100vw - 30px)',
                maxWidth: '1110px'
            })
            recommendDialog.afterClosed().subscribe(result => {
                if (result === undefined) {
                    return;
                } else if (result === 'upload') {
                    this.upload(link);
                } else {
                    link.properties.alias = link.properties.alias ? link.properties.alias : result.type
                    link.properties.logo = result.default.logo;
                    link.properties.type = result.type;
                    link.actions.isChanging = true;

                    this.communityApiService.updateLink(link).subscribe((updateLink: Link) => {
                        this.communityStoreService.replaceLink(link, updateLink);
                        link.actions.isChanging = false
                    })
                }
        
            })
        }
    }
    upload(link: Link) {
        const uploadDialog = this.matDialog.open(UploadDialog, {
            panelClass: 'lands-add-dialog',
            width: 'calc(100vw - 30px)',
            maxWidth: '1110px'
        });
        uploadDialog.componentInstance.urlEvent.subscribe((url: string) => {
            link.properties.logo = url;
            link.actions.isChanging = true;

            this.communityApiService.updateLink(link).subscribe((updateLink: Link) => {
                this.communityStoreService.replaceLink(link, updateLink);
                link.actions.isChanging = false;
            })
        })
    }
    

    // 验证link的属性值是否符合规则, true=>hide, false=>show
    validLinkToHide(link: Link) {
        if (link.properties.category === category.text) {
            if (link.properties.alias == '' || link.properties.url == '') {
            return true;
            } else {
            return false;
            }
        }
        else if (link.properties.category === category.image) {
            if (link.properties.alias == '') {
            return true;
            } else {
            return false;
            }
        }
        else if (link.properties.category === category.wallet || link.properties.category === category.smartContract) {
            if (link.properties.alias == '' || link.properties.url == '') {
            return true;
            } else {
            return false;
            }
        } else if (link.properties.category === category.event) {
            if (link.properties.alias == '' || link.properties.url == '' || link.properties.startDate == '') {
            return true;
            } else {
            return false;
            }
        }
        else {
            let r = new RegExp('^((https|http):\/\/)')
            if (link.properties.alias == '' || link.properties.url == '' || !r.test(link.properties.url)) {
            return true;
            } else {
            return false;
            }
        }
    }

    validUrl(link: Link) {
        if (link.properties.category === category.url) {
            let r = new RegExp('^((https|http):\/\/)');
            if (!!link.properties.url && !r.test(link.properties.url)) {
                link.actions.urlValid = false;
            } else {
                link.actions.urlValid = true;
            }
        } else {
            link.actions.urlValid = true;
        }
    }
    
}