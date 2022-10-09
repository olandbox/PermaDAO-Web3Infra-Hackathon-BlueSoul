import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { CommunityApiService } from "./community-api.service";
import { Link } from "./community.model";


@Injectable({
    providedIn: 'root'
})
export class CommunityStoreService {
    links$ = new BehaviorSubject<Link[]>([]);

    constructor(private communityApiService: CommunityApiService) {}

    setLinks(links: Link[]) {
        this.links$.next(links);
    }

    getLinks(): Observable<Link[]> {
        return this.links$.asObservable();
    }

    addLink(link: Link) {
        this.links$.next([link, ...this.links$.value]);
    }

    replaceLink(oldLink: Link, newLink: Link) {
        const links: Link[] = this.links$.value.map((l: Link) => {
            if (l.id === oldLink.id) {
                l = newLink;
            }
            return l;
        });
        this.links$.next(links);
    }

    removeLink(link: Link) {
        const links: Link[] = this.links$.value.filter(
            (l: Link) => l.id !== link.id 
        )
        this.links$.next(links);
    }

    updateLink(link: Link) {
        const links: Link[] = this.links$.value.map((l: Link) => {
            if (l.id === link.id) {
                l.properties = link.properties;
            }
            return l;
        });
        this.links$.next(links);
    }

    swipeLinkOn(link: Link) {
        const links: Link[] = this.links$.value.map((l: Link) => {
            if (l.id === link.id) {
                l.actions.swiped = true;
            } else {
                l.actions.swiped = false;
            }
            return l;
        })
        this.links$.next(links);
    }
    swipeLinkOff() {
        const links: Link[] = this.links$.value.map((l: Link) => {
            l.actions.swiped = false;
            return l;
        });
        return links;
    }
}