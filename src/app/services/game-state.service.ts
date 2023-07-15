import { Injectable } from '@angular/core';
import { PhysicsService } from './physics.service';
import { PlayerComponent } from '../player/player.component';
import { Bodies, Body, Composite, Composites, IBodyDefinition } from 'matter-js';
import { Observable } from 'rxjs';

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
	private _balls: any = {
		cue: [],
		eight: [],
		solids: [],
		stripes: []
	}
	private _pocketCoordinates: any[]=[];
	private Brooks = new PlayerComponent;
	private Ben = new PlayerComponent;
	private _players = [this.Brooks, this.Ben];

	constructor(private physicsService: PhysicsService) {
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
		})
		this.physicsService.addBody(cue);
		
		this.assignPlayerBallType(this.Brooks, this._balls.solids, 'solids');
		this.assignPlayerBallType(this.Ben, this._balls.stripes, 'stripes');

	}
	private compareBallPocketCoordinates(x: number, y: number): boolean {
		const ballRadius = 15;
		return this._pocketCoordinates.some(pocket => {
			return pocket[0] - ballRadius < x < pocket[0] + ballRadius &&  pocket[1] - ballRadius < y < pocket[1] + ballRadius;
		});
	}
	// public observeBallShit(): Observable<any[]> {
	// 	return new Observable<any[]>((observer) => {
	// 	this.physicsService.ballsInPlay.subscribe(result => {
	// 		const [teamData, statNames]=result;
	// 		observer.next([teamData, statNames]);
	// 		observer.complete();
	// 	})})
	// }
	public checkRemainingBalls(): void {
		if (this._pocketCoordinates){
			for ( let player of this._players ) {
				/*
				- tried to find out how to determine which balls are still active
					-- thought to get all active balls -> determine if any balls are within the radius of any pocket -> removed from active balls if so
				*/
				this.physicsService.ballsInPlay.push(...player.ballsRemaining.ballInfo)
				player.ballsRemaining.ballInfo = player.ballsRemaining.ballInfo.filter((ball: any) => 
					this.compareBallPocketCoordinates(ball.position.x, ball.position.y)
				);

				this.physicsService.ballsInPlay.forEach((ball: any) => {
					if (!player.ballsRemaining.ballInfo.includes(ball)) {
						this.physicsService.removeBody(ball)
					}
				});
			};
		}
	}
		
	public getPocketCoordinates(pocket: Element): void {
		this._pocketCoordinates.push([pocket.getBoundingClientRect().x, pocket.getBoundingClientRect().y])
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
			this._balls.eight.push([this.ballCount, generatedValue]);
		} else if (this.ballCount === 16) {
			this._balls.cue.push([this.ballCount, generatedValue]);
		}

		return generatedValue;
	}
	private createBall(x: number, y: number, i: number): Body {
		const ballOptions: IBodyDefinition = {
			label: 'poolBall',
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
	public get players(): any {
		return this._players;
	}
	public get pocketCoordinates(): any {
		return this._pocketCoordinates
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
