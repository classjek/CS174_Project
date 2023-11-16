import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene,
} = tiny;

class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

//NEW SHAPES
class Rectangle extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -2, 1], [1, -2, 1], [-1, -2, 1], [1, -2, 1], [1, 2, 1], [-1, 2, -1], [1, 2, 1], [-1, 2, 1],
            [-1, -2, -1], [-1, -2, 1], [-1, 2, -1], [-1, 2, 1], [1, -2, 1], [1, -2, -1], [1, 2, 1], [1, 2, -1],
            [-1, -2, 1], [1, -2, 1], [-1, 2, 1], [1, 2, 1], [1, -2, -1], [-1, -2, -1], [1, 2, -1], [-1, 2, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

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
        this.person_transform = Mat4.translation(0, 10, 5);

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

        // Event listeners for x and z movement
        document.addEventListener('keydown', (event) => {
            if (event.key === 'd'){
                this.moveRight = true;
            }
            if (event.key === 'a'){
                this.moveLeft = true; 
            }
            if(event.key === 'w'){
                this.moveFoward = true; 
            }
            if(event.key === 's'){
                this.moveBackward = true; 
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
            'rectangle': new Rectangle(),
            'walkway': new Walk(),
            'trapezoid': new Trapezoid(),
            'cylinder': new defs.Cylindrical_Tube(10,10),
            'triangle': new defs.Triangle(),
            'sphere': new defs.Subdivision_Sphere(4),
            'cone': new defs.Rounded_Closed_Cone(20,20)

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
        };
        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());
    }

    display(context, program_state) {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(5, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.
        const light_position = vec4(5, 30, 20, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}

export class BruinRun extends Base_Scene {
    /**
     * This Scene object can be added to any display canvas.
     * We isolate that code so it can be experimented with on its own.
     * This gives you a very small code sandbox for editing a simple scene, and for
     * experimenting with matrix transformations.
     */

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
            this.running = true; 
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
            pole: Mat4.rotation(Math.PI/2,5,0,0).times(Mat4.scale(.4,.4,10,1)),
            light: Mat4.translation(0,5,0).times(Mat4.rotation(Math.PI,0,-1,1)).times(Mat4.scale(1.2,1.3,1.5)),
            banner1: Mat4.translation(1.7,2,0).times(Mat4.scale(1.2,1,.05)),
            banner2: Mat4.translation(-1.7,2,0).times(Mat4.scale(1.2,1,.05)),
        }

        this.shapes.cylinder.draw(context, program_state, lightpost_transform.times(lightpost.pole), this.materials.plastic.override( {color: pole_color}))
        this.shapes.cone.draw(context, program_state, lightpost_transform.times(lightpost.light), this.materials.plastic.override( {color: light_color}))

        this.shapes.rectangle.draw(context, program_state, lightpost_transform.times(lightpost.banner1), this.materials.plastic.override( {color: banner_color}))
        this.shapes.rectangle.draw(context, program_state, lightpost_transform.times(lightpost.banner2), this.materials.plastic.override( {color: banner_color}))

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

    draw_walkway(context, program_state, walkway_transform)  {
        //THIS DRAWS A STATIC WALKWAY

        const gray = hex_color("#bebebe");
        let w_Sc = Mat4.scale(8,3,0,1);
        let w_Tr = Mat4.translation(-4,0,0,1);
        walkway_transform = walkway_transform.times(w_Tr).times(w_Sc);
        this.shapes.walkway.draw(context, program_state, walkway_transform, this.materials.plastic.override({color: gray}));

        //SKY
        let sky_transform = Mat4.identity();
        const blue = hex_color("#1a9ffa");
        let sky_Tr = Mat4.translation(-4,20,-4,1);
        let sky_Sc = Mat4.scale(5,15,1,1);
        let sky_Rt = Mat4.rotation(Math.PI/2, 0, 0, 1);
        sky_transform = sky_transform.times(sky_Tr).times(sky_Rt).times(sky_Sc);
        this.shapes.rectangle.draw(context, program_state, sky_transform, this.materials.plastic.override({color: blue}));

        //BUSHES
        let bush1_transform = Mat4.identity();
        let bush1_Tr = Mat4.translation(-17,-8.5,3,1);
        let bush1_Rt = Mat4.rotation(-Math.PI/3.9,0,0,1);
        let bush1_Sc = Mat4.scale(.8,6.5,1,1)
        bush1_transform = bush1_transform.times(bush1_Rt).times(bush1_Tr).times(bush1_Sc);
        this.shapes.rectangle.draw(context, program_state, bush1_transform, this.materials.plastic.override( {color: hex_color("#0a4915")}));

        let bush2_Tr = Mat4.translation(11, -2, 3, 1);
        let bush2_Rt = Mat4.rotation(Math.PI/3.9,0,0,1);
        let bush2_Sc = bush1_Sc;
        let bush2_transform = Mat4.identity();
        bush2_transform = bush2_transform.times(bush2_Rt).times(bush2_Tr).times(bush2_Sc);
        this.shapes.rectangle.draw(context, program_state, bush2_transform, this.materials.plastic.override( {color: hex_color("#0a4915")}));


        //ACKERMAN
        let ack_trans = Mat4.identity();
        let ack_Sc = Mat4.scale(10,8,1,1);
        let ack_Tr = Mat4.translation(16,11,-.1,1);
        let ack_Rt = Mat4.rotation(Math.PI/2,0,0,1);
        ack_trans = ack_trans.times(ack_Tr).times(ack_Sc).times(ack_Rt);
            //TODO: should stripe the colors w/ red so it actually looks like Ackerman
        this.shapes.trapezoid.draw(context, program_state, ack_trans, this.materials.plastic.override( {color: hex_color("#e0d7b2")}));

    }

    draw_person(context, program_state, model_transform = Mat4.identity()) {
        // Draws a person at the origin, just a rough draft version
        // @model_transform: transformation matrix applied to ALL parts (i.e. if you want to move everything)

        // Jumping 
        if (this.isJumping){
            this.jumpHeight += 1; 
            // reached max jump height-> reset jump flag and height, later make it so the person falls back down
            if (this.jumpHeight > 30){
                this.isJumping = false; 
                this.jumpHeight = 0;
            }
            model_transform = model_transform.times(Mat4.translation(0, 8 * Math.sin(Math.PI * this.jumpHeight/30), 0));
        }

        const blue = hex_color("#1a9ffa"), yellow = hex_color("#fdc03a");

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
        }
        if(this.moveBackward){
            this.person_transform = this.person_transform.times(Mat4.translation(0, 0, 1));
        }
        if(this.running){
            // add more to this function once collision detection is done
            this.runDist +=1; 
            // limit dictates run distance 
            if(this.runDist < 500){
                // Last parameter dictates speed
                this.person_transform = this.person_transform.times(Mat4.translation(0, 0, -0.2));
            }
        }

        person.head_transform = person.head_transform.times(Mat4.scale(1,1,.75));
        person.torso_transform =  person.torso_transform.times(Mat4.scale(1, 1.5, .5));
        person.arms_transformL = person.arms_transformL.times(Mat4.scale(.5, 2, .5));
        person.arms_transformR = person.arms_transformR.times(Mat4.scale(.5, 2, .5));
        person.legs_transformL = person.legs_transformL.times(Mat4.scale(.5, 2.25, .5));
        person.legs_transformR = person.legs_transformR.times(Mat4.scale(.5, 2.25, .5));

        // Drawing the body
        this.shapes.cube.draw(context, program_state, person.head_transform, this.materials.plastic.override(yellow));
        this.shapes.cube.draw(context, program_state, person.torso_transform, this.materials.plastic.override(blue));
        this.shapes.cube.draw(context, program_state, person.arms_transformR, this.materials.plastic.override(yellow));
        this.shapes.cube.draw(context, program_state, person.arms_transformL, this.materials.plastic.override(yellow));
        this.shapes.cube.draw(context, program_state, person.legs_transformR, this.materials.plastic.override(yellow));
        this.shapes.cube.draw(context, program_state, person.legs_transformL, this.materials.plastic.override(yellow));
    }

    display(context, program_state) {
        super.display(context, program_state);

        let walkway_transform = Mat4.identity();
        let temp_tree_trans = Mat4.translation(12,12,2,1);
        let temp_tree_2 = Mat4.translation(-21, 12, 2,1);
        let temp_bench_location = Mat4.translation(-14,4,5);

        let temp_lightpost = Mat4.translation(-13.8,10,4).times(Mat4.scale(.8,.8,.8));

        this.draw_lightpost(context, program_state, temp_lightpost);

        this.draw_tree(context, program_state, temp_tree_2);
        this.draw_tree(context, program_state, temp_tree_trans);

        this.draw_person(context, program_state, this.person_transform);
        this.draw_bench(context, program_state, temp_bench_location);

       this.draw_walkway(context, program_state, walkway_transform);
    //    let desired = Mat4.inverse(this.person_transform.times(Mat4.translation(0, 0, 20)));
    //    program_state.set_camera(desired);
    }
}