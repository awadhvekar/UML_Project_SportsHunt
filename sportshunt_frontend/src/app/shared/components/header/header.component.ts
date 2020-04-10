import { Component, OnInit } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';
import { ProgressBarService } from '../../services/progress-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private progress: NgProgress, public progressBar: ProgressBarService) { }

  ngOnInit(): void {
    this.progressBar.progressRef = this.progress.ref('progressBar');
  }

}
