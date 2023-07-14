import { Injectable } from '@angular/core';
import { Bodies, Body, Composite, Engine, Mouse, MouseConstraint, Render, Runner } from 'matter-js';

@Injectable({
  providedIn: 'root'
})
export class PhysicsService {
	private engine = Engine.create({
		velocityIterations: 16,
		positionIterations: 24
	});
    private renderer: Render;
    private runner = Runner.create({
		delta: 144
	});
	private mouse: Mouse;
	private width = 2040;
	private height = 1290;
	private borderWidth = 300;
	private _renderElement: HTMLCanvasElement;

	public set renderElement(element: HTMLCanvasElement) {
		this._renderElement = element;
		this.renderer = Render.create({
			engine: this.engine,
			canvas: element,
			options: {
				height: this.height,
				width: this.width,
				wireframes: false,
				showPerformance: true
			}
		});
		this.mouse = Mouse.create(element);
		this.setupMouseConstraint();
		this.renderer.mouse = this.mouse;
		this.addStuff();
		this.setupEngine();
	}

	public get renderElement(): HTMLCanvasElement {
		return this._renderElement;
	}

  	constructor() { }

	private setupEngine(): void {
		this.engine.gravity.y = 0;
		Render.run(this.renderer);
		Runner.run(this.runner, this.engine);
	}

	public addStuff(): void {
		const borderOptions: Matter.IChamferableBodyDefinition = {
			isStatic: true,
			render: { fillStyle: 'transparent' },
			restitution: 1
		};
		var topBorder = Bodies.rectangle(this.width / 2, this.borderWidth / 2, this.width, this.borderWidth, borderOptions);
		var rightBorder = Bodies.rectangle(this.width - (this.borderWidth / 2), this.height / 2, this.borderWidth, this.height, borderOptions);
		var bottomBorder = Bodies.rectangle(this.width / 2, this.height - (this.borderWidth / 2), this.width, this.borderWidth, borderOptions);
		var leftBorder = Bodies.rectangle(this.borderWidth / 2, this.height / 2, this.borderWidth, this.height, borderOptions);

		// add all of the bodies to the world
		Composite.add(this.engine.world, [topBorder, rightBorder, bottomBorder, leftBorder]);
	}

	private setupMouseConstraint(): void {
		const mouseConstraint = MouseConstraint.create(this.engine, {
            mouse: this.mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
		Composite.add(this.engine.world, mouseConstraint);
	}

	public addBody(body: Body): void {
		Composite.add(this.engine.world, body);
	}

	public addComposite(composite: Composite): void {
		Composite.add(this.engine.world, composite);
	}
}
