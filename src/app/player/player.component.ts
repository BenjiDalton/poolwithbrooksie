import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
	private _name: string; 
	private _turn: boolean = false;
	private _wins: number = 0;
	private _ballsRemaining: any = {
		ballNumber: [],
		ballInfo: []
	};
	private _ballType: string;

	
	constructor(){}
	public set name(name: string) {
		this._name = name;
	}
	public get name(): string {
		return this._name
	}

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

	public set turn(turn: boolean) {
		this._turn = turn;
	}
	public get turn(): boolean {
		return this._turn
	}

	public set wins(wins: number) {
		this._wins = wins;
	}
	public get wins(): number {
		return this._wins
	}
}
