namespace Script {
  import ƒ = FudgeCore;
  ƒ.ANIMATION_BLENDING,
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    ƒ.Loop.start();
  //   const cmpCamera: ƒ.ComponentCamera = viewport.camera
  //   //cmpCamera.mtxPivot.translateZ(120);
  //   cmpCamera.mtxPivot.translateY(15);
  //   cmpCamera.mtxPivot.rotateY(180);
  //   cmpCamera.mtxPivot.rotateX(50);
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}