import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BallComponent } from './ball/ball.component';
import { PhysicsService } from './services/physics.service';
import { Bodies, Body, Composite, Composites, IBodyDefinition } from 'matter-js';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
	@ViewChild('gameArea', { read: ElementRef }) gameAreaElement: ElementRef;
	title = 'poolwithbrooksie';
	balls: BallComponent[] = [];
	private ballCount = 0;

	constructor(private physicsService: PhysicsService) {
		// for (let i = 0; i < 15; i++) {
		// 	const ball=new BallComponent();
		// 	let category="solid"
		// 	if (i+1 > 8) {
		// 		category="striped";
		// 	}
		// 	ball.category = category;
		// 	ball.number = i + 1;
		// 	this.balls.push(ball);
		// }
	}

	ngAfterViewInit(): void {
		this.physicsService.renderElement = this.gameAreaElement.nativeElement;
		const xStart = 750;
		const yStart = 645;
		const ballArr: Composite[] = [];
		// const balls = Composites.pyramid(1020, 645, 11, 11, 0, 0, this.getNextBall);
		for (let i = 1; i < 6; i++) {
			ballArr.push(Composites.stack(xStart - 30 * i, yStart - 15 * i, 1, i, 0, 0, this.getNextBall));
		}
		const cue = this.getNextBall(1400, 645);
		// const balls1 = Composites.stack(xStart, yStart)
		// const balls5 = Composites.stack(1020, 645, 1, 5, 0, 0, this.getNextBall);
		// for (let i = 1; i < 16; i++) {
		// 	const texture = '../assets/poolSprites/' + i + '.png';
		// 	const ball = Bodies.circle(i * 30 + 300, 50 + 300, 15, { frictionAir: 0.02, render: { sprite: { texture, xScale: 0.01067, yScale: 0.01067 }}, restitution: 0.5 });
		// 	this.physicsService.addBody(ball);
		// 	// const ball=new BallComponent();
		// 	// let category="solid"
		// 	// if (i+1 > 8) {
		// 	// 	category="striped";
		// 	// }
		// 	// ball.category = category;
		// 	// ball.number = i + 1;
		// 	// this.balls.push(ball);
		// }
		ballArr.forEach(ballComposite => {
			this.physicsService.addComposite(ballComposite);
		})
		this.physicsService.addBody(cue);
	}

	private getNextBall = (x: number, y: number): Body => {
		const generatedValue = this.createBall(x, y, this.ballCount + 1);
		this.ballCount++;
		return generatedValue;
	}

	private createBall(x: number, y: number, i: number): Body {
		const ballOptions: IBodyDefinition = {
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
}
