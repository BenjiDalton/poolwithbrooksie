import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BallComponent } from './ball/ball.component';
import { PhysicsService } from './services/physics.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
	@ViewChild('gameArea', { read: ElementRef }) gameAreaElement: ElementRef;
	title = 'poolwithbrooksie';
	balls: BallComponent[] = [];

	constructor(private physicsService: PhysicsService) {
		for (let i = 0; i < 15; i++) {
			const ball=new BallComponent();
			let category="solid"
			if (i+1 > 8) {
				category="striped";
			}
			ball.category = category;
			ball.number = i + 1;
			this.balls.push(ball);
		}
		this.viewBalls()
	}

	ngAfterViewInit(): void {
		this.physicsService.renderElement = this.gameAreaElement.nativeElement;
		// this.physicsService.addStuff();
	}

	viewBalls(): void {
		console.log(this.balls);
	}
	// if (ball.isSleeping) {
	//   ball.setStatic(true);
	// }
}
