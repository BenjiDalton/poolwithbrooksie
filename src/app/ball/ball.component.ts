import { Component } from '@angular/core';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent {
	constructor() {}
	private _category: string | "striped" | "solid"='';
	private _number: any='';
	
	
	setCategory(value: string | "striped" | "solid") {
		this._category=value;
	}
	get category(): string {
		return this._category
	}
	
	setNumber(value: number) {
		if (value >= 1 && value <= 15) {
			this._number=value;
		  } else {
			console.log('ERROR: ', value, 'is an invalid number. Please enter a value between 1 and 15.')
		  }
	}
	get number(): string {
		return this._number
	}
	
}
