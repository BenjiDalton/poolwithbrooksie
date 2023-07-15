import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BallComponent } from './ball/ball.component';
import { PhysicsService } from './services/physics.service';
import { GameStateService } from './services/game-state.service';
import { PlayerComponent } from './player/player.component';
import { Observable, Subscription } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
	@ViewChild('gameArea', { read: ElementRef }) gameAreaElement: ElementRef;
	@ViewChild('scoreBoardButton', { read: ElementRef }) scoreBoardButton: ElementRef;
	title = 'poolwithbrooksie';
	private _isButtonActive: boolean = false;
	private _players: PlayerComponent[];
	public fillScoreboard: boolean = false;
	private scratchSubscription: Subscription;
	private ballRemovedSubscription: Subscription;
	
	constructor(private physicsService: PhysicsService, private gameState: GameStateService) {
	}
	
	ngAfterViewInit(): void {
		this.physicsService.renderElement = this.gameAreaElement.nativeElement;
		this.gameState.newGame();
		this._players = this.gameState.players;
		this.fillScoreboard = true;
		this.scratchSubscription = this.physicsService.scratchSubject.subscribe(message => {
			console.log('Received scratch notification:', message);
		});
		this.ballRemovedSubscription = this.physicsService.ballRemoved.subscribe(removedBall => {
			if (removedBall.label === 'poolBall 8') {
				const activeBalls = [];
				for (let player of this._players) {
					player.ballsRemaining.ballInfo.forEach((ball: any) => {
						activeBalls.push(ball);
					});
				};
				if (activeBalls.length > 2) {
					console.log('way to go dummy');
					// this.gameState.newGame();
				}
			};
			console.log('this ball was sunk: ', removedBall);
			for (let player of this._players) {
				player.ballsRemaining.ballInfo.forEach((ball: any) => {
					if (ball === removedBall) {
						player.ballsRemaining.ballInfo.pop(ball);
						player.ballsRemaining.ballNumber.splice(player.ballsRemaining.ballNumber.indexOf(ball.label), 1)
					}
				});
			}
			this.updateScoreboard();
		});
	}

	public viewScoreboard(): void {
		this._isButtonActive = !this._isButtonActive;
	}
	private updateScoreboard(): void {
		/*
		removes the ball number from the scoreboard if it has been sunk
		currently the remaining ball numbers just spread out when a ball is removed
		would rather the row heights stay the same to visually indicate how many balls each player has left to get
		*/

		this.fillScoreboard = false; 
		
		setTimeout(() => {
			this.fillScoreboard = true;
		}, 0);
		
	}
	public playerBallsRemaining(player: PlayerComponent): any[] {
		let specificPlayer: any | undefined = this._players.find(p => p === player);
		return specificPlayer.ballsRemaining.ballNumber
	}
	public playerBallType(player: PlayerComponent): string {
		let specificPlayer: any | undefined = this._players.find(p => p === player);
		return specificPlayer.ballType
	}
	public get players() {
		return this._players
	}
	public get isButtonActive() {
		return this._isButtonActive
	}
}
