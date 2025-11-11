"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CarController extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = ƒ.Component.registerSubclass(CarController); }
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CarController added to ";
            this.player = false;
            this.speed = 0;
            this.acceleration = 0.000001;
            this.breakFactor = 0.7;
            this.frictionFactor = 0.8;
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
                        this.setup();
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            this.setup = () => {
                this.wheels = this.node.getChildren().slice(0, 4);
            };
            this.update = (_event) => {
                //speed
                const transform = this.node.getComponent(ƒ.ComponentTransform);
                if (Input.isInputPressed("accelerate")) {
                    this.speed += this.acceleration * ƒ.Loop.timeFrameReal / 10000;
                }
                else {
                    if (Math.abs(this.speed) < 0.003) {
                        this.speed = 0;
                    }
                }
                if (this.speed != 0) {
                    console.log(this.speed);
                    if (Input.isInputPressed("break")) {
                        this.speed -= Math.sign(this.speed) * this.breakFactor * ƒ.Loop.timeFrameReal / 1000;
                    }
                    else {
                        this.speed -= this.speed * Math.sign(this.speed) * this.frictionFactor * ƒ.Loop.timeFrameReal / 1000;
                    }
                    if (Math.abs(this.speed) > 1) {
                        this.speed = Math.sign(this.speed);
                    }
                }
                //turning
                const mouseDistanceToCenterX = Input.mouseCoordinates.x - Script.viewport.canvas.width / 2;
                if (Math.abs(mouseDistanceToCenterX) > 50) {
                    if (this.speed != 0) {
                        let turnAngle = -0.003 * (mouseDistanceToCenterX - Math.sign(mouseDistanceToCenterX) * 100);
                        if (Math.abs(turnAngle) > 1) {
                            turnAngle = Math.sign(turnAngle);
                        }
                        transform.mtxLocal.rotateY(turnAngle);
                    }
                    for (let i = 0; i < 2; i++) {
                        const pivot = this.wheels[i].getComponent(ƒ.ComponentMesh).mtxPivot;
                        pivot.rotateX(Input.mouseDifference.x / 2);
                    }
                }
                else {
                    for (let i = 0; i < 2; i++) {
                        const pivot = this.wheels[i].getComponent(ƒ.ComponentMesh).mtxPivot;
                        pivot.rotateX(-pivot.rotation.x / 3);
                    }
                }
                transform.mtxLocal.translateZ(this.speed);
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    Script.CarController = CarController;
})(Script || (Script = {}));
var Input;
(function (Input) {
    const registeredActions = [];
    const activeActions = [];
    let lastActiveActions = [];
    let inputMap;
    Input.mouseDifference = { x: 0, y: 0 };
    Input.mouseCoordinates = { x: 0, y: 0 };
    Input.mouseMoved = false;
    Input.lastMouseCoords = { x: 0, y: 0 };
    function setup(_inputMap) {
        inputMap = _inputMap;
        createRegisteredInputList();
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("mousemove", handleMouseMove);
    }
    Input.setup = setup;
    function createRegisteredInputList() {
        for (const input of inputMap) {
            registeredActions.push(input);
        }
    }
    function updateBuffer() {
        lastActiveActions = activeActions.slice(0, activeActions.length);
        if (Input.mouseMoved) {
            Input.mouseDifference = { x: Input.mouseCoordinates.x - Input.lastMouseCoords.x, y: Input.mouseCoordinates.y - Input.lastMouseCoords.y };
            //console.log(mouseDifference)
            Input.lastMouseCoords.x = Input.mouseCoordinates.x;
            Input.lastMouseCoords.y = Input.mouseCoordinates.y;
            Input.mouseMoved = false;
        }
        else {
            Input.mouseDifference = { x: 0, y: 0 };
        }
    }
    Input.updateBuffer = updateBuffer;
    function handleKeyDown(_event) {
        const foundRegistered = registeredActions.find((_action) => { return _action.key == _event.key; });
        const foundActive = activeActions.find((_action) => { return _action.key == _event.key; });
        //console.log(activeActions.includes(foundRegistered!))
        if (foundRegistered !== undefined && foundActive === undefined) {
            activeActions.push(registeredActions.find(_action => _action.key === _event.key));
        }
    }
    function handleKeyUp(_event) {
        const foundAction = activeActions.find(_element => _element.key === _event.key);
        if (foundAction !== undefined) {
            activeActions.splice(activeActions.indexOf(foundAction), 1);
        }
    }
    function handleMouseMove(_event) {
        Input.mouseCoordinates.x = _event.clientX;
        Input.mouseCoordinates.y = _event.clientY;
        Input.mouseMoved = true;
    }
    function isInputJustPressed(_recievedActionName) {
        if (activeActions.find(_element => _element.actionName === _recievedActionName) && !lastActiveActions.find(_element => _element.actionName === _recievedActionName)) {
            return true;
        }
        else {
            return false;
        }
    }
    Input.isInputJustPressed = isInputJustPressed;
    function isInputJustReleased(_recievedActionName) {
        if (!activeActions.find(_element => _element.actionName === _recievedActionName) && lastActiveActions.find(_element => _element.actionName === _recievedActionName)) {
            return true;
        }
        else {
            return false;
        }
    }
    Input.isInputJustReleased = isInputJustReleased;
    function isInputPressed(_recievedActionName) {
        if (activeActions.find(_element => _element.actionName === _recievedActionName)) {
            return true;
        }
        else {
            return false;
        }
    }
    Input.isInputPressed = isInputPressed;
})(Input || (Input = {}));
var Input;
(function (Input) {
    Input.playerInputMap = [
        { actionName: "left", key: "a" },
        { actionName: "right", key: "d" },
        { actionName: "accelerate", key: "w" },
        { actionName: "break", key: "s" },
        { actionName: "reverse", key: " " }
    ];
})(Input || (Input = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    document.addEventListener("interactiveViewportStarted", start);
    const cars = [];
    function start(_event) {
        Script.viewport = _event.detail;
        Input.setup(Input.playerInputMap);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        document.addEventListener("mousedown", onClick);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        spawnRandomCars();
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        Input.updateBuffer();
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    async function spawnRandomCars() {
        const corner0 = new ƒ.Vector3(-10, 0, -10);
        const corner1 = new ƒ.Vector3(10, 0, 10);
        const carRes = await ƒ.Project.getResource("Graph|2025-11-10T09:22:24.400Z|34819");
        for (let i = 0; i < 10; i++) {
            const vector = ƒ.random.getVector3(corner0, corner1);
            const car = await ƒ.Project.createGraphInstance(carRes);
            car.mtxLocal.translate(vector);
            car.name = "Car" + i.toString();
            Script.viewport.getBranch().addChild(car);
            cars.push(car);
        }
        console.log(carRes);
    }
    function onClick(_event) {
        const ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        for (const car of cars) {
            const distance = ray.getDistance(car.mtxWorld.translation);
            if ((distance.magnitude) < 1.5) {
                console.log(distance.magnitude, car.name);
            }
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class RandomCars extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = ƒ.Component.registerSubclass(RandomCars); }
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "RandomCars added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                        this.spawnRandomCars();
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            this.spawnRandomCars = async () => {
                // const corner0: ƒ.Vector3 = new ƒ.Vector3(-100, 0, -100);
                // const corner1: ƒ.Vector3 = new ƒ.Vector3(100, 0, 100);
                // const carRes: ƒ.SerializableResource = await ƒ.Project.getResource("Graph|2025-11-10T09:22:24.400Z|34819");
                //     for (let i = 0; i <10; i++) {
                //         const vector: ƒ.Vector3 = ƒ.random.getVector3(corner0, corner1);
                //         const car: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(carRes as ƒ.Graph)
                //         car.mtxLocal.translate(vector);
                //         this.node.addChild(car)
                //     }
                //     console.log(carRes)
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    Script.RandomCars = RandomCars;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map