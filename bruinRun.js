import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Textured_Phong} = defs
/* 
Note about texture: I found it only really works w/ library shapes like cube and cylinder
and not with what we defined below (like rectangle)
*/

//NEW SHAPES

class Walk extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-3, -1, -.1], [3, -1, -.1], [-3, -1, .1], [3, -1, .1], [.5, 5, -.1], [-.5, 5, -.1], [.5, 5, .1], [-.5, 5, .1],
            [-3, -1, -.1], [-3, -1, .1], [-.5, 5, -.1], [-.5, 5, .1], [3, -1, .1], [3, -1, -.1], [.5, 5, .1], [.5, 5, -.1],
            [-3, -1, .1], [3, -1, .1], [-.5, 5, .1], [.5, 5, .1], [3, -1, -.1], [-3, -1, -.1], [.5, 5, -.1], [-.5, 5, -.1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Trapezoid extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-2, -1, -.1], [2, -1, -.1], [-2, -1, .1], [2, -1, .1], [1, 1, -.1], [-1, 1, -.1], [1, 1, .1], [-1, 1, .1],
            [-2, -1, -.1], [-2, -1, .1], [-1, 1, -.1], [-1, 1, .1], [2, -1, .1], [2, -1, -.1], [1, 1, .1], [1, 1, -.1],
            [-2, -1, .1], [2, -1, .1], [-1, 1, .1], [1, 1, .1], [2, -1, -.1], [-2, -1, -.1], [1, 1, -.1], [-1, 1, -.1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a trap shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}


class Base_Scene extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;

        // Initialize person translation here so position isn't continuously reset 
        this.person_transform = Mat4.translation(0, 10, 10);

        // Initialize walkway so it is one big piece that the character will walk over
        // A little confused here, is this order correct? 
        this.walkway_path_transform = Mat4.rotation(Math.PI/2,1,0,0).times(Mat4.translation(-5,-70,-1.5)).times(Mat4.scale(16,100,2));
        this.sky_transform = Mat4.translation(-5,25,-60).times(Mat4.scale(70,40,1));

        this.person_z = 10;  //used to identify WHERE the person is in the scene
        this.person_y = 10;

        // for jumping mechanic
        this.isJumping = false;
        this.jumpHeight = 0; 

        // for lateral movement
        this.moveLeft = false;
        this.moveRight = false; 
        
        // to test forward/back movement. Will eventually be automatic
        this.moveForward = false;
        this.moveBackward = false; 

        this.running = false; 
        this.runDist = 0; 

        // to test flagship stuff DELELTE Later
        this.flagship_transform = 0; 
        this.key_check = true;
        this.before = false;
        this.after = false; 
        
        // for landing on starships
        this.on_starship = false; 

        // keeps track of starship locations - only x and z matter
        this.starship_locations = new Map();

        //keeps track of flyer person's locations
        this.flyerperson_info = new Map();

        // Event listeners for x and z movement
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd'){
                this.moveRight = true;
            }
            if (event.key === 'a'){
                this.moveLeft = true; 
            }
            if(event.key === 'w'){
                this.moveForward = true; 
            }
            if(event.key === 's'){
                this.moveBackward = true; 
            }
            if (event.key === 'Escape') {
                this.detach_camera = true;
            }
            if (event.key === '1') {
                this.detach_camera = false;
            }
        })
        document.addEventListener('keyup', (event)=> {
            if (event.key === 'd'){
                this.moveRight = false;
            }
            if (event.key === 'a'){
                this.moveLeft = false; 
            }
            if(event.key === 'w'){
                this.moveForward = false; 
            }
            if(event.key === 's'){
                this.moveBackward = false; 
            }
        })

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'walkway': new Walk(),
            'trapezoid': new Trapezoid(),
            'cylinder': new defs.Cylindrical_Tube(10,10),
            'triangle': new defs.Triangle(),
            'sphere': new defs.Subdivision_Sphere(4),
            'cone': new defs.Rounded_Closed_Cone(20,20),
            'bot': new defs.Rounded_Capped_Cylinder(35,35),

        };

        // Bounding Box for Person ->  use later for collisions
        // need to write updateBoundingBox function and call it inside draw_person
        this.personBoundingBox = {
            min: { x: 0, y: 0, z: 0 },
            max: { x: 0, y: 0, z: 0 }
        };

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            sky_texture: new Material(new defs.Textured_Phong(),
                {ambient: 1, diffusivity: .1, color: hex_color("#000000"),
                texture: new Texture("assets/sky.jpg", "NEAREST")}),
        
        };
        // The white material and basic shader are used for drawing the outline.
    }
}

