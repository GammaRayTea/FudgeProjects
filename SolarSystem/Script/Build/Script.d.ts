declare namespace Script {
    import ƒ = FudgeCore;
    class ComponentAxisRotation extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        name: string;
        rotationSpeed: number;
        constructor();
        hndEvent: (_event: Event) => void;
        private setup;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ComponentOrbit extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        orbitSpeed: number;
        body: ƒ.Node;
        constructor();
        hndEvent: (_event: Event) => void;
        private setup;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
}
