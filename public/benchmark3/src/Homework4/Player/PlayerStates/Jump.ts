import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { HW4_Events } from "../../hw4_enums";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";

export default class Jump extends InAir {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.owner.animation.play("JUMP", true);
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
	}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		// If we're falling, go to the fall state
		if(this.parent.velocity.y >= 0){
			this.finished(PlayerStates.FALL);
		}

		if(this.owner.collidedWithTilemap && this.owner.onCeiling){
			// We collided with a tilemap above us. First, get the tile right above us
			this.handleCoinblockCollision();
		}		
	}

	handleCoinblockCollision(){
		let pos = this.owner.position.clone();

		// Go up plus some extra
		pos.y -= (this.owner.collisionShape.halfSize.y + 10);
		pos.x -= 16;
		let rowCol = this.parent.tilemap.getColRowAt(pos);
		let tile1 = this.parent.tilemap.getTileAtRowCol(rowCol);
		pos.x += 16;
		rowCol = this.parent.tilemap.getColRowAt(pos);
		let tile2 = this.parent.tilemap.getTileAtRowCol(rowCol);
		pos.x += 16;
		rowCol = this.parent.tilemap.getColRowAt(pos);
		let tile3 = this.parent.tilemap.getTileAtRowCol(rowCol);

		let t1 = tile1 === 17;
		let t2 = tile2 === 17;
		let t3 = tile3 === 17;
		let air1 = tile1 === 0;
		let air2 = tile2 === 0;
		let air3 = tile3 === 0;
		let majority = (t1 && t2) || (t1 && t3) || (t2 && t3) || (t1 && t2 && t3);
		let minorityButAir = (t1 && air2 && air3) || (air1 && t2 && air3) || (air1 && air2 && t3);
		
		// If coin block, change to empty coin block
		if(majority || minorityButAir){
			if(minorityButAir){
				// Get the correct position
				if(t1){
					pos.x -= 32;
				} else if(t2){
					pos.x -= 16;
				}
				rowCol = this.parent.tilemap.getColRowAt(pos);
			} else {
				pos.x -= 16;
				rowCol = this.parent.tilemap.getColRowAt(pos);
			}

			this.parent.tilemap.setTileAtRowCol(rowCol, 18);
			this.emitter.fireEvent(HW4_Events.PLAYER_HIT_COIN_BLOCK);

			let tileSize = this.parent.tilemap.getTileSize();
			this.parent.coin.position.copy(rowCol.scale(tileSize.x, tileSize.y).add(tileSize.scaled(0.5)));

			// Animate collision
			this.parent.coin.tweens.add("coin", {
				startDelay: 0,
				duration: 300,
				effects: [{
					property: "positionY",
					resetOnComplete: false,
					start: this.parent.coin.position.y,
					end: this.parent.coin.position.y - 2*tileSize.y,
					ease: EaseFunctionType.OUT_SINE
				},
				{
					property: "alpha",
					resetOnComplete: false,
					start: 1,
					end: 0,
					ease: EaseFunctionType.OUT_SINE
				}]
			});

			this.parent.coin.tweens.play("coin");
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}