import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BallComponent } from './ball/ball.component';
import { PhysicsService } from './services/physics.service';
import { Bodies } from 'matter-js';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
	@ViewChild('gameArea', { read: ElementRef }) gameAreaElement: ElementRef;
	title = 'poolwithbrooksie';
	balls: any = {
		'number': [],
		'category': []
	}
		
	constructor(private physicsService: PhysicsService) {
	}

	ngAfterViewInit(): void {
		this.physicsService.renderElement = this.gameAreaElement.nativeElement;
		const ballArr = [];
		for (let i = 1; i < 16; i++) {
			const texture = '../assets/poolSprites/' + i + '.png';
			const ball = Bodies.circle(i * 30 + 300, 50 + 300, 15, { render: { sprite: { texture, xScale: 0.01067, yScale: 0.01067 }}});
			let category="solid"
			if (i - 1 > 8) {
				category="striped";
			}
			this.balls['number'].push(i - 1);
			this.balls['category'].push(category);
			this.physicsService.addBody(ball);
			
		}
		this.viewBalls()
	}

	viewBalls(): void {
		console.log(this.balls);
	}
}
