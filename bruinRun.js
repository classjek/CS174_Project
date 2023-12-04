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

class Flyer extends Shape {
    constructor() {
        super("position", "normal",);
            // Define vertices for a nearly flat cube (thick square)
            this.arrays.position = Vector3.cast(
                // Front face
                [-1, -1, 0.05], [1, -1, 0.05], [-1, 1, 0.05], [1, 1, 0.05],
                // Back face
                [-1, -1, -0.05], [1, -1, -0.05], [-1, 1, -0.05], [1, 1, -0.05]
            );
            this.arrays.normal = Vector3.cast(
                // Normals for each face
                [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], // Front face
                [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]  // Back face
            );
            this.arrays.texture_coord = Vector3.cast(
                // Front and Back faces
                [0, 0], [1, 0], [0, 1], [1, 1], // Repeated for both front and back faces
                [0, 0], [1, 0], [0, 1], [1, 1]
            );
            // Define indices for the nearly flat cube
            this.indices.push(
                0, 1, 2, 1, 3, 2, // Front face
                4, 6, 5, 5, 6, 7, // Back face
                0, 2, 4, 2, 6, 4, // Left face
                1, 5, 3, 3, 5, 7, // Right face
                2, 3, 6, 3, 7, 6, // Top face
                0, 4, 1, 1, 4, 5  // Bottom face
            );
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
        this.walkway_path_transform = Mat4.rotation(Math.PI/2,1,0,0).times(Mat4.translation(0,-70,-1.5)).times(Mat4.scale(12,100,2));
        this.sky_transform = Mat4.translation(-5,25,-60).times(Mat4.scale(70,320,1));

        this.person_z = 10;  //used to identify WHERE the person is in the scene
        this.person_y = 10;
        this.person_x = 0;

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
        
        // for landing on starships
        this.on_starship = false; 

        // keeps track of starship locations - only x and z matter
        this.starship_locations = new Map();

        //keeps track of flyer persons
        // This map currently has two elements, one to keep track of the flyerperson's x movement and the other to keep track of their rotation
        this.flyerperson_info = new Map();

        // keep track of if a collision has been triggered
        this.collision = false; 
        this.flyer_size = 0; 

        // for randomization of flyers
        this.rando = Math.floor(Math.random() * 5) + 1;

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
            'ground': new Cube(),
            'walkway': new Walk(),
            'trapezoid': new Trapezoid(),
            'cylinder': new defs.Cylindrical_Tube(10,10),
            'triangle': new defs.Triangle(),
            'sphere': new defs.Subdivision_Sphere(4),
            'cone': new defs.Rounded_Closed_Cone(20,20),
            'bot': new defs.Rounded_Capped_Cylinder(35,35),
            'flyer': new Flyer(),
        };

        this.shapes.ground.arrays.texture_coord.forEach(coord => {
            coord[0] *= 12; // scale s coordinate
            coord[1] *= 12; // scale t coordinate
        });

