import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

export default class Level1 extends GameLevel {
    
    loadScene(): void {
        // Load resources
        this.load.image("background", "hw5_assets/sprites/background.png");
        this.load.image("coin", "hw5_assets/sprites/coin.png");
        this.load.tilemap("level1", "hw5_assets/tilemaps/level1.json");
        this.load.spritesheet("player", "hw5_assets/spritesheets/Character.json");
        this.load.spritesheet("hopper", "hw5_assets/spritesheets/hopper.json");
        this.load.spritesheet("bunny", "hw5_assets/spritesheets/ghostBunny.json");
        this.load.spritesheet("rat", "hw5_assets/spritesheets/rat.json");
        this.load.audio("jump", "hw5_assets/sounds/jump.wav");
        this.load.audio("coin", "hw5_assets/sounds/coin.wav");
        this.load.audio("player_death", "hw5_assets/sounds/player_death.wav");
        this.load.audio('level1', "hw5_assets/music/bgm.mp3");
        this.load.audio('enemy_death', 'hw5_assets/sounds/death.mp3');

    }

    // HOMEWORK 4 - TODO
    /**
     * Decide which resource to keep and which to cull.
     * 
     * Check out the resource manager class.
     * 
     * Figure out how to save resources from being unloaded, and save the ones that are needed
     * for level 2.
     * 
     * This will let us cut down on load time for the game (although there is admittedly
     * not a lot of load time for such a small project).
     */
    unloadScene(){
        // Keep resources - this is up to you
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: 'level1'});
    }

    startScene(): void {
        // Add a background layer and set the background image on it
        this.addParallaxLayer("bg", new Vec2(0.25, 0), -100);
        let bg = this.add.sprite("background", "bg");
        bg.scale.set(2, 2);
        bg.position.set(bg.boundary.halfSize.x, 76);

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: 'level1', loop: true, holdReference: true})

        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 20*32);

        this.playerSpawn = new Vec2(5*32, 18*32);
        
        // Do generic setup for a GameLevel
        super.startScene();
        
        this.player.scale = new Vec2(0.5, 0.5);
        this.addLevelEnd(new Vec2(58, 17), new Vec2(2, 2));

        this.nextLevel = Level2;

        // Add enemies of various types
        for(let pos of [new Vec2(24, 18.4), new Vec2(26, 18.4), new Vec2(12, 18.4), new Vec2(40, 18.4), new Vec2(51, 17)]){
            this.addEnemy("rat", pos, {});
        }

        for(let pos of [new Vec2(51, 17)]){
            this.addEnemy("hopper", pos, {jumpy: true});
        }
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);

        Debug.log("playerpos", this.player.position.toString());
    }
}