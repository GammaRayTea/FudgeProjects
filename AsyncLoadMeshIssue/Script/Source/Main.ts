namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport = new ƒ.Viewport();

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;




    Input.setup(Input.playerInputMap);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    viewport.addEventListener("mouseDown", onClick)
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    spawnRandomCars();
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    Input.updateBuffer();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
  async function spawnRandomCars(): Promise<void> {
    const corner0: ƒ.Vector3 = new ƒ.Vector3(-100, 0, -100);
    const corner1: ƒ.Vector3 = new ƒ.Vector3(100, 0, 100);

    const carRes: ƒ.SerializableResource = await ƒ.Project.getResource("Graph|2025-11-10T09:22:24.400Z|34819");

    for (let i = 0; i < 10; i++) {
      const vector: ƒ.Vector3 = ƒ.random.getVector3(corner0, corner1);
      const car: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(carRes as ƒ.Graph)

      car.mtxLocal.translate(vector);
      viewport.getBranch().addChild(car)
    }
    console.log(carRes)
  }

  function onClick(): void {

  }
}