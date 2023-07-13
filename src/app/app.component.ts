import { Component } from '@angular/core';
import { BallComponent } from './ball/ball.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'poolwithbrooksie';
	balls: BallComponent[] = [];
	constructor() {
		for (let i = 0; i < 15; i++) {
			const ball=new BallComponent();
			let category="solid"
			if (i+1 > 8) {
				category="striped";
			}
			ball.setCategory(category);
			ball.setNumber(i + 1);
			this.balls.push(ball);
		}
		this.viewBalls()
	}

	viewBalls(): void {
		console.log(this.balls);
	  }
	// if (ball.isSleeping) {
	//   ball.setStatic(true);
	// }
}
