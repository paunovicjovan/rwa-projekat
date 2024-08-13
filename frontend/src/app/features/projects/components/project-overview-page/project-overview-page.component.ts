import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map, Subscription } from 'rxjs';

@Component({
  selector: 'app-project-overview-page',
  templateUrl: './project-overview-page.component.html',
  styleUrl: './project-overview-page.component.scss'
})
export class ProjectOverviewPageComponent implements OnInit, OnDestroy {

  routeParamsSubscription?: Subscription;
  projectId!: number;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.observeRouteChanges();   
  }

  observeRouteChanges() {
    this.routeParamsSubscription = this.activatedRoute.params
    .pipe(map((params: Params) => params['id']))
    .subscribe(id => this.projectId = id);
  }

  ngOnDestroy(): void {
    this.routeParamsSubscription?.unsubscribe();
  }

}
