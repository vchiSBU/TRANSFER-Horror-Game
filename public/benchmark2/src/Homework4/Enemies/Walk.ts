import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EnemyStates } from "./EnemyController";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	time: number;
	
	onEnter(): void {
		if(this.parent.direction.isZero()){
			this.parent.direction = new Vec2(-1, 0);
			(<AnimatedSprite>this.owner).invertX = true;
		}

		(<AnimatedSprite>this.owner).animation.play("WALK", true);

		this.time = Date.now();
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if((this.parent.jumping) && (Date.now() - this.time > 500)){
			this.finished(EnemyStates.JUMP);
			this.parent.velocity.y = -300;
		}

		this.parent.velocity.x = this.parent.direction.x * this.parent.speed;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}