declare namespace Script {
    import ƒ = FudgeCore;
    class CarController extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        possessed: boolean;
        private speed;
        private wheels;
        private readonly acceleration;
        private readonly breakFactor;
        private readonly frictionFactor;
        constructor();
        hndEvent: (_event: Event) => void;
        setup: () => void;
        update: (_event: Event) => void;
        accelerate(): void;
        turn(_mouseDistanceToCenterX: number): void;
        break(): void;
        decelerate(): void;
    }
}
declare namespace Input {
    export interface Action {
        actionName: string;
        key: string;
    }
    interface Coordinates {
        x: number;
        y: number;
    }
    export let mouseDifference: Coordinates;
    export let mouseCoordinates: Coordinates;
    export let mouseMoved: boolean;
    export let lastMouseCoords: Coordinates;
    export function setup(_inputMap: Action[]): void;
    export function updateBuffer(): void;
    export function isInputJustPressed(_recievedActionName: string): boolean;
    export function isInputJustReleased(_recievedActionName: string): boolean;
    export function isInputPressed(_recievedActionName: string): boolean;
    export {};
}
declare namespace Input {
    const playerInputMap: Action[];
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class RandomCars extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
        spawnRandomCars: () => Promise<void>;
    }
}