export class BruinRun extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */

    constructor(){
        super();
        this.detach_camera = false;

        // Why are some things here and some things in the Base_Scene constructor?
        this.bot_transform = Mat4.translation(-3,4,0);
        this.flyerperson_transform = Mat4.translation(8,10,7);

        this.lightpost_pos = Mat4.translation(-18,9,0).times(Mat4.scale(1.5,1.5,1.5));
        this.rand_position = Math.floor(Math.random()*6) + 1;

    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

        this.key_triggered_button("jump", [" "], () => {
            // Person jumps
            if (!this.isJumping){
                this.isJumping = true; 
            }
        });
        this.key_triggered_button("Left", ["a"], () => {
            if(!this.moveLeft){
                this.moveLeft = true;
            }
        })
        this.key_triggered_button("Right", ["d"], () => {
            if(!this.moveRight){
                this.moveRight = true; 
            }
        })
        this.key_triggered_button("Forward", ["w"], () => {
            this.moveForward = true; 
        })
        this.key_triggered_button("RUN", ["q"], () => {
            this.running = !this.running; 
        })

        this.key_triggered_button("Unlock Camera", ["Escape"], () =>{
            this.detach_camera = true;
        })
        this.key_triggered_button("Lock Camera", ["1"], () =>{
            this.detach_camera = false;
        })
    }

    draw_tree(context, program_state, tree_translation) {
        //pass in the location that you want a tree in

        const trunk_color = hex_color("#845f33");
        const leaf_color = hex_color("#00ff00");

        let tree = {
            trunk: Mat4.rotation(Math.PI/2,5,0,0).times(Mat4.scale(1,1,15,1)),
            leaf1: Mat4.translation(1,-2.5,0,1).times( Mat4.scale(2,3,2,1)) ,
            leaf2: Mat4.translation(0,-2.5,1).times(Mat4.rotation(Math.PI,1,0,1)).times(Mat4.scale(1,-1,1)).times(Mat4.scale(2,3,2,1)),
            leaf3: Mat4.translation(0,-2.5,-1).times(Mat4.rotation(Math.PI,1,0,1)).times(Mat4.scale(-1,-1,1)).times(Mat4.scale(2,3,2,1)),
            leaf4: Mat4.translation(-1,-2.5,0).times(Mat4.scale(-1,1,1)).times(Mat4.scale(2,3,2,1)),
        }

        this.shapes.cylinder.draw(context, program_state, tree_translation.times(tree.trunk), this.materials.plastic.override( {color: trunk_color}));

        
        for (var i = 0; i < 5; i++) {
            this.shapes.triangle.draw(context, program_state, tree_translation.times(tree.leaf1), this.materials.plastic.override( {color: leaf_color}));
            this.shapes.triangle.draw(context, program_state, tree_translation.times(tree.leaf2), this.materials.plastic.override( {color: leaf_color}));
            this.shapes.triangle.draw(context, program_state, tree_translation.times(tree.leaf3), this.materials.plastic.override( {color: leaf_color}));
            this.shapes.triangle.draw(context, program_state, tree_translation.times(tree.leaf4), this.materials.plastic.override( {color: leaf_color}));

            let leaves_manyTr = Mat4.translation(0,.6,0);
            tree.leaf1= tree.leaf1.times(leaves_manyTr);
            tree.leaf2 = tree.leaf2.times(leaves_manyTr);
            tree.leaf3 = tree.leaf3.times(leaves_manyTr);
            tree.leaf4 = tree.leaf4.times(leaves_manyTr);
        }
        
    }

    draw_lightpost(context, program_state, lightpost_transform) {
        const pole_color = hex_color("#30404f");
        const light_color = hex_color("#eae9a9");
        const banner_color = hex_color("#0058eb");
        const temp_color = hex_color("#ff00f0")
        
        let lightpost = {
            pole: Mat4.rotation(Math.PI/2,5,0,0).times(Mat4.scale(.4,.4,14,1)),
            light: Mat4.translation(0,7,0).times(Mat4.rotation(Math.PI,0,-1,1)).times(Mat4.scale(1.2,1.3,1.5)),
            banner1: Mat4.translation(1.7,4,0).times(Mat4.scale(1.2,2,.05)),
            banner2: Mat4.translation(-1.7,4,0).times(Mat4.scale(1.2,2,.05)),
        }

        this.shapes.cylinder.draw(context, program_state, lightpost_transform.times(lightpost.pole), this.materials.plastic.override( {color: pole_color}))
        this.shapes.cone.draw(context, program_state, lightpost_transform.times(lightpost.light), this.materials.plastic.override( {color: light_color}))

        this.shapes.cube.draw(context, program_state, lightpost_transform.times(lightpost.banner1), this.materials.plastic.override( {color: banner_color}))
        this.shapes.cube.draw(context, program_state, lightpost_transform.times(lightpost.banner2), this.materials.plastic.override( {color: banner_color}))
    }

    draw_bench(context, program_state, bench_transform) {
        //BENCH_TRANSFORM = WHERE YOU WANT THE BENCH
        const bench_color = hex_color("#38424c");
        //const bench_color = hex_color("#ff0000")

        let bench = {
            table: Mat4.translation(-.2,1,0).times(Mat4.scale(1.6,.1,1.8)),
            pole1: Mat4.rotation(Math.PI/2,5,0,0).times(Mat4.scale(.2,.2,2,1)),
            pole2: Mat4.rotation(Math.PI/2,5,0,0).times(Mat4.scale(.2,.2,2,1)).times(Mat4.translation(-3,3,0)),

            seat_back: Mat4.translation(-3.6,1,0).times(Mat4.rotation(Math.PI/10,-1,0,5)).times(Mat4.scale(.1,1,2)),
            seat_bottom: Mat4.translation(-2.5,0,0).times(Mat4.rotation(Math.PI/2, 0,0,1)).times(Mat4.scale(.1,1,2)),
            seat_pole: Mat4.rotation(Math.PI/2,5,0,0).times(Mat4.scale(.2,.2,.5,1)).times(Mat4.translation(-12,0,1)),

        }

        this.shapes.cylinder.draw(context, program_state, bench_transform.times(bench.pole1), this.materials.plastic.override({ color: bench_color}))
        this.shapes.cylinder.draw(context, program_state, bench_transform.times(bench.pole2), this.materials.plastic.override({ color: bench_color}))
        this.shapes.cube.draw(context, program_state, bench_transform.times(bench.table), this.materials.plastic.override( {color: bench_color}))

        this.shapes.cube.draw(context, program_state, bench_transform.times(bench.seat_back), this.materials.plastic.override( {color: bench_color}))
        this.shapes.cube.draw(context, program_state, bench_transform.times(bench.seat_bottom), this.materials.plastic.override( {color: bench_color}))
        this.shapes.cube.draw(context, program_state, bench_transform.times(bench.seat_pole), this.materials.plastic.override( {color: bench_color}))


    }

    draw_starship(context, program_state, bot_transform) {
        const body_color = hex_color("#ffffff");
        const wheel_color = hex_color("#38424c");
        const flag_color = hex_color("#f69509");

        // Keep track of starship locations for collision detection
        // may or may not use this depending on how the scene is populated with starships
        // with predictable z coordinates, this won't be necessary
        if(this.key_check){
            console.log('bot y location', bot_transform[2][3]);
            this.key_check = false; 
        }
        this.starship_locations.set(bot_transform[2][3], bot_transform[0][3]);


        let starship = {
            //use rounded_capped_cylinder
            body: Mat4.rotation(Math.PI/2, 0, 5, 0).times(Mat4.scale(1.3,1,3.5)),
            wheel1: Mat4.translation(-.2,-1,1.1).times(Mat4.scale(.5,.5,.1)),
            wheel2: Mat4.translation(-1.2,-1,1.1).times(Mat4.scale(.5,.5,.1)),
            wheel3: Mat4.translation(.8,-1,1.1).times(Mat4.scale(.5,.5,.1)),
            pole: Mat4.rotation(Math.PI/2,5,0,.5).times(Mat4.scale(.1,.1,5)).times(Mat4.translation(-6,0,-.4)),
            flag: Mat4.translation(-.8,4.3,0).times(Mat4.rotation(Math.PI, -1,0,1)).times(Mat4.scale(.1,.6,.5)),
            square: Mat4.translation(0,.35,1.4).times(Mat4.scale(.8,.4,.1)),
        }
        
        this.shapes.bot.draw(context, program_state, bot_transform.times(starship.body), this.materials.plastic.override( {color: body_color }))
        this.shapes.sphere.draw(context, program_state, bot_transform.times(starship.wheel1), this.materials.plastic.override( {color: wheel_color}))
        this.shapes.sphere.draw(context, program_state, bot_transform.times(starship.wheel2), this.materials.plastic.override( {color: wheel_color}))
        this.shapes.sphere.draw(context, program_state, bot_transform.times(starship.wheel3), this.materials.plastic.override( {color: wheel_color}))
        this.shapes.sphere.draw(context, program_state, bot_transform.times(starship.wheel1).times(Mat4.translation(0,0,-22)), this.materials.plastic.override( {color: wheel_color}))
        this.shapes.sphere.draw(context, program_state, bot_transform.times(starship.wheel2).times(Mat4.translation(0,0,-22)), this.materials.plastic.override( {color: wheel_color}))
        this.shapes.sphere.draw(context, program_state, bot_transform.times(starship.wheel3).times(Mat4.translation(0,0,-22)), this.materials.plastic.override( {color: wheel_color}))
        this.shapes.cylinder.draw(context, program_state, bot_transform.times(starship.pole), this.materials.plastic.override( {color: wheel_color}))
        this.shapes.cone.draw(context, program_state, bot_transform.times(starship.flag), this.materials.plastic.override( {color: flag_color}))

        this.shapes.cube.draw(context, program_state, bot_transform.times(starship.square), this.materials.plastic.override( {color: wheel_color}))

    }   

    draw_walkway(context, program_state, walkway_transform) {
        const path_color = hex_color("#bebebe");
        const sky_color = hex_color("#1a9ffa");

       //TODO: Move sky w/ person


        // Draw walkway 
        this.shapes.trapezoid.draw(context, program_state, walkway_transform.times(this.walkway_path_transform), this.materials.plastic.override( {color: path_color}))
        // Draw sky background
         this.shapes.cube.draw(context, program_state, walkway_transform.times(this.sky_transform), this.materials.sky_texture);

    }

    draw_person(context, program_state, model_transform = Mat4.identity()) {
        // Draws a person at the origin, just a rough draft version
        // @model_transform: transformation matrix applied to ALL parts (i.e. if you want to move everything)

        // Check if there is a collision
        //console.log('Person z and x', model_transform[0][3], model_transform[2][3]);


        // Jumping 
        if (this.isJumping){
            //if the player is not over as starship
            if (!this.on_starship){
                this.jumpHeight +=1; 

                // if jump is finished
                if (this.jumpHeight > 50){
                    this.isJumping = false; 
                    this.jumpHeight = 0; 
                }

                // apply jump translation
                model_transform = model_transform.times(Mat4.translation(0, 8 * Math.sin(Math.PI * this.jumpHeight/50), 0));
                // update stored y 
                this.person_y = model_transform[1][3];
            }
            else { // player is currently jumping over a starship 

                if ((Math.round(this.person_y * 2) == 28) && (this.jumpHeight > 25)){
                    console.log('he is on the thingy', this.person_y);
                } else {
                    this.jumpHeight +=1; 
                    if (this.jumpHeight > 50){
                        this.isJumping = false; 
                        this.jumpHeight = 0; 
                    }
                }

                // apply jump translation
                model_transform = model_transform.times(Mat4.translation(0, 8 * Math.sin(Math.PI * this.jumpHeight/50), 0));
                // update stored y 
                this.person_y = model_transform[1][3];
            }
        }

        const blue = hex_color("#1a9ffa"), yellow = hex_color("#fdc03a"), red = hex_color('#ff1401');

        let person = {
            head_transform: Mat4.identity().times(Mat4.translation(0, 0, 0)),
            torso_transform: Mat4.identity().times(Mat4.translation(0,-2.5,0)),
            arms_transformL: Mat4.identity().times(Mat4.translation(-1.5, -3, 0)),
            arms_transformR: Mat4.identity().times(Mat4.translation(1.5, -3, 0)),
            legs_transformL: Mat4.identity().times(Mat4.translation(-.5, -6.25, 0)),
            legs_transformR: Mat4.identity().times(Mat4.translation(.5, -6.25, 0))
        }

        // Use custom transform_matrix to modify entire person at once
        for (let matrix in person) { 
            person[matrix] = person[matrix].times(model_transform); 
        }

        // Left/Right Movement
        // Once course is done, add bounds so character can't move off the course/offscreen
        // decide if we want the camera to follow the character or not
        if(this.moveRight){
            this.person_transform = this.person_transform.times(Mat4.translation(0.5, 0, 0));
        }
        if(this.moveLeft){
            this.person_transform = this.person_transform.times(Mat4.translation(-0.5, 0, 0));
        }
        if(this.moveForward){
            // because inverted z axis 
            this.person_transform = this.person_transform.times(Mat4.translation(0, 0, -1));
            this.person_z = this.person_transform[2][3]; 
            this.sky_transform = this.sky_transform.times(Mat4.translation(0,0,-1));

        }
        if(this.moveBackward){
            this.person_transform = this.person_transform.times(Mat4.translation(0, 0, 1));
            this.person_z = this.person_transform[2][3]; 
            this.sky_transform = this.sky_transform.times(Mat4.translation(0,0,1));

        }
        if(this.running){
            // add more to this function once collision detection is done
            this.runDist +=1; 
            // limit dictates run distance 
            if(this.runDist < 500){
                // Last parameter dictates speed
                this.person_transform = this.person_transform.times(Mat4.translation(0, 0, -0.2));
                this.person_z = this.person_transform[2][3];
                this.sky_transform = this.sky_transform.times(Mat4.translation(0,0,-.2));
            }
        }

        // Walking Animation Parameters
        const x = program_state.animation_time / 1000;
        let max_angle = Math.PI / 5;
        let swing_seconds = 2;
        let t = max_angle * Math.sin((2 * Math.PI / swing_seconds) * x);
        let t_reverse = max_angle * Math.sin((2 * Math.PI / swing_seconds) * x + Math.PI);

        // change this so it is conditional based on if the character is moving or not
        // Walking Animation
        person.arms_transformL = person.arms_transformL
            .times(Mat4.translation(0, 2, 0))
            .times(Mat4.rotation(t, 1, 0, 0))
            .times(Mat4.translation(0, -2, 0));
        person.arms_transformR = person.arms_transformR
            .times(Mat4.translation(0, 2, 0))
            .times(Mat4.rotation(t_reverse, 1, 0, 0))
            .times(Mat4.translation(0, -2, 0));
        // person.legs_transformL = person.legs_transformL
        //     .times(Mat4.translation(0, 2.25, 0))
        //     .times(Mat4.rotation(t_reverse, 1, 0, 0))
        //     .times(Mat4.translation(0, -2.25, 0));         
        // person.legs_transformR = person.legs_transformR
        //     .times(Mat4.translation(0, 2.25, 0))
        //     .times(Mat4.rotation(t, 1, 0, 0))
        //     .times(Mat4.translation(0, -2.25, 0));

        person.head_transform = person.head_transform.times(Mat4.scale(1,1,.75));
        person.torso_transform =  person.torso_transform.times(Mat4.scale(1, 1.5, .5));
        person.arms_transformL = person.arms_transformL.times(Mat4.scale(.5, 2, .5));
        person.arms_transformR = person.arms_transformR.times(Mat4.scale(.5, 2, .5));
        person.legs_transformL = person.legs_transformL.times(Mat4.scale(.5, 2.25, .5));
        person.legs_transformR = person.legs_transformR.times(Mat4.scale(.5, 2.25, .5));

        let rounded_person_z = Math.round(model_transform[2][3]);
        let collision = false; 
        this.on_starship = false; 

        // check within a 4 unit radius if there is a collision
        for(let i = 0; i < 8; i++){
            const key = rounded_person_z -4 + i; 
            // check if key-value pair exists in starship_locations, assign to starship_x
            if(this.starship_locations.get(key)){
                let starship_x = Math.round(this.starship_locations.get(key));
                let rounded_person_x = Math.round(model_transform[0][3]) ;

                // check if collision within 3 unit radius 
                for(let i = 0; i < 6; i++){
                    if(rounded_person_x - 3 + i === starship_x){
                        // collision detected assuming not jumping 
                        collision = true; 
                        if (this.isJumping){
                            //console.log('collision but jumping');
                            // What height does this correlate to? 
                            //if (this.jumpHeight > 10){
                            if ( this.person_y > 13) {
                                console.log('jumping over that jawn', this.person_y);
                                collision = false; 
                                this.on_starship = true; 
                            }
                        }
                        //collision = true; 
                    }
                }
            }
        } 

        if(!collision){
            this.shapes.cube.draw(context, program_state, person.head_transform, this.materials.plastic.override(yellow));
            this.shapes.cube.draw(context, program_state, person.torso_transform, this.materials.plastic.override(blue));
            this.shapes.cube.draw(context, program_state, person.arms_transformR, this.materials.plastic.override(yellow));
            this.shapes.cube.draw(context, program_state, person.arms_transformL, this.materials.plastic.override(yellow));
            this.shapes.cube.draw(context, program_state, person.legs_transformR, this.materials.plastic.override(yellow));
            this.shapes.cube.draw(context, program_state, person.legs_transformL, this.materials.plastic.override(yellow));
        } else {
            this.shapes.cube.draw(context, program_state, person.head_transform,  this.materials.plastic.override(red));
            this.shapes.cube.draw(context, program_state, person.torso_transform, this.materials.plastic.override(red));
            this.shapes.cube.draw(context, program_state, person.arms_transformR, this.materials.plastic.override(red));
            this.shapes.cube.draw(context, program_state, person.arms_transformL, this.materials.plastic.override(red));
            this.shapes.cube.draw(context, program_state, person.legs_transformR, this.materials.plastic.override(red));
            this.shapes.cube.draw(context, program_state, person.legs_transformL, this.materials.plastic.override(red));
        }
    }

    draw_flyerperson(context, program_state, model_transform){
         // Draws a flyer person at certain locations, just a rough draft version
        // @model_transform: transformation matrix applied to ALL parts (i.e. if you want to move everything)

        // Check if there is a collision
        //console.log('Person z and x', model_transform[0][3], model_transform[2][3]);

        const black = hex_color("#000000"), white = hex_color("#FFFFFF"), green = hex_color("#98FB98");

        let person = {
            head_transform: Mat4.identity().times(Mat4.rotation(Math.PI/2, 0, 5, 0)).times(Mat4.translation(0, 0, 0)),
            torso_transform: Mat4.identity().times(Mat4.rotation(Math.PI/2, 0, 5, 0)).times(Mat4.translation(0,-2.5,0)),
            arms_transformL: Mat4.identity().times(Mat4.rotation(Math.PI/2, 0, 5, 0)).times(Mat4.translation(-1.5, -3, 0)),
            arms_transformR: Mat4.identity().times(Mat4.rotation(Math.PI/2, 0, 5, 0)).times(Mat4.translation(1.5, -3, 0)),
            legs_transformL: Mat4.identity().times(Mat4.rotation(Math.PI/2, 0, 5, 0)).times(Mat4.translation(-.5, -6.25, 0)),
            legs_transformR: Mat4.identity().times(Mat4.rotation(Math.PI/2, 0, 5, 0)).times(Mat4.translation(.5, -6.25, 0)),
            flyer_transform: Mat4.identity().times(Mat4.rotation(Math.PI/2, 0, 5, 0)).times(Mat4.translation(1.5, -6, 0))
        }

        // Use custom transform_matrix to modify entire person at once
        for (let matrix in person) { 
            person[matrix] = person[matrix].times(model_transform); 
        }

        // Walking Animation Parameters
        const x = program_state.animation_time / 1000;
        let max_angle = Math.PI / 5;
        let max_angle_arms = Math.PI/3;
        let swing_seconds = 2;
        let t = max_angle * Math.sin((2 * Math.PI / swing_seconds) * x);
        let t_arms = max_angle_arms * Math.sin((2 * Math.PI / swing_seconds) * x);
        let t_reverse = max_angle * Math.sin((2 * Math.PI / swing_seconds) * x + Math.PI);
        let t_reverse_arms = max_angle_arms * Math.sin((2 * Math.PI / swing_seconds) * x + Math.PI);

        // change this so it is conditional based on if the character is moving or not
        // Walking Animation
        person.arms_transformR = person.arms_transformR
            .times(Mat4.translation(0, 1.75, 0))
            .times(Mat4.rotation(t_reverse_arms, 1, 0, 0))
            .times(Mat4.translation(0, -2, 0));
        person.flyer_transform = person.arms_transformR
            .times(Mat4.translation(0, -3, 0));
        person.legs_transformL = person.legs_transformL
            .times(Mat4.translation(0, 2.25, 0))
            .times(Mat4.rotation(t_reverse, 1, 0, 0))
            .times(Mat4.translation(0, -2.25, 0));         
        person.legs_transformR = person.legs_transformR
            .times(Mat4.translation(0, 2.25, 0))
            .times(Mat4.rotation(t, 1, 0, 0))
            .times(Mat4.translation(0, -2.25, 0));

        person.head_transform = person.head_transform.times(Mat4.scale(1,1,1));
        person.torso_transform =  person.torso_transform.times(Mat4.scale(1, 1.5, .5));
        person.arms_transformL = person.arms_transformL.times(Mat4.scale(.5, 2, .5));
        person.arms_transformR = person.arms_transformR.times(Mat4.scale(.5, 2, .5));
        person.flyer_transform = person.flyer_transform.times(Mat4.scale(0.1, 1, 0.75));
        person.legs_transformL = person.legs_transformL.times(Mat4.scale(.5, 2.25, .5));
        person.legs_transformR = person.legs_transformR.times(Mat4.scale(.5, 2.25, .5));

        this.shapes.sphere.draw(context, program_state, person.head_transform, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.torso_transform, this.materials.plastic.override(black));
        this.shapes.cube.draw(context, program_state, person.arms_transformR, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.flyer_transform, this.materials.plastic.override(green));
        this.shapes.cube.draw(context, program_state, person.arms_transformL, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.legs_transformR, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.legs_transformL, this.materials.plastic.override(white));
    }

    draw_flyerperson2(context, program_state, model_transform, key){
        // Draws a flyer person at certain locations, just a rough draft version
       // @model_transform: transformation matrix applied to ALL parts (i.e. if you want to move everything)


       // kind of forgot what this map is for
    //    this.flyerperson_locations.set(key, false);
    //    this.flyerperson_info.set(key, { startMove: false, progress: 0});

    //    if(this.flyerperson_key)

        // check if the player is within a certain distance
        if( (this.person_z - model_transform[2][3]) < 5){
            // if not in map and in range
            // if (!target.has(key))
            if(!this.flyerperson_info.has(key)){
                // add flyerperson2 to map
                console.log('initialize map');
                this.flyerperson_info.set(key, {progress: 0, turned: false}); 
            } else { // if they are initialized -> movement cycle has started 
                let flyerP = this.flyerperson_info.get(key);
                //let oldProgress = flyerP.progress;
                if ( flyerP.turned == false && flyerP.progress < 20){
                    // translate that guy
                    model_transform = model_transform.times(Mat4.translation(-0.2 * flyerP.progress, 0, 0));
                    flyerP.progress += 1; 
                } else {
                    if (flyerP.turned == false){
                        model_transform = model_transform.times(Mat4.translation(-0.2 * flyerP.progress, 0, 0)); 
                        flyerP.turned = true; 
                    }
                    model_transform = model_transform.times(Mat4.translation(-0.2 * flyerP.progress, 0, 0)); 
                }
                // update map with new information
                this.flyerperson_info.set(key, flyerP); 
            }
        }

        // remove this eventually 
       let temp_trans = Mat4.translation(0,0,-7);

       const black = hex_color("#000000"), white = hex_color("#FFFFFF"), green = hex_color("#98FB98");
       
       let person = {
           head_transform: Mat4.identity().times(Mat4.translation(0, 0, 0)),
           torso_transform: Mat4.identity().times(Mat4.translation(0,-2.5,0)),
           arms_transformL: Mat4.identity().times(Mat4.translation(0, -3, -1.5)),
           arms_transformR: Mat4.identity().times(Mat4.translation(0, -3, 1.5)),
           legs_transformL: Mat4.identity().times(Mat4.translation(0, -6.25, -0.5)),
           legs_transformR: Mat4.identity().times(Mat4.translation(0, -6.25, 0.5)),
           flyer_transform: Mat4.identity().times(Mat4.translation(0, -6, 1.5))
       }

       // Use custom transform_matrix to modify entire person at once
       for (let matrix in person) { 
            // if turned, keep turned, still figuring out how to turn 
            if(this.flyerperson_info.has(key) && this.flyerperson_info.get(key).turned == true){
                    person = {
                        head_transform: Mat4.identity().times(model_transform).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.translation(0, 0, 0)),
                        torso_transform: Mat4.identity().times(model_transform).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.translation(0,-2.5,0)),
                        arms_transformL: Mat4.identity().times(model_transform).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.translation(0, -3, -1.5)),
                        arms_transformR: Mat4.identity().times(model_transform).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.translation(0, -3, 1.5)),
                        legs_transformL: Mat4.identity().times(model_transform).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.translation(0, -6.25, -0.5)),
                        legs_transformR: Mat4.identity().times(model_transform).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.translation(0, -6.25, 0.5)),
                        flyer_transform: Mat4.identity().times(model_transform).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.translation(0, -6, 1.5))
                    }
            } else {
                person[matrix] = person[matrix].times(model_transform); 
            }
       }

       // Walking Animation Parameters
       const x = program_state.animation_time / 1000;
       let max_angle = Math.PI / 5;
       let max_angle_arms = Math.PI/3;
       let swing_seconds = 2;
       let t = max_angle * Math.sin((2 * Math.PI / swing_seconds) * x);
       let t_arms = max_angle_arms * Math.sin((2 * Math.PI / swing_seconds) * x);
       let t_reverse = max_angle * Math.sin((2 * Math.PI / swing_seconds) * x + Math.PI);
       let t_reverse_arms = max_angle_arms * Math.sin((2 * Math.PI / swing_seconds) * x + Math.PI);

       // change this so it is conditional based on if the character is moving or not
       // Walking Animation
    //    person.arms_transformR = person.arms_transformR
    //        .times(Mat4.translation(0, 1.75, 0))
    //        .times(Mat4.rotation(t_reverse_arms, 1, 0, 0))
    //        .times(Mat4.translation(0, -2, 0));
    //    person.flyer_transform = person.arms_transformR
    //        .times(Mat4.translation(0, -3, 0));
    //    person.legs_transformL = person.legs_transformL
    //        .times(Mat4.translation(0, 2.25, 0))
    //        .times(Mat4.rotation(t_reverse, 1, 0, 0))
    //        .times(Mat4.translation(0, -2.25, 0));         
    //    person.legs_transformR = person.legs_transformR
    //        .times(Mat4.translation(0, 2.25, 0))
    //        .times(Mat4.rotation(t, 1, 0, 0))
    //        .times(Mat4.translation(0, -2.25, 0));

       person.head_transform = person.head_transform.times(Mat4.scale(1,1,1));
       person.torso_transform =  person.torso_transform.times(Mat4.scale(1, 1.5, .5));
       //person.torso_transform =  person.torso_transform.times(Mat4.scale(0.5, 1.5, 1));
       person.arms_transformL = person.arms_transformL.times(Mat4.scale(.5, 2, .5));
       person.arms_transformR = person.arms_transformR.times(Mat4.scale(.5, 2, .5));
       person.flyer_transform = person.flyer_transform.times(Mat4.scale(0.1, 1, 0.75));
       person.legs_transformL = person.legs_transformL.times(Mat4.scale(.5, 2.25, .5));
       person.legs_transformR = person.legs_transformR.times(Mat4.scale(.5, 2.25, .5));

       this.shapes.sphere.draw(context, program_state, temp_trans.times(person.head_transform), this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, temp_trans.times(person.torso_transform), this.materials.plastic.override(black));
        this.shapes.cube.draw(context, program_state, temp_trans.times(person.arms_transformR), this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, temp_trans.times(person.flyer_transform), this.materials.plastic.override(green));
        this.shapes.cube.draw(context, program_state, temp_trans.times(person.arms_transformL), this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, temp_trans.times(person.legs_transformR), this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, temp_trans.times(person.legs_transformL), this.materials.plastic.override(white));
    }

    draw_scene(context, program_state, scene_translation = Mat4.identity()) {
        let t = program_state.animation_time / 1000;

        let tree1_pos = Mat4.translation(10,13,1,1);
        let tree2_pos = Mat4.translation(-21, 13, 1,1);

        let trees = [tree1_pos, tree2_pos];


        // Draw more trees
        trees.forEach(tree => {
            let tree_scale = Mat4.scale(1.2,1.2,1.2);
            this.draw_tree(context, program_state, tree.times(scene_translation).times(Mat4.translation(0,-2.5,0)).times(tree_scale));
            let further_tree = tree.times(scene_translation).times(Mat4.translation(0, -2.5, -20)).times(tree_scale);
            this.draw_tree(context, program_state, further_tree);
            further_tree = tree.times(scene_translation).times(Mat4.translation(0, -2.5, -30)).times(tree_scale);
            this.draw_tree(context, program_state, further_tree);
            further_tree = tree.times(scene_translation).times(Mat4.translation(2, -2.5, -45)).times(tree_scale);
            this.draw_tree(context, program_state, further_tree);
            further_tree = tree.times(scene_translation).times(Mat4.translation(2, -2.5, -60)).times(tree_scale);
            this.draw_tree(context, program_state, further_tree);
        });


        let bench_pos = Mat4.translation(-15,3,5);
        for (let i = 0; i < 4; i++) {
            this.draw_bench(context, program_state, bench_pos);
            let move_bench = Mat4.translation(0,0,-20*i);
            let flip_bench = Mat4.translation(22,0,2).times(Mat4.scale(-1,1,1));

            this.draw_bench(context, program_state, bench_pos.times(scene_translation).times(move_bench));
            this.draw_bench(context, program_state, bench_pos.times(scene_translation).times(flip_bench));
            this.draw_bench(context, program_state, bench_pos.times(scene_translation).times(flip_bench).times(move_bench));
        }

        for (let i = 1; i < 4; i++) {
            this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation));
            let move_lightpost = Mat4.translation(0,0,-20*i);
            let flip_lightpost = Mat4.translation(20,0,-5);
            this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lightpost));
            this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(flip_lightpost));
            this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(flip_lightpost).times(move_lightpost));

        }
    }

    display(context, program_state) {
        super.display(context, program_state);

                // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        const initial_camera_position = Mat4.translation(5, -10, -30);

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(initial_camera_position);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(5, 30, 20, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
        let t = program_state.animation_time / 1000;

        let walkway_transform = Mat4.translation(0,0,-10);


        this.draw_walkway(context, program_state, walkway_transform);
        this.draw_person(context, program_state, this.person_transform);

        let temp = Mat4.translation(0,0,0);

        this.draw_scene(context, program_state, temp);
        if ( this.person_z < -10) {
            temp = Mat4.translation(0,0,-80);
            this.draw_scene(context, program_state, temp);
        }

       
       let bot_motion = Mat4.translation(6.5*Math.sin(Math.PI/3 * t),0,0);
       //stationary starship for collision testing
       this.draw_starship(context, program_state, this.bot_transform);
       bot_motion = Mat4.translation(-1*6.5*Math.sin(Math.PI/3 * t),0,-15);
       this.draw_starship(context, program_state, this.bot_transform.times(bot_motion));
       bot_motion = Mat4.translation(6.5*Math.sin(Math.PI/3 * t+this.rand_position),0,-30);
       this.draw_starship(context, program_state, this.bot_transform.times(bot_motion));
       
       
        let flyerperson_motion = Mat4.translation(0,0,2*Math.sin(Math.PI * t * this.rand_position/4.0));

        // be warned, for collision, flyerperson2 requires the input of a key, don'tdo any duplicates 
        this.draw_flyerperson2(context, program_state, this.flyerperson_transform.times(Mat4.translation(0, 0, -5)), 2);
        flyerperson_motion = Mat4.translation(0,0,2*Math.sin(Math.PI * t * this.rand_position/2.5)).times(Mat4.rotation(270, 0, 0, 1)).times(Mat4.translation(0, 0, -25));
        this.draw_flyerperson(context, program_state, this.flyerperson_transform.times(flyerperson_motion));
        flyerperson_motion = Mat4.translation(52.5,0,2*Math.sin(Math.PI * t* this.rand_position/2.0));
        this.draw_flyerperson(context, program_state, this.flyerperson_transform.times(flyerperson_motion));
        flyerperson_motion = Mat4.translation(52.5, 0 ,2*Math.sin(Math.PI * t)).times(Mat4.rotation(270, 0, 0, 1)).times(Mat4.translation(0, 0, -25));
        this.draw_flyerperson(context, program_state, this.flyerperson_transform.times(flyerperson_motion));


       if(!this.detach_camera){
            //Use the default camera position
            program_state.set_camera(Mat4.inverse(this.person_transform.times(Mat4.translation(0, 0, 20))));       
       }
    }
}