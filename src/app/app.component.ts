import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BallComponent } from './ball/ball.component';
import { PhysicsService } from './services/physics.service';
import { GameStateService } from './services/game-state.service';
import { PlayerComponent } from './player/player.component';
import { Bodies, Body, Composite, Composites, IBodyDefinition } from 'matter-js';

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
	
	constructor(private physicsService: PhysicsService, private gameState: GameStateService) {
	}
	
	ngAfterViewInit(): void {
		this.physicsService.renderElement = this.gameAreaElement.nativeElement;
		this.gameState.newGame();
		this._players = this.gameState.players;
		this.fillScoreboard = true;
		
		let tableQuery = document.querySelector('.table-border');
		let pockets = tableQuery?.querySelectorAll('.pocket');
		pockets?.forEach((pocket) => {
			this.gameState.getPocketCoordinates(pocket)
		})
		console.log(this.gameState.pocketCoordinates)
		this.gameState.checkRemainingBalls()
	}

	viewScoreboard(): void {
		this._isButtonActive = !this._isButtonActive;
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

	// public newGame(): void {
	// 	const xStart = 750;
	// 	const yStart = 645;
	// 	const ballArr: Composite[] = [];
	// 	for (let i = 1; i < 6; i++) {
	// 		ballArr.push(Composites.stack(xStart - 30 * i, yStart - 15 * i, 1, i, 0, 0, this.getNextBall));
	// 	}
	// 	const cue = this.getNextBall(1400, 645);

	// 	ballArr.forEach(ballComposite => {
	// 		this.physicsService.addComposite(ballComposite);
	// 	})
	// 	this.physicsService.addBody(cue);
	// }


	// private getNextBall = (x: number, y: number): Body => {
	// 	const generatedValue = this.createBall(x, y, this.ballCount + 1);
	// 	this.ballCount++;
	// 	return generatedValue;
	// }

	// private createBall(x: number, y: number, i: number): Body {
	// 	const ballOptions: IBodyDefinition = {
	// 		frictionAir: 0.01,
	// 		render: {
	// 			sprite: {
	// 				texture: '',
	// 				xScale: 0.01067,
	// 				yScale: 0.01067
	// 			}
	// 		},
	// 		restitution: 1,
	// 		density: 1700
	// 	};
	// 	if (i < 16) {
	// 		const texture = '../assets/poolSprites/' + i + '.png';
	// 		ballOptions.render!.sprite!.texture = texture;
	// 		const ball = Bodies.circle(x, y, 15, ballOptions);
	// 		return ball;
	// 	}
	// 	delete (ballOptions.render!.sprite);
	// 	ballOptions.render!.fillStyle = 'white';
	// 	return Bodies.circle(x, y, 15, ballOptions);
	// }
}
