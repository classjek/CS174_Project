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
        this.person_transform = Mat4.translation(-4, 10, 10);

        // Initialize walkway so it is one big piece that the character will walk over
        // A little confused here, is this order correct? 
        this.walkway_path_transform = Mat4.rotation(Math.PI/2,1,0,0).times(Mat4.translation(0,-120,-1.5)).times(Mat4.scale(12,150,2));
        this.sky_transform = Mat4.translation(-5,130,-60).times(Mat4.scale(40,130,1));

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
        this.new_scene = false;
        
        // for landing on starships
        this.on_starship = false; 

        // keeps track of starship locations - only x and z matter
        this.starship_locations = new Map();

        //keeps track of flyer persons
        // This map currently has two elements, one to keep track of the flyerperson's x movement and the other to keep track of their rotation
        this.flyerperson_info = new Map();

        // keep track of if a collision has been triggered
        this.collision = false; 
        this.star_collision = false; 
        this.starflyer_delay = 0; 
        this.flyer_size = 0; 
        // used to make the flyer3 person rush the player after starship collision
        this.flyer3_inc = 0; 

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
            'cylinder2': new defs.Rounded_Capped_Cylinder(45,45),
            'triangle': new defs.Triangle(),
            'sphere': new defs.Subdivision_Sphere(4),
            'cone': new defs.Rounded_Closed_Cone(20,20),
            'bot': new defs.Rounded_Capped_Cylinder(35,35),
            'flyer': new Flyer(),
            'map': new Flyer(),
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
            grass_texture: new Material(new defs.Textured_Phong(),
                {ambient: 1, diffusivity: .1, color: hex_color("#000000"),
                texture: new Texture("assets/grass.jpg", "NEAREST")}),
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

        // Used by set_enemies() and draw_enemies()
        this.enemies = [];
        this.set = false;
        this.scene_length = 30;
        this.spacing = 10;
    }
    reset() {
        this.hover = this.swarm = false;

        // Initialize person translation here so position isn't continuously reset 
        this.person_transform = Mat4.translation(0, 10, 10);

        // Initialize walkway so it is one big piece that the character will walk over
        // A little confused here, is this order correct? 
        this.walkway_path_transform = Mat4.rotation(Math.PI/2,1,0,0).times(Mat4.translation(0,-120,-1.5)).times(Mat4.scale(12,150,2));
        this.sky_transform = Mat4.translation(-5,130,-60).times(Mat4.scale(40,130,1));

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
        this.new_scene = false;
        
        // for landing on starships
        this.on_starship = false; 

        // keeps track of starship locations - only x and z matter
        this.starship_locations = new Map();

        //keeps track of flyer persons
        // This map currently has two elements, one to keep track of the flyerperson's x movement and the other to keep track of their rotation
        this.flyerperson_info = new Map();

        // keep track of if a collision has been triggered
        this.collision = false; 
        this.star_collision = false; 
        this.starflyer_delay = 0; 
        this.flyer_size = 0; 

        // for randomization of flyers
        this.rando = Math.floor(Math.random() * 5) + 1;


        this.detach_camera = false;

        // Why are some things here and some things in the Base_Scene constructor?
        this.bot_transform = Mat4.translation(-3,4,0);
        this.flyerperson_transform = Mat4.translation(8,10,7);

        this.lightpost_pos = Mat4.translation(-18,9,0).times(Mat4.scale(1.5,1.5,1.5));
        this.rand_position = Math.floor(Math.random()*6) + 1;

        this.enemies = [];
        this.set = false;
    }

    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.

        this.key_triggered_button("Jump", [" "], () => {
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
        this.key_triggered_button("Restart", ["z"], () =>{
            this.reset();
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

    draw_map(context, program_state, map_transform, person_trans){
        const bg_map_color = hex_color("#e2d8c9");
        const person_marker = hex_color("#ff0000"); 
        const cone_color = hex_color("#ff0000");
        const starship_color = hex_color("#fff8e7");

        //console.log(this.person_z, person_trans[0][3]);
        let move_y = -(this.person_z - 10)/60; 
        let move_x = (person_trans[0][3]+4)/16; 
        let marker_move = Mat4.identity().times(Mat4.translation(move_x, move_y, 0));

        //let star_transform = map_transform.times(Mat4.translation(0, 0, 1)).times(Mat4.scale(0.1, 0.075, 0.2)); 
        //this.shapes.map.draw(context, program_state, star_transform, this.materials.plastic.override({color: starship_color}));
        // Draw Starships
        
        for (const [key, value] of this.starship_locations.entries()) {
            let move_y = -(key - 10)/60; 
            let move_x = (value+4)/16; 
            let starship_move = Mat4.identity().times(Mat4.translation(move_x, move_y, 0));
            //let star_transform = map_transform.times(Mat4.translation(mval + 0.8, mkey, 1)).times(Mat4.scale(0.1, 0.075, 0.2));
            let starship_transform = map_transform.times(starship_move).times(Mat4.translation(0.5, -0.5, 1)).times(Mat4.scale(0.1, 0.1, 0.1));
            this.shapes.map.draw(context, program_state, starship_transform, this.materials.plastic.override({color: starship_color}));
        }

        //draw person 
        let marker_transform = map_transform.times(marker_move).times(Mat4.translation(0.5, -0.5, 1)).times(Mat4.scale(0.1, 0.1, 0.1));
        this.shapes.map.draw(context, program_state, marker_transform, this.materials.plastic.override( {color: person_marker}));
        
        // draw barrier 
        let cone_transform = map_transform.times(Mat4.translation(0, 0.9, 1)).times(Mat4.scale(0.075, 0.05, 0.1)); 
        this.shapes.map.draw(context, program_state, cone_transform.times(Mat4.translation(3, 0, 0)), this.materials.plastic.override({color: cone_color})); 
        this.shapes.map.draw(context, program_state, cone_transform.times(Mat4.translation(6, 0, 0)), this.materials.plastic.override({color: cone_color}));
        this.shapes.map.draw(context, program_state, cone_transform.times(Mat4.translation(9, 0, 0)), this.materials.plastic.override({color: cone_color}));
        this.shapes.map.draw(context, program_state, cone_transform.times(Mat4.translation(12, 0, 0)), this.materials.plastic.override({color: cone_color}));
        this.shapes.map.draw(context, program_state, cone_transform, this.materials.plastic.override({color: cone_color}));
        // draw base map 
        map_transform = map_transform.times(Mat4.scale(0.8, 1, 0.8));
        this.shapes.map.draw(context, program_state, map_transform, this.materials.plastic.override( {color: bg_map_color}));
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
                    //console.log('player on starship', this.person_y);
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

        if (this.new_scene == true) {
            this.running = false;
            this.new_scene = false;
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
                        this.star_collision = true; 
                        if (this.isJumping){
                            if ( this.person_y > 13) {
                                collision = false; 
                                this.collision = false; 
                                this.star_collision = false; 
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
                //console.log('flyer ', flyer_x, ' person ', rounded_person_x);
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
            //console.log('key at', key);
        // check if the player is within a certain distance
        if( (this.person_z - model_transform[2][3]) < 10){
            // if not in map and in range
            // if (!target.has(key))
            if(!this.flyerperson_info.has(key)){
                // add flyerperson2 to map
                //console.log('initialize map');
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

    // flyer person who appears after the player runs into a starship
    // pass in the player's transform so the flyerperson can move to it 
    draw_flyerperson3(context, program_state, person_transform){
        // Draws a flyer person at certain locations, just a rough draft version
       // @model_transform: transformation matrix applied to ALL parts (i.e. if you want to move everything)
        // check if the player is within a certain distance
       const black = hex_color("#000000"), white = hex_color("#FFFFFF"), green = hex_color("#98FB98");

       // make this based off of person_transform so it works at any distance
       let model_transform = Mat4.identity().times(Mat4.translation(5, 10, person_transform[2][3] - 30));

       let isWalking = true; 

       let x_inc = model_transform[0][3] - person_transform[0][3];
       let z_inc = model_transform[2][3] - person_transform[2][3];

        model_transform[0][3] -= this.flyer3_inc * (x_inc/50); 
        model_transform[2][3] -= this.flyer3_inc * (z_inc/50);
        if(this.flyer3_inc < 45){
            this.flyer3_inc += 1; 
        } else {
            isWalking = false; 
        }
       
        let person = {
            head_transform: Mat4.identity().times(Mat4.translation(0, 0, 0)),
            torso_transform: Mat4.identity().times(Mat4.translation(0,-2.5,0)),
            arms_transformL: Mat4.identity().times(Mat4.translation(-1.5, -3, 0)),
            arms_transformR: Mat4.identity().times(Mat4.translation(1.5, -3, 0)),
            legs_transformL: Mat4.identity().times(Mat4.translation(-.5, -6.25, 0)),
            legs_transformR: Mat4.identity().times(Mat4.translation(.5, -6.25, 0)),
            //flyer_transform: Mat4.identity().times(model_transform).times(Mat4.rotation(Math.PI/2, 0, 1, 0)).times(Mat4.translation(0, -6, 1.5)),
        }
       

       for( let matrix in person){
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
       if(isWalking){
        person.arms_transformL = person.arms_transformL
                .times(Mat4.translation(0, 2, 0))
                .times(Mat4.rotation(t, 1, 0, 0))
                .times(Mat4.translation(0, -2, 0));
        person.arms_transformR = person.arms_transformR
                .times(Mat4.translation(0, 2, 0))
                .times(Mat4.rotation(t_reverse, 1, 0, 0))
                .times(Mat4.translation(0, -2, 0));
        person.legs_transformL = person.legs_transformL.times(Mat4.translation(0, 2.25, 0)).times(Mat4.rotation(t_reverse, 1, 0, 0)).times(Mat4.translation(0, -2.25, 0));         
        person.legs_transformR = person.legs_transformR.times(Mat4.translation(0, 2.25, 0)).times(Mat4.rotation(t, 1, 0, 0)).times(Mat4.translation(0, -2.25, 0));
       }

       person.head_transform = person.head_transform.times(Mat4.scale(1,1,1));
       //person.torso_transform =  person.torso_transform.times(Mat4.scale(1, 1.5, .5));
       person.torso_transform =  person.torso_transform.times(Mat4.scale(1, 1.5, 0.5))
       person.arms_transformL = person.arms_transformL.times(Mat4.scale(.5, 2, .5));
       person.arms_transformR = person.arms_transformR.times(Mat4.scale(.5, 2, .5));
       person.legs_transformL = person.legs_transformL.times(Mat4.scale(.5, 2.25, .5));
       person.legs_transformR = person.legs_transformR.times(Mat4.scale(.5, 2.25, .5));

        this.shapes.cube.draw(context, program_state, person.head_transform, this.materials.plastic.override(white));
       //this.shapes.cube.draw(context, program_state, temp_trans.times(person.head_transform), this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.torso_transform, this.materials.plastic.override(black));
        this.shapes.cube.draw(context, program_state, person.arms_transformR, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.arms_transformL, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.legs_transformR, this.materials.plastic.override(white));
        this.shapes.cube.draw(context, program_state, person.legs_transformL, this.materials.plastic.override(white));
    }


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

        for (let i = 1; i < 3; i++) {
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

        for (var i = 0; i < 15; i++) {
            let move_forest = Mat4.translation(0,0,-6*i);
            if (tree2_pos.times(forest_trans).times(move_forest).times(scene_translation)[2][3] < this.person_z + 10) {
                this.draw_tree(context, program_state, tree2_pos.times(forest_trans).times(move_forest).times(scene_translation).times(tree_scale));
            }
        }
        forest_trans = Mat4.translation(-15,-2,-8);
        for (var i = 0; i < 15; i++) {
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

        let move_lights = Mat4.translation(0,0,40);

        for (let i = 1; i < 4; i++) {
            if (this.lightpost_pos[2][3] < this.person_z+10) {
                this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lights));

            }
                let move_lightpost = Mat4.translation(0,0,-20*i);
                let flip_lightpost = Mat4.translation(20,0,-5);
                if (this.lightpost_pos.times(scene_translation).times(move_lightpost)[2][3] < this.person_z+10) {
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lights).times(move_lightpost));
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lights).times(flip_lightpost));
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lights).times(flip_lightpost).times(move_lightpost));
        
                }
        }

        let lawn_trans = Mat4.translation(23,2,-27).times(Mat4.rotation(Math.PI/2.5,0,0,-1)).times(Mat4.scale(.1,10,50));
        this.shapes.cube.draw(context, program_state, scene_translation.times(lawn_trans), this.materials.plastic.override( {color: hex_color("#00ff00")}))
        let step_trans = Mat4.translation(20,2.2,-45).times(Mat4.scale(1,.5,10));
        for (var i = 0; i < 5; i++) {
            this.shapes.cube.draw(context, program_state, scene_translation.times(step_trans), this.materials.plastic.override( {color: hex_color("#474a52")}))
            step_trans = step_trans.times(Mat4.translation(2,2,0));
            this.shapes.cube.draw(context, program_state, scene_translation.times(step_trans), this.materials.plastic.override( {color: hex_color("#474a52")}))
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

        for (var i = 0; i < 15; i++) {
            let move_forest = Mat4.translation(0,0,-6*i);
            if (tree2_pos.times(forest_trans).times(move_forest).times(scene_translation)[2][3] < this.person_z + 10) {
                this.draw_tree(context, program_state, tree2_pos.times(forest_trans).times(move_forest).times(scene_translation).times(tree_scale));
            }
        }
        forest_trans = Mat4.translation(-15,-2,-8);
        for (var i = 0; i < 15; i++) {
            let move_forest = Mat4.translation(0,0,-6*i);
            if (tree2_pos.times(forest_trans).times(move_forest).times(scene_translation)[2][3] < this.person_z + 10) {
                this.draw_tree(context, program_state, tree2_pos.times(forest_trans).times(move_forest).times(scene_translation).times(tree_scale));
            }
        }



    }

    draw_scene_janss(context, program_state, scene_translation = Mat4.identity()) {
        let tree1_pos = Mat4.translation(10,13,1,1);
        let tree2_pos = Mat4.translation(-21, 13, 1,1);

        let trees = [tree1_pos];


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
        })

        let floor_pos = Mat4.translation(33,1,-30).times(Mat4.scale(15,1,50));
        this.shapes.cube.draw(context, program_state, floor_pos, this.materials.plastic.override( {color: hex_color("#493527")}));

        let forest_trans = Mat4.translation(-8,-2,-11);

        let tree_scale = Mat4.scale(1.5,2,1.5);

        for (var i = 0; i < 10; i++) {
            let move_forest = Mat4.translation(50,0,-6*i);
            if (tree2_pos.times(forest_trans).times(move_forest).times(scene_translation)[2][3] < this.person_z + 10) {
                this.draw_tree(context, program_state, tree2_pos.times(forest_trans).times(move_forest).times(scene_translation).times(tree_scale));
            }
        }
        forest_trans = Mat4.translation(47,-2,-8);
        for (var i = 0; i < 10; i++) {
            let move_forest = Mat4.translation(0,0,-6*i);
            if (tree2_pos.times(forest_trans).times(move_forest).times(scene_translation)[2][3] < this.person_z + 10) {
                this.draw_tree(context, program_state, tree2_pos.times(forest_trans).times(move_forest).times(scene_translation).times(tree_scale));
            }
        }


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

        let move_lights = Mat4.translation(0,0,60);

        for (let i = 1; i < 4; i++) {
            if (this.lightpost_pos[2][3] < this.person_z+10) {
                this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lights));

            }
                let move_lightpost = Mat4.translation(0,0,-20*i);
                let flip_lightpost = Mat4.translation(20,0,-5);
                if (this.lightpost_pos.times(scene_translation).times(move_lightpost)[2][3] < this.person_z+10) {
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lights).times(move_lightpost));
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lights).times(flip_lightpost));
                    this.draw_lightpost(context, program_state, this.lightpost_pos.times(scene_translation).times(move_lights).times(flip_lightpost).times(move_lightpost));
        
                }
        }


        //LAWN
        let lawn_trans = Mat4.translation(-55,.5,-65).times(Mat4.scale(30,1,65))
        this.shapes.cube.draw(context, program_state, scene_translation.times(lawn_trans), this.materials.grass_texture);
        lawn_trans = Mat4.translation(-70,-12,-80).times(Mat4.scale(35,35,60)).times(Mat4.rotation(Math.PI/2.2,1,1,0));
        this.shapes.cylinder2.draw(context, program_state, scene_translation.times(lawn_trans), this.materials.grass_texture);


        let tree_1 = Mat4.translation(-40,12,-65).times(Mat4.scale(.8,.8,.8));
        this.draw_tree(context, program_state, scene_translation.times(tree_1))
        tree_1 = Mat4.translation(-43,15,-63);
        this.draw_tree(context, program_state, scene_translation.times(tree_1))

        tree_1 = Mat4.translation(-41,13,-50);
        this.draw_tree(context, program_state, scene_translation.times(tree_1))
        tree_1 = Mat4.translation(-27,10,-48);
        this.draw_tree(context, program_state, scene_translation.times(tree_1))
        tree_1 = Mat4.translation(-52,18,-52).times(Mat4.scale(1.2,1.2,1.2));
        this.draw_tree(context, program_state, scene_translation.times(tree_1))

        tree_1 = Mat4.translation(-43,16,-40);
        this.draw_tree(context, program_state, scene_translation.times(tree_1))
        tree_1 = Mat4.translation(-45,13,-38);
        this.draw_tree(context, program_state, scene_translation.times(tree_1))
        tree_1 = Mat4.translation(-52,18,-40).times(Mat4.scale(1.2,1.2,1.2));
        this.draw_tree(context, program_state, scene_translation.times(tree_1))
        tree_1 = Mat4.translation(-27,10,-20);
        this.draw_tree(context, program_state, scene_translation.times(tree_1))

        tree_1 = Mat4.translation(-43,15,-73);
        this.draw_tree(context, program_state, scene_translation.times(tree_1))
        
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

    set_enemies(scene_length, spacing){
        // Use this function ONCE PER SCENE to set random enemy types and locations
        // @spacing : spacing between enemies

        // reset the enemy maps here 
        this.starship_locations.clear(); 

        this.scene_length = scene_length;
        this.spacing = spacing; 
        this.enemies.length = 0; // clear previous array
        this.set = true;

        for (let i = 0; i < scene_length / spacing; i++) 
        {
            let enemy = Math.floor(Math.random() * 3) + 1;
            let location;

            switch (enemy) {
                case 1: // walking flyerperson
                    location = Math.floor(Math.random()*26);
                    break;
                case 2: // stationary flyerperson
                    location = 0; // not used later on
                    break;
                case 3: // starship
                    location = Math.floor(Math.random()*6) + 1;
                    break;
            }
            this.enemies.push([enemy, location]);
        }
    }

    draw_enemies(context, program_state, t, enemies_trans = Mat4.identity()){
        //console.log(this.enemies);
        for(let i = 0; i < (this.scene_length / this.spacing); i++)
        {
            let z = -1 * i * this.spacing;

            if (this.enemies[i][0] === 1){ // walking flyerperson
                let flyerperson_motion = 2 * Math.sin(Math.PI * t);
                // x moves the person along the z axis, and z moves along the x axis (idk why)
                // +x -> further away, -x -> closer (reverse of the other two z-axis)
                let translation = Mat4.translation((-1 * z) - 5, 0, flyerperson_motion - this.enemies[i][1]);
                this.draw_flyerperson(context, program_state, enemies_trans.times(this.flyerperson_transform).times(translation));
            } 
            else if (this.enemies[i][0] === 2){ // stationary flyerperson
                let translation = Mat4.translation(0, 0, z - 10);
                if (this.flyerperson_transform.times(translation)[2][3] < this.person_z + 10) { // Don't draw if behind person
                    this.draw_flyerperson2(context, program_state, enemies_trans.times(this.flyerperson_transform).times(translation));
                }
            }
            else if (this.enemies[i][0] === 3) // starship
            { 
                let bot_motion = 6.5 * Math.sin(Math.PI / 3 * t + this.enemies[i][1]);
                let translation = Mat4.translation(bot_motion, 0, z);
                if (this.bot_transform.times(translation)[2][3] < this.person_z + 10) { // Don't draw if behind person
                    this.draw_starship(context, program_state, enemies_trans.times(this.bot_transform).times(translation));
                }
            }
        }
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
        this.draw_person(context, program_state, this.person_transform);
        this.draw_walkway(context, program_state, walkway_transform);


        if (this.person_z > -60) {
            let move_scene = Mat4.translation(0,0,0);  
            
            if (!this.set){
                this.set_enemies(60, 15);
            }
            this.draw_enemies(context, program_state, t);
    
            this.draw_scene_ack(context, program_state, move_scene);

            //add barricade
            let poster_trans = Mat4.translation(6,3.8,-65).times(Mat4.rotation(Math.PI/2.5,1,0,0)).times(Mat4.scale(2,.1,2.5));
            this.shapes.cube.draw(context, program_state, poster_trans, this.materials.plastic.override( {color: hex_color("#ff0000")}))
            for (let i = 1; i < 5; i++) {
                poster_trans = poster_trans.times(Mat4.translation(-2.4,0,0));
                this.shapes.cube.draw(context, program_state, poster_trans, this.materials.plastic.override( {color: hex_color("#ff0000")}))
            }
        }
        else if (this.person_z < -60 && this.person_z > -62) {
            this.new_scene = true;
            this.person_transform = this.person_transform.times(Mat4.translation(0,0,-3))
            this.person_z = this.person_transform[2][3];
            this.set = false;
        }
        else if ( this.person_z <= -63 && this.person_z > -125) {
            this.new_scene = false;
            let move_scene = Mat4.translation(0,0,-65);
            let move_enemies = Mat4.translation(65,0,0);

            if (!this.set){
                this.set_enemies(60, 15);
            }
            this.draw_enemies(context, program_state, t, move_enemies);

            this.draw_scene_kerck(context, program_state, move_scene);

                        //add barricade
            let poster_trans = Mat4.translation(6,3.8,-140).times(Mat4.rotation(Math.PI/2.5,1,0,0)).times(Mat4.scale(2,.1,2.5));
            this.shapes.cube.draw(context, program_state, poster_trans, this.materials.plastic.override( {color: hex_color("#ff0000")}))
            for (let i = 1; i < 5; i++) {
                poster_trans = poster_trans.times(Mat4.translation(-2.4,0,0));
                this.shapes.cube.draw(context, program_state, poster_trans, this.materials.plastic.override( {color: hex_color("#ff0000")}))
            }
        }
        else if (this.person_z < -125 && this.person_z > -126) {
            this.new_scene = true;
            this.person_transform = this.person_transform.times(Mat4.translation(0,0,-3))
            this.person_z = this.person_transform[2][3];
            this.sky_transform = this.sky_transform.times(Mat4.translation(0,0,-6));
            this.set = false;
        }
        else if (this.person_z <= -127 && this.person_z > -170) {
            this.new_scene = false;
            let move_scene = Mat4.translation(0,0,-135);

            let move_enemies = Mat4.translation(135,0,0);
            if (!this.set){
                this.set_enemies(50, 15);
            }
            this.draw_enemies(context, program_state, t, move_enemies);

            this.draw_scene_janss(context, program_state, move_scene);
        }
        else {
            //END GAME
            this.running = false;
            this.moveForward = false;
        }

        // Spawn enemies
        // Haven't yet programmed people not hitting tables, but may can adjust spacing? 
        // if (!this.set){
        //     this.set_enemies(60, 15);
        // }
        // this.draw_enemies(context, program_state, t);
       
       if(!this.detach_camera){
            //Use the default camera position
            program_state.set_camera(Mat4.inverse(this.person_transform.times(Mat4.translation(0, 0, 20)))); 
            
            // draw map 
            this.draw_map(context, program_state, this.person_transform.times(Mat4.translation(-4, -2, 12)), this.person_transform);
       }

       // if there is collision, present flyer to camera 
       // maybe place this inside the previous if statement
       if(this.collision){
            // if collision, render flyer. Have a delay if the player ran into a starship 
            if(this.star_collision){
                if(this.starflyer_delay < 50){
                    this.draw_flyerperson3(context, program_state, this.person_transform);
                    this.starflyer_delay += 1; 
                } else {
                    this.draw_flyer(context, program_state, this.person_transform.times(Mat4.translation(0, 0, 1)));
                    this.draw_flyerperson3(context, program_state, this.person_transform);
                }
            } else {
                this.draw_flyer(context, program_state, this.person_transform.times(Mat4.translation(0, 0, 1)));
            }
       }
    }
}
}