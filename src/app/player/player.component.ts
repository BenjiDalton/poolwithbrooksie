import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
	private _ballsRemaining: any = {
		ballNumber: [],
		ballInfo: []
	};
	private _ballType: string;
	
	constructor(){}

	public set ballsRemaining(ballsArr: []) {
		this._ballsRemaining = ballsArr;
	}
	public get ballsRemaining(): any {
		return this._ballsRemaining
	}

	public set ballType(ballType: string) {
		this._ballType = ballType;
	}
	public get ballType(): string {
		return this._ballType;
	}
}
