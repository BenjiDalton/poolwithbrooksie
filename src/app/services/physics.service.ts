import { Injectable } from '@angular/core';
import { Bodies, Composite, Engine, Render, Runner } from 'matter-js';

@Injectable({
  providedIn: 'root'
})
export class PhysicsService {
	private engine = Engine.create();
    private renderer: Render;
    private runner = Runner.create();
	private _renderElement: HTMLCanvasElement;

	public set renderElement(element: HTMLCanvasElement) {
		this._renderElement = element;
		this.renderer = Render.create({
			engine: this.engine,
			canvas: element
		});
		this.addStuff();
		this.setupEngine();
	}

	public get renderElement(): HTMLCanvasElement {
		return this._renderElement;
	}

  	constructor() { }

	private setupEngine(): void {
		// run the renderer
		Render.run(this.renderer);

		// run the engine
		Runner.run(this.runner, this.engine);
	}

	public addStuff(): void {
		// create two boxes and a ground
		var boxA = Bodies.rectangle(400, 200, 80, 80);
		var boxB = Bodies.rectangle(450, 50, 80, 80);
		var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

		// add all of the bodies to the world
		Composite.add(this.engine.world, [boxA, boxB, ground]);
	}
}
