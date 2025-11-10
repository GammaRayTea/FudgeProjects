namespace Script {
  import ƒ = FudgeCore;
  document.addEventListener("DOMContentLoaded", hndLoad);

  export let mesh: ƒ.Mesh;
  export let material: ƒ.Material;
  const bodies: Body[] = [];
  let system: ƒ.Node;

  let viewport: ƒ.Viewport;
  function hndLoad(): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas")!;
    const cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    mesh = new ƒ.MeshSphere("Sphere");
    material = new ƒ.Material("Material", ƒ.ShaderLitTextured);


    // let planet: keyof typeof Data.BODY;
    // for(planet in Data.BODY){
    //   const body = new Body(planet);
    // }


    system = new ƒ.Node("System");
    const sun = new Body(Data.BODY.SUN);
    bodies.push(sun);
    system.addChild(sun);

    const earth = new Body(Data.BODY.EARTH);
    bodies.push(earth);
    sun.addChild(earth);

    const mars = new Body(Data.BODY.MARS);
    bodies.push(mars);
    sun.addChild(mars);
    const moon = new Body(Data.BODY.MOON);
    earth.addChild(moon);
    bodies.push(moon);
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", system, cmpCamera, canvas);

    cmpCamera.mtxPivot.translateZ(170);
    cmpCamera.mtxPivot.translateY(200);
    cmpCamera.mtxPivot.rotateY(180);
    cmpCamera.mtxPivot.rotateX(50);

    ƒ.Loop.start();
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
  }

  function update(): void {
    
    for (const body of bodies) {
      body.update();
    }
    viewport.draw();
  }
}
