namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  const cars: ƒ.Node[] = [];
  let currentPlayer: ƒ.Node;
  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    Input.setup(Input.playerInputMap);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    document.addEventListener("mousedown", onClick);
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
    const corner0: ƒ.Vector3 = new ƒ.Vector3(-10, 0, -10);
    const corner1: ƒ.Vector3 = new ƒ.Vector3(10, 0, 10);

    const carRes: ƒ.SerializableResource = await ƒ.Project.getResource("Graph|2025-11-10T09:22:24.400Z|34819");

    for (let i = 0; i < 10; i++) {
      const vector: ƒ.Vector3 = ƒ.random.getVector3(corner0, corner1);
      const car: ƒ.GraphInstance = await ƒ.Project.createGraphInstance(carRes as ƒ.Graph);

      car.mtxLocal.translate(vector);
      car.name = "Car" + i.toString()
      viewport.getBranch().addChild(car);
      cars.push(car)
    }
    currentPlayer = cars[ƒ.random.getRangeFloored(0, cars.length - 1)];
    setPossessed(currentPlayer);
    console.log(currentPlayer.name);
  }

  function onClick(_event: MouseEvent): void {
    if (_event.button == 0) {

      const ray: ƒ.Ray = viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY))
      for (const car of cars) {
        const distance: ƒ.Vector3 = ray.getDistance(car.mtxWorld.translation);

        if ((distance.magnitude) < 1.5) {
          console.log(distance.magnitude, car.name)
          setPossessed(car)
        }
      }
    }
  }
  function setPossessed(_car: ƒ.Node): void {
    currentPlayer.getComponent(CarController).possessed = false
    currentPlayer = _car
    currentPlayer.getComponent(CarController).possessed = true
  }
}