        // *** Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            sky_texture: new Material(new defs.Textured_Phong(),
                {ambient: 1, diffusivity: .1, color: hex_color("#000000"),
                texture: new Texture("assets/sky.jpg", "NEAREST")}),
            start_screen: new Material(new defs.Textured_Phong(),
                {
                    color: hex_color("#000000"),
                    ambient: 1, diffusivity: 0.1, specularity: 0.1,
                    texture: new Texture("assets/Bruinwalk Start.png", "NEAREST")}),
            ack_texture: new Material(new defs.Textured_Phong(),
                {ambient: 1, diffusivity: .1, color: hex_color("#000000"),
                texture: new Texture("assets/ackerman.jpg", "NEAREST")}),
            kerck_texture: new Material(new defs.Textured_Phong(),
                {ambient: 1, diffusivity: .1, color: hex_color("#000000"),
                texture: new Texture("assets/kerck.jpg", "NEAREST")}),
            gene: new Material(new defs.Textured_Phong(), 
                {   ambient: 1, diffusivity: .1, specularity: 0.1,
                    texture: new Texture("assets/text.png", "NEAREST")}),
            flyer1: new Material(new defs.Textured_Phong(),
                    {ambient: 1, diffusivity: .1, specularity: 0.1,
                    texture: new Texture("assets/Flyer1.jpg", "NEAREST")}),
            flyer2: new Material(new defs.Textured_Phong(),
                    {ambient: 1, diffusivity: .1, specularity: 0.1,
                    texture: new Texture("assets/Flyer2.jpg", "NEAREST")}),
            flyer3: new Material(new defs.Textured_Phong(),
                    {ambient: 1, diffusivity: .1, specularity: 0.1,
                    texture: new Texture("assets/Flyer3.jpg", "NEAREST")}),
            flyer4: new Material(new defs.Textured_Phong(),
                    {ambient: 1, diffusivity: .1, specularity: 0.1,
                    texture: new Texture("assets/Flyer4.jpg", "NEAREST")}),
            flyer5: new Material(new defs.Textured_Phong(),
                    {ambient: 1, diffusivity: .1, specularity: 0.1,
                    texture: new Texture("assets/Flyer5.jpg", "NEAREST")}),
            bump: new Material(new defs.Fake_Bump_Map(),
                {   ambient: 1, diffusivity: 0.1, color: hex_color("#000000"),
                    texture: new Texture("assets/Asphalt.png")}),
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
        this.key_triggered_button("Start Game", ["Enter"], () =>{
            this.start_game = true;
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

    draw_flyer(context, program_state, flyer_transform){
        const path_color = hex_color("#e717e7");

        if(this.flyer_size < 7){
            this.flyer_size +=0.2;
        }

        let randomNumber = this.rando;

        switch(randomNumber){
            case 1:
                this.shapes.flyer.draw(context, program_state, flyer_transform.times(Mat4.scale(this.flyer_size, this.flyer_size, this.flyer_size)), this.materials.flyer1);
                break;
            case 2:
                this.shapes.flyer.draw(context, program_state, flyer_transform.times(Mat4.scale(this.flyer_size, this.flyer_size, this.flyer_size)), this.materials.flyer2);
                break;
            case 3:
                this.shapes.flyer.draw(context, program_state, flyer_transform.times(Mat4.scale(this.flyer_size, this.flyer_size, this.flyer_size)), this.materials.flyer3);
                break;
            case 4:
                this.shapes.flyer.draw(context, program_state, flyer_transform.times(Mat4.scale(this.flyer_size, this.flyer_size, this.flyer_size)), this.materials.flyer4);
                break;
            default:
                this.shapes.flyer.draw(context, program_state, flyer_transform.times(Mat4.scale(this.flyer_size, this.flyer_size, this.flyer_size)), this.materials.flyer5);
                break;
        }

        // Draw flyer
        //this.shapes.flyer.draw(context, program_state, flyer_transform.times(Mat4.scale(this.flyer_size, this.flyer_size, this.flyer_size)), this.materials.flyer1);
    }

    draw_lightpost(context, program_state, lightpost_transform) {
        const pole_color = hex_color("#30404f");
        const light_color = hex_color("#eae9a9");
        const banner_color = hex_color("#0058eb");
        
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
        const bench_color = hex_color("#38424c");

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

        walkway_transform = walkway_transform.times(Mat4.scale(2, 0.2, 1)).times(Mat4.translation(0,6, 0));

        // Draw walkway 
        this.shapes.ground.draw(context, program_state, walkway_transform.times(this.walkway_path_transform), this.materials.bump);
        // Draw sky background
         this.shapes.cube.draw(context, program_state, walkway_transform.times(this.sky_transform), this.materials.sky_texture);
    }

    draw_person(context, program_state, model_transform = Mat4.identity()) {
        // Draws a person at the origin, just a rough draft version
        // @model_transform: transformation matrix applied to ALL parts (i.e. if you want to move everything)

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
                // Fix this confusing if statement
                if ((Math.round(this.person_y * 2) == 27) && (this.jumpHeight > 25)){
                    // Remove this
                    console.log('player on starship', this.person_y);
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

        // if there is a collision, stop all movement
        // I guess you can still jump but you won't even be able to see 
        if(this.collision){
            this.moveRight = false; 
            this.moveLeft = false; 
            this.running = false; 
            this.moveForward = false;
            this.moveBackward = false; 
        }

        // Left/Right Movement
        // Once course is done, add bounds so character can't move off the course/offscreen
        if(this.moveRight){
            if (this.person_x < 4.5) {
                this.person_transform = this.person_transform.times(Mat4.translation(0.2, 0, 0));
                this.person_x = this.person_transform[0][3];
            }
        }
        if(this.moveLeft){
            if ( this.person_x > -12.5) {
                this.person_transform = this.person_transform.times(Mat4.translation(-0.2, 0, 0));
                this.person_x = this.person_transform[0][3];
            }
        }
        if(this.moveForward){
            // because inverted z axis 
            // this.person_transform = this.person_transform.times(Mat4.translation(0, 0, -1));
            // this.person_z = this.person_transform[2][3]; 
            // this.sky_transform = this.sky_transform.times(Mat4.translation(0,0,-1));
            this.person_transform = this.person_transform.times(Mat4.translation(0, 0, -0.2));
            this.person_z = this.person_transform[2][3]; 
            this.sky_transform = this.sky_transform.times(Mat4.translation(0,0,-0.2));

        }
        if(this.moveBackward){
            // this.person_transform = this.person_transform.times(Mat4.translation(0, 0, 1));
            // this.person_z = this.person_transform[2][3]; 
            // this.sky_transform = this.sky_transform.times(Mat4.translation(0,0,1));
            this.person_transform = this.person_transform.times(Mat4.translation(0, 0, 0.2));
            this.person_z = this.person_transform[2][3]; 
            this.sky_transform = this.sky_transform.times(Mat4.translation(0,0,0.2));

        }
        if(this.running){
            this.runDist +=1; 
            // translate sky and person
            this.person_transform = this.person_transform.times(Mat4.translation(0, 0, -0.2));
                this.person_z = this.person_transform[2][3];
                this.sky_transform = this.sky_transform.times(Mat4.translation(0,0,-.2));
        }

        // Walking Animation Parameters
        const x = program_state.animation_time / 1000;
        let max_angle = Math.PI / 5;
        let swing_seconds = 2;
        let t = max_angle * Math.sin((2 * Math.PI / swing_seconds) * x);
        let t_reverse = max_angle * Math.sin((2 * Math.PI / swing_seconds) * x + Math.PI);

        // Walking Animation
        if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight || this.running) {
            person.arms_transformL = person.arms_transformL
                .times(Mat4.translation(0, 2, 0))
                .times(Mat4.rotation(t, 1, 0, 0))
                .times(Mat4.translation(0, -2, 0));
            person.arms_transformR = person.arms_transformR
                .times(Mat4.translation(0, 2, 0))
                .times(Mat4.rotation(t_reverse, 1, 0, 0))
                .times(Mat4.translation(0, -2, 0));
            person.legs_transformL = person.legs_transformL
                .times(Mat4.translation(0, 2.25, 0))
                .times(Mat4.rotation(t_reverse, 1, 0, 0))
                .times(Mat4.translation(0, -2.25, 0));         
            person.legs_transformR = person.legs_transformR
                .times(Mat4.translation(0, 2.25, 0))
                .times(Mat4.rotation(t, 1, 0, 0))
                .times(Mat4.translation(0, -2.25, 0));
        }

        person.head_transform = person.head_transform.times(Mat4.scale(1,1,.75));
        person.torso_transform =  person.torso_transform.times(Mat4.scale(1, 1.5, .5));
        person.arms_transformL = person.arms_transformL.times(Mat4.scale(.5, 2, .5));
        person.arms_transformR = person.arms_transformR.times(Mat4.scale(.5, 2, .5));
        person.legs_transformL = person.legs_transformL.times(Mat4.scale(.5, 2.25, .5));
        person.legs_transformR = person.legs_transformR.times(Mat4.scale(.5, 2.25, .5));

        let rounded_person_z = Math.round(model_transform[2][3]);
        let collision = false; 
        this.on_starship = false; 

        // Check Staship Collisions //
        //    check within a 4 unit radius if there is a collision in z 
        for(let i = 0; i < 4; i++){
            const key = rounded_person_z -2 + i; 
            // check if key-value pair exists in starship_locations, assign to starship_x
            if(this.starship_locations.get(key)){
                let starship_x = Math.round(this.starship_locations.get(key));
                let rounded_person_x = Math.round(model_transform[0][3]) ;

                // check if collision within 3 unit radius 
                for(let i = 0; i < 6; i++){
                    if(rounded_person_x - 3 + i === starship_x){ 
                        collision = true; 
                        this.collision = true; 
                        if (this.isJumping){
                            if ( this.person_y > 13) {
                                collision = false; 
                                this.collision = false; 
                                this.on_starship = true; 
                            }
                        }
                    }
                }
            }
        } 

        // Check Flyer Collisions //
        // check if flyer person is in front of person with certain range
        for( let i = 0; i < 5; i ++){
            let key = rounded_person_z - i;
            //let key = rounded_person_z; 
            //console.log('mykey', key);
            if(this.flyerperson_info.has(key)){ 
                // console.log('collision at z = ', key);
                // collision = true; 
                let flyer_x = this.flyerperson_info.get(key).x_pos;
                let rounded_person_x = Math.round(model_transform[0][3]);
                console.log('flyer ', flyer_x, ' person ', rounded_person_x);
                for( let i = 0; i < 6; i++){
                    if( Math.round(flyer_x - 3 + i) == rounded_person_x){
                        collision = true; 
                        this.collision = true; 
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
            this.shapes.cube.draw(context, program_state, person.head_transform,  this.materials.start_screen);
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

    draw_flyerperson2(context, program_state, model_transform){
        // Draws a flyer person at certain locations, just a rough draft version
       // @model_transform: transformation matrix applied to ALL parts (i.e. if you want to move everything)

        // set the key to z axis as it is somewhat unique and won't change throughout
            let key = model_transform[2][3];
            console.log('key at', key);
        // check if the player is within a certain distance
        if( (this.person_z - model_transform[2][3]) < 10){
            // if not in map and in range
            // if (!target.has(key))
            if(!this.flyerperson_info.has(key)){
                // add flyerperson2 to map
                console.log('initialize map');
                this.flyerperson_info.set(key, {progress: 0, turned: false, x_pos: model_transform[0][3]}); 
            } else { // if they are initialized -> movement cycle has started 
                let flyerP = this.flyerperson_info.get(key);
                //let oldProgress = flyerP.progress;
                if ( flyerP.turned == false && flyerP.progress < 20){
                    // translate that guy
                    model_transform = model_transform.times(Mat4.translation(-0.2 * flyerP.progress, 0, 0));
                    flyerP.progress += 1; 
                    // update stored x component
                    flyerP.x_pos = model_transform[0][3];
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
       //person.torso_transform =  person.torso_transform.times(Mat4.scale(1, 1.5, .5));
       person.torso_transform =  person.torso_transform.times(Mat4.scale(0.5, 1.5, 1));
       person.arms_transformL = person.arms_transformL.times(Mat4.scale(.5, 2, .5));
       person.arms_transformR = person.arms_transformR.times(Mat4.scale(.5, 2, .5));
       person.flyer_transform = person.flyer_transform.times(Mat4.scale(0.1, 1, 0.75));
       person.legs_transformL = person.legs_transformL.times(Mat4.scale(.5, 2.25, .5));
       person.legs_transformR = person.legs_transformR.times(Mat4.scale(.5, 2.25, .5));

       //this.shapes.sphere.draw(context, program_state, temp_trans.times(person.head_transform), this.materials.plastic.override(white));
       // if turned, add texture to face, eventually change this texture to something funny
       if(this.flyerperson_info.has(key) && this.flyerperson_info.get(key).turned == true){
            this.shapes.cube.draw(context, program_state, person.head_transform, this.materials.gene);
       } else {
            this.shapes.cube.draw(context, program_state, person.head_transform, this.materials.plastic.override(white));
       }

       //this.shapes.cube.draw(context, program_state, temp_trans.times(person.head_transform), this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.torso_transform, this.materials.plastic.override(black));
        this.shapes.cube.draw(context, program_state, person.arms_transformR, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.flyer_transform, this.materials.plastic.override(green));
        this.shapes.cube.draw(context, program_state, person.arms_transformL, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.legs_transformR, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.legs_transformL, this.materials.plastic.override(white));
    }

    // draw_scene(context, program_state, scene_translation = Mat4.identity()){
    //     // @scene_translation: transformation matrix applied to ALL parts (i.e. if you want to move everything)
        
    //     // Walkway (& Ground)
    //     this.draw_walkway(context, program_state, scene_translation);
    //     // Lightpost 
    //     let lightpost_pos = Mat4.translation(-17, 15, 0);
    //     let lightpost_pos_flip = Mat4.translation(17, 15, 0);
    //     let lp_scale = Mat4.scale(2, 2, 1);
    //     // Bench 
    //     let bench_pos = Mat4.translation(-15, 3, 5);
    //     let bench_pos_flip = Mat4.translation(15, 3, 5);
    //     let b_scale = Mat4.scale(2, 2, 2);
    //     // Trees 
    //     let tree_pos = Mat4.translation(-27, 16, 1);
    //     let tree_pos_flip = Mat4.translation(27, 16, 1);
    //     let t_scale = Mat4.scale(2, 2, 2);
    //     // Set how many rows of objects (lightpost, bench, trees) you want to duplicate
    //     let rows = 4;
    //     for (let i = 0; i < rows; i++) 
    //     {
    //         let move_z = -20*i; // how far to iterate in the distance
            
    //         this.draw_lightpost(context, program_state, lightpost_pos
    //             .times(Mat4.translation(0, 0, move_z)).times(scene_translation).times(lp_scale));
    //         this.draw_lightpost(context, program_state, lightpost_pos_flip
    //             .times(Mat4.translation(0, 0, move_z)).times(scene_translation).times(lp_scale));                
    //         this.draw_bench(context, program_state, bench_pos
    //             .times(Mat4.translation(0, 0, move_z)).times(scene_translation).times(b_scale));
    //         this.draw_bench(context, program_state, bench_pos_flip
    //             .times(Mat4.translation(0, 0, move_z)).times(scene_translation).times(b_scale).times(Mat4.scale(-1,1,1)));
    //         // Draw twice as many trees
    //         this.draw_tree(context, program_state, tree_pos
    //             .times(Mat4.translation(0, 0, move_z)).times(scene_translation).times(t_scale)); 
    //         this.draw_tree(context, program_state, tree_pos
    //             .times(Mat4.translation(0, 0, move_z + 10*i)).times(scene_translation).times(t_scale)); 
    //         this.draw_tree(context, program_state, tree_pos_flip
    //             .times(Mat4.translation(0, 0, move_z)).times(scene_translation).times(t_scale)); 
    //         this.draw_tree(context, program_state, tree_pos_flip
    //             .times(Mat4.translation(0, 0, move_z + 10*i)).times(scene_translation).times(t_scale));    
    //     for (let i = 1; i < 4; i++) {
    //         this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation));
    //         let move_lightpost = Mat4.translation(0,0,-20*i);
    //         let flip_lightpost = Mat4.translation(20,0,-5);
    //         this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lightpost));
    //         this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(flip_lightpost));
    //         this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(flip_lightpost).times(move_lightpost));
    //     }
    // }

    draw_scene_ack(context, program_state, scene_translation = Mat4.identity()) {
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
            if (bench_pos[2][3] < this.person_z +10) {
                this.draw_bench(context, program_state, bench_pos);
            }
            let move_bench = Mat4.translation(0,0,-20*i);
            let flip_bench = Mat4.translation(22,0,2).times(Mat4.scale(-1,1,1));

            if (bench_pos.times(scene_translation).times(move_bench)[2][3] < this.person_z + 10) {
                this.draw_bench(context, program_state, bench_pos.times(scene_translation).times(move_bench));
                this.draw_bench(context, program_state, bench_pos.times(scene_translation).times(flip_bench));
                this.draw_bench(context, program_state, bench_pos.times(scene_translation).times(flip_bench).times(move_bench));
            }

        }

        for (let i = 1; i < 4; i++) {
            if (this.lightpost_pos[2][3] < this.person_z+10) {
                this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation));

            }
                let move_lightpost = Mat4.translation(0,0,-20*i);
                let flip_lightpost = Mat4.translation(20,0,-5);
                if (this.lightpost_pos.times(scene_translation).times(move_lightpost)[2][3] < this.person_z+10) {
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lightpost));
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(flip_lightpost));
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(flip_lightpost).times(move_lightpost));
        
                }
        }



        //right now Ackerman is 40 units long I think
        let ack_pos = Mat4.translation(19,12,-2).times(Mat4.rotation(Math.PI/40,0,-1,0)).times(scene_translation).times(Mat4.scale(5,12,10));
        if (ack_pos[2][3] < this.person_z +10) {
            this.shapes.cube.draw(context, program_state, ack_pos, this.materials.ack_texture);
        }
        ack_pos =  ack_pos.times(Mat4.translation(0,0,-2));
        if (ack_pos[2][3] < this.person_z +10) {
            this.shapes.cube.draw(context, program_state, ack_pos, this.materials.ack_texture);
        }        
        ack_pos =  ack_pos.times(Mat4.translation(0,0,-2));
        if (ack_pos[2][3] < this.person_z +10) {
            this.shapes.cube.draw(context, program_state, ack_pos, this.materials.ack_texture);
        }



        //Background: More trees behind all the trees
        let floor_pos = Mat4.translation(-38,-.5,-30).times(Mat4.scale(15,1,50));
        this.shapes.cube.draw(context, program_state, floor_pos, this.materials.plastic.override( {color: hex_color("#493527")}));

        let forest_trans = Mat4.translation(-8,-2,-11);

        let tree_scale = Mat4.scale(1.5,2,1.5);

        for (var i = 0; i < 10; i++) {
            let move_forest = Mat4.translation(0,0,-6*i);
            if (tree2_pos.times(forest_trans).times(move_forest).times(scene_translation)[2][3] < this.person_z + 10) {
                this.draw_tree(context, program_state, tree2_pos.times(forest_trans).times(move_forest).times(scene_translation).times(tree_scale));
            }
        }
        forest_trans = Mat4.translation(-15,-2,-8);
        for (var i = 0; i < 10; i++) {
            let move_forest = Mat4.translation(0,0,-6*i);
            if (tree2_pos.times(forest_trans).times(move_forest).times(scene_translation)[2][3] < this.person_z + 10) {
                this.draw_tree(context, program_state, tree2_pos.times(forest_trans).times(move_forest).times(scene_translation).times(tree_scale));
            }
        }



    }

    draw_scene_kerck(context, program_state, scene_translation = Mat4.identity()) {
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
            if (bench_pos[2][3] < this.person_z +10) {
                this.draw_bench(context, program_state, bench_pos);
            }
            let move_bench = Mat4.translation(0,0,-20*i);
            let flip_bench = Mat4.translation(22,0,2).times(Mat4.scale(-1,1,1));

            if (bench_pos.times(scene_translation).times(move_bench)[2][3] < this.person_z + 10) {
                this.draw_bench(context, program_state, bench_pos.times(scene_translation).times(move_bench));
                this.draw_bench(context, program_state, bench_pos.times(scene_translation).times(flip_bench));
                this.draw_bench(context, program_state, bench_pos.times(scene_translation).times(flip_bench).times(move_bench));
            }

        }

        for (let i = 1; i < 4; i++) {
            if (this.lightpost_pos[2][3] < this.person_z+10) {
                this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation));

            }
                let move_lightpost = Mat4.translation(0,0,-20*i);
                let flip_lightpost = Mat4.translation(20,0,-5);
                if (this.lightpost_pos.times(scene_translation).times(move_lightpost)[2][3] < this.person_z+10) {
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lightpost));
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(flip_lightpost));
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(flip_lightpost).times(move_lightpost));
        
                }
        }

        let lawn_trans = Mat4.translation(23,2,-27).times(Mat4.rotation(Math.PI/2.5,0,0,-1)).times(Mat4.scale(.1,10,50));
        this.shapes.cube.draw(context, program_state, scene_translation.times(lawn_trans), this.materials.plastic.override( {color: hex_color("#00ff00")}))
        let step_trans = Mat4.translation(20,2.2,-45).times(Mat4.scale(1,.5,10));
        for (var i = 0; i < 5; i++) {
            this.shapes.cube.draw(context, program_state, scene_translation.times(step_trans), this.materials.plastic.override( {color: hex_color("#474a52")}))
            step_trans = step_trans.times(Mat4.translation(2,2,0));
            this.shapes.cube.draw(context, program_state, step_trans, this.materials.plastic.override( {color: hex_color("#474a52")}))
        }

        let building_trans = Mat4.translation(37,20,-45).times(Mat4.scale(8,15,10));
        this.shapes.cube.draw(context, program_state, scene_translation.times(building_trans), this.materials.kerck_texture);
        let double_building = Mat4.translation(1,0,0)
        this.shapes.cube.draw(context, program_state, scene_translation.times(building_trans).times(double_building), this.materials.kerck_texture);

        

        //Background: More trees behind all the trees
        let floor_pos = Mat4.translation(-38,-.5,-30).times(Mat4.scale(15,1,50));
        this.shapes.cube.draw(context, program_state, floor_pos, this.materials.plastic.override( {color: hex_color("#493527")}));

        let forest_trans = Mat4.translation(-8,-2,-11);

        let tree_scale = Mat4.scale(1.5,2,1.5);

        for (var i = 0; i < 10; i++) {
            let move_forest = Mat4.translation(0,0,-6*i);
            if (tree2_pos.times(forest_trans).times(move_forest).times(scene_translation)[2][3] < this.person_z + 10) {
                this.draw_tree(context, program_state, tree2_pos.times(forest_trans).times(move_forest).times(scene_translation).times(tree_scale));
            }
        }
        forest_trans = Mat4.translation(-15,-2,-8);
        for (var i = 0; i < 10; i++) {
            let move_forest = Mat4.translation(0,0,-6*i);
            if (tree2_pos.times(forest_trans).times(move_forest).times(scene_translation)[2][3] < this.person_z + 10) {
                this.draw_tree(context, program_state, tree2_pos.times(forest_trans).times(move_forest).times(scene_translation).times(tree_scale));
            }
        }



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

    draw_start_screen(context, program_state, model_transform = Mat4.identity()){
        model_transform = model_transform.times(Mat4.scale(10, 10, 0.5))
        this.shapes.cube.draw(context, program_state, model_transform, this.materials.start_screen);
    }



    display(context, program_state) {
        super.display(context, program_state);

                // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.
        //this.start_game = true;
        if(!this.start_game){
            const initial_camera_position = Mat4.translation(0, 0, -30);

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

            // Player
            this.draw_start_screen(context, program_state, Mat4.identity())
        }
        else {
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

        let move_scene = Mat4.translation(0,0,0);

        this.draw_scene_ack(context, program_state, move_scene);
        if ( this.person_z < -10) {
            move_scene = Mat4.translation(0,0,-80);
            this.draw_scene_kerck(context, program_state, move_scene);
        }


       
       let bot_motion = Mat4.translation(6.5*Math.sin(Math.PI/3 * t),0,0);

       if (this.bot_transform.times(bot_motion)[2][3] < this.person_z+10) { 
        this.draw_starship(context, program_state, this.bot_transform);
       }

       //stationary starship for collision testing
       bot_motion = Mat4.translation(-1*6.5*Math.sin(Math.PI/3 * t),0,-15);
       if (this.bot_transform.times(bot_motion)[2][3] < this.person_z+10) { 
        this.draw_starship(context, program_state, this.bot_transform.times(bot_motion));
       }
       bot_motion = Mat4.translation(6.5*Math.sin(Math.PI/3 * t+this.rand_position),0,-30);
       if (this.bot_transform.times(bot_motion)[2][3] < this.person_z+10) { 
        this.draw_starship(context, program_state, this.bot_transform.times(bot_motion));
       }
       
        let flyerperson_motion = Mat4.translation(0,0,2*Math.sin(Math.PI * t * this.rand_position/4.0));

        // be warned, for collision, flyerperson2 requires the input of a key, don'tdo any duplicates 
        //this.draw_flyerperson2(context, program_state, this.flyerperson_transform.times(Mat4.translation(0, 0, -12)));
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

       // if there is collision, present flyer to camera 
       // maybe place this inside the previous if statement
       if(this.collision){
            this.draw_flyer(context, program_state, this.person_transform.times(Mat4.translation(0, 0, 1)));
       }
    }
}
}