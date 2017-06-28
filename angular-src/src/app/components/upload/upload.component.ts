import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from '../../services/auth.service';

// var userid : any;
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})


export class UploadComponent implements OnInit {
	public uploader:FileUploader = new FileUploader({url:'/uploads'});
	userid : any;
  constructor(public authService: AuthService) {
  	
  }

  ngOnInit() {
  	this.uploader.onBeforeUploadItem = (fileItem: any) => {
		  // fileItem.withCredentials = false;
  		this.uploader.authToken = this.authService.authToken;
		};
  }

}
