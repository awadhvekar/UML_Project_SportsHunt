import { Injectable } from '@angular/core';
import { NgProgressRef } from 'ngx-progressbar';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  progressRef: NgProgressRef;
  default: string = "#0000FF";
  success: string = "#00FF00";
  error: string = "#FF0000";
  currentColor: string = this.default;
  constructor() { }

  startLoading() {
    this.currentColor = this.default;
    this.progressRef.start();
  }

  completeLoading() {
    this.progressRef.complete();
  }

  incLoading(n: number){
    this.progressRef.inc(n);
  }

  setLoading(n: number){
    this.progressRef.set(n);
  }

  setProgressBarSuccess(){
    this.currentColor = this.success;
  }

  setProgressBarFailure(){
    this.currentColor = this.error;
  }
}
