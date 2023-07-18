import { Injectable } from '@angular/core';
import { PhysicsService } from './physics.service';
import { PlayerComponent } from '../player/player.component';
import { Bodies, Body, Composite, Composites, IBodyDefinition } from 'matter-js';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/* 
Goals:
1. Scoreboard keeps track of balls each player has remaining
	1a. Little box that keeps the list of remaining balls for each player and if you hover the ball in the list, it gets highlighted on the table?
2. Balls highlight if they are the player's specific type?
3. Button to re-rack the balls after the game ends
*/

export class GameStateService {
	private ballCount = 0;
	private consecutiveShots = 0;
	private _balls: any = {
		cue: [],
		eight: [],
		solids: [],
		stripes: []
	}
	private Brooks = new PlayerComponent;
	private Ben = new PlayerComponent;
	private _players = [this.Brooks, this.Ben];
	private scratchSubscription: Subscription;
	private ballRemovedSubscription: Subscription;
	private playerChangeSubscription: Subscription;
	private currentPlayer = new PlayerComponent;
	private playerChange = new Subject<string>();
	private _gameStateMessage = new Subject<string>();
	public gameStateMessage = this._gameStateMessage.asObservable();
	
	constructor(private physicsService: PhysicsService) {
		this.Brooks.name = 'Brooks';
		this.Ben.name = 'Ben';

		this.scratchSubscription = this.physicsService.scratchSubject.subscribe(message => {
			this.sendGameStateMessage(`SCRATCH`);
			this.switchCurrentPlayer();
			this.sendGameStateMessage(`It is now ${this.currentPlayer.name}'s turn`);
		});
		this.ballRemovedSubscription = this.physicsService.ballRemoved.subscribe(removedBall => {
			if (!this.currentPlayer.ballsRemaining.ballNumber.includes(removedBall.label)) {
				this.consecutiveShots = 0;
				this.sendGameStateMessage(`Ooops. ${this.currentPlayer.name} hit the wrong ball in`);
				this.switchCurrentPlayer();
				this.sendGameStateMessage(`It is now ${this.currentPlayer.name}'s turn`);
			};
			if (removedBall.label === 8 && this.currentPlayer.ballsRemaining.ballNumber.length > 2) {
				this.sendGameStateMessage(`${this.currentPlayer.name} just hit the 8 ball in early and insta lost lmao`);
			};
			if (this.currentPlayer.ballsRemaining.ballNumber.includes(removedBall.label)) {
				this.consecutiveShots++;
				this.currentPlayer.ballsRemaining.ballInfo.pop(removedBall);
				this.currentPlayer.ballsRemaining.ballNumber.splice(this.currentPlayer.ballsRemaining.ballNumber.indexOf(removedBall.label), 1);
				if (this.consecutiveShots > 3) {
					this.sendGameStateMessage(`DAMN! ${this.currentPlayer.name} has hit ${this.consecutiveShots} in a row!`);
				};
			};
		});
		this.playerChangeSubscription = this.playerChange.subscribe((player: any) => {
			this.sendGameStateMessage(`It is ${player}'s turn to start`);
		});
	}

	public newGame(): void {
		const xStart = 750;
		const yStart = 645;
		const ballArr: Composite[] = [];
		for (let i = 1; i < 6; i++) {
			ballArr.push(Composites.stack(xStart - 30 * i, yStart - 15 * i, 1, i, 0, 0, this.getNextBall));
		}
		const cue = this.getNextBall(1400, 645);

		ballArr.forEach(ballComposite => {
			this.physicsService.addComposite(ballComposite);
		});
		this.physicsService.addBody(cue);
		this.ballCount = 0;
		this.assignPlayerBallType(this.Brooks, this._balls.solids, 'solids');
		this.assignPlayerBallType(this.Ben, this._balls.stripes, 'stripes');

		const randomPlayer = Math.floor(Math.random() * this._players.length);
		this.currentPlayer = this._players[randomPlayer];
		this.currentPlayer.turn = !this.currentPlayer.turn;
		this.playerChange.next(this.currentPlayer.name);
	}
	private switchCurrentPlayer(): void {
		for (let player of this._players) {
			player.turn = !player.turn;
			if (player.turn) {
				this.currentPlayer = player;
			};
		};
	}
	private getNextBall = (x: number, y: number): Body => {
		const generatedValue = this.createBall(x, y, this.ballCount + 1);
		this.physicsService.addTrail(generatedValue);
		this.ballCount++;
		if (this.ballCount < 8) {
			this._balls.solids.push([this.ballCount, generatedValue]);
		} else if (this.ballCount > 8 && this.ballCount < 16) {
			this._balls.stripes.push([this.ballCount, generatedValue]);
		} else if (this.ballCount === 8) {
			this._balls.solids.push([this.ballCount, generatedValue]);
			this._balls.stripes.push([this.ballCount, generatedValue]);
			this._balls.eight.push([this.ballCount, generatedValue]);
		} else if (this.ballCount === 16) {
			this._balls.cue.push([this.ballCount, generatedValue]);
		}

		return generatedValue;
	}
	private createBall(x: number, y: number, i: number): Body {
		let ballLabel: any = i;
		if (i === 16) {
			ballLabel = "cue";
		}
		const ballOptions: IBodyDefinition = {
			label: ballLabel,
			frictionAir: 0.01,
			render: {
				sprite: {
					texture: '',
					xScale: 0.01067,
					yScale: 0.01067
				}
			},
			restitution: 1,
			density: 1700
		};
		if (i < 16) {
			const texture = '../assets/poolSprites/' + i + '.png';
			ballOptions.render!.sprite!.texture = texture;
			const ball = Bodies.circle(x, y, 15, ballOptions);
			return ball;
		}
		delete (ballOptions.render!.sprite);
		ballOptions.render!.fillStyle = 'white';
		return Bodies.circle(x, y, 15, ballOptions);
	}
	private assignPlayerBallType(player: PlayerComponent, balls: any, ballType: string): void {
		balls.forEach((ball: any) => {
			player.ballsRemaining.ballNumber.push(ball[0]);
			player.ballsRemaining.ballInfo.push(ball[1]);
		})
		player.ballType = ballType;
	}
	private sendGameStateMessage(message: string): void {
		this._gameStateMessage.next(message);
	}
	public get players(): any {
		return this._players;
	}
	public get currentScore(): string {
		if (this.ballCount === 0) {
			return 'Please start a new game';
		}
		let brooksString = `Brooks has ${this.Brooks.ballsRemaining.length} ${this.Brooks.ballType} remaining`;
		let benString = `Ben has ${this.Ben.ballsRemaining.length} ${this.Ben.ballType} remaining`;
		return `${brooksString}\n${benString}`;
	}
}
