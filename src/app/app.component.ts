import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedFile: File | undefined;
  convertedScreenplay: any;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  convertAndDisplayScreenplay() {
    const formData = new FormData();
    formData.append('file', this.selectedFile as Blob);
      console.log(formData);
    this.http.post<any>('https://stage.app.studiovity.com/ai/script/import', formData)
      .subscribe(response => {
        console.log("successs")
        this.convertedScreenplay = response.content.ops[0].insert;
      });
  }

  downloadScreenplay() {
    const blob = new Blob([this.convertedScreenplay], { type: 'text/plain' });
    saveAs(blob, 'screenplay.txt');
  }
}
