import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	URL = "http://localhost:8000/upload";
	files: string[] = [];
	uploadForm = new FormGroup({
		name: new FormControl('', [Validators.required, Validators.minLength(3)]),
		file: new FormControl('', [Validators.required])
	});

	constructor(private httpClient: HttpClient) { }

	get f() {
		return this.uploadForm.controls;
	}

	onFileChange(event) {
		for (var i = 0; i < event.target.files.length; i++) {
			this.files.push(event.target.files[i]);
		}
	}

	submitForm() {

		const formData = new FormData();
		for (var i = 0; i < this.files.length; i++) {
			formData.append("file[]", this.files[i]);
		}

		this.httpClient.post(this.URL, formData).subscribe(res => {
			console.log(res);
			alert('Files uploaded Successfully!');
		})
	}
}