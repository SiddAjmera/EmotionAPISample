import { Component, OnInit, ViewChild } from '@angular/core';

import 'tracking/build/tracking';
import 'tracking/build/data/face';

import { EmotionService } from './services/emotion/emotion.service';

declare var tracking: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  videoNativeElement; canvasNativeElement; context;
  @ViewChild('userVideoStream') userVideoStream;
  @ViewChild('canvasToRenderUserImage') canvasToRenderUserImage;

  constructor(private _emotionService: EmotionService) { }

  ngOnInit() {
    this.videoNativeElement = <HTMLVideoElement>this.userVideoStream.nativeElement;
    let constraints = { 
      video: {
        width: 1280,
        height: 720
      }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
       this.videoNativeElement.srcObject = stream;
    });

    this.canvasNativeElement = <HTMLCanvasElement>this.canvasToRenderUserImage.nativeElement;
    this.context = this.canvasNativeElement.getContext('2d');

    const tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    tracking.track('#userVideoStream', tracker);

    tracker.on('track', event => {
      if (event.data.length > 0) {
        this.context.drawImage(this.videoNativeElement, 0, 0, this.canvasNativeElement.width, this.canvasNativeElement.height);
        this.videoNativeElement.srcObject.getVideoTracks().forEach(track => track.stop());
        let userImage = this.canvasNativeElement.toDataURL('image/jpeg', 1);
        this._emotionService.getUserEmotion(userImage).subscribe(emotionData => { console.log(emotionData); });
      }
    });
  }
}
