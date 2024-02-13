import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  selectedFile: File | undefined;
  convertedScreenplay: any;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  convertAndDisplayScreenplay() {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('https://stage.app.studiovity.com/ai/script/import', formData)
      .subscribe(response => {
        console.log("Conversion successful");
        // console.log(response);
        this.convertedScreenplay = response;
        // console.log(this.convertedScreenplay); // Assuming response is the converted screenplay
        // this.downloadScript();
      }, error => {
        console.error('Conversion failed:', error);
      });
  }

  // downloadScreenplay() {
    downloadScript(format: string) {

      console.log(this.convertedScreenplay.content);

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
        
      this.http.post('https://stage.app.studiovity.com/ai/script/export?type=' + format, {

        "title_page":this.convertedScreenplay.title_page ,
        "content":
        { 
          "ops" : [this.convertedScreenplay.content]}
      }
        
        
        , {
        headers: headers,
        responseType: 'text'
      }).subscribe((response: any) => {
        // Handle different response formats
        console.log(response);
        if (format === 'fdx' || format === 'txt') {
          this.downloadFile(response, format);
        } else {
          console.error('Unsupported format:', format);
          // Handle unsupported format error
        }
      }, (error) => {
        console.error('Error downloading script:', error);
        // Handle error
      });
    }
  
    private downloadFile(data: any, format: string) {
      // console.log(data);
      const blob = new Blob([data], { type: 'text/plain' }); // Assuming the response is plain text
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'script.' + format;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
          
}
