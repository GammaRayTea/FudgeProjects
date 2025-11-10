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
            this.speed = 0;
            this.acceleration = 0.000001;
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
                console.log(this.wheels);
            };
            this.update = (_event) => {
                const transform = this.node.getComponent(ƒ.ComponentTransform);
                if (Input.isInputPressed("accelerate")) {
                    //console.log("a")
                    this.speed += this.acceleration * ƒ.Loop.timeFrameReal / 10000;
                    if (this.speed > 1) {
                        this.speed = 1;
                    }
                }
                else {
                    this.speed -= 0.3 * ƒ.Loop.timeFrameReal / 1000;
                    if (this.speed < 0) {
                        this.speed = 0;
                    }
                }
                const mouseDistanceToCenterX = Input.mouseCoordinates.x - Script.viewport.canvas.width / 2;
                if (Math.abs(mouseDistanceToCenterX) > 50) {
                    if (this.speed != 0) {
                        let turnAngle = -0.003 * (mouseDistanceToCenterX - Math.sign(mouseDistanceToCenterX) * 100);
                        console.log(turnAngle);
                        if (Math.abs(turnAngle) > 1) {
                            turnAngle = Math.sign(turnAngle);
                        }
                        transform.mtxLocal.rotateY(turnAngle);
                    }
                    for (let i = 0; i < 2; i++) {
                        const pivot = this.wheels[i].getComponent(ƒ.ComponentMesh).mtxPivot;
                        pivot.rotateX(Input.mouseDifference.x);
                    }
                }
                else {
                    for (let i = 0; i < 2; i++) {
                        const pivot = this.wheels[i].getComponent(ƒ.ComponentMesh).mtxPivot;
                        pivot.rotateX(-pivot.rotation.x / 2);
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
    ];
})(Input || (Input = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Script.viewport = _event.detail;
        Input.setup(Input.playerInputMap);
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        Input.updateBuffer();
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map