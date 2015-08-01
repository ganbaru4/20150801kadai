(function () {

  'use strict';

  var ua = navigator.userAgent.toLowerCase();
  var isSP = !!(~ua.indexOf('iphone') || ~ua.indexOf('ipad') || ~ua.indexOf('android'));

  /////////////////////////////////////////////////////////////////////////////
  // Renderer
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);


  /////////////////////////////////////////////////////////////////////////////
  // Scene and Camera
  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set(0, 0, -100);

  /////////////////////////////////////////////////////////////////////////////
  // Controlls
  var controls = new THREE.OrbitControls(camera);

  var spControls = null;
  if (isSP) {
    spControls = new THREE.DeviceOrientationControls(camera);
    spControls.connect();
  }


  /////////////////////////////////////////////////////////////////////////////
  // lights
  var light = new THREE.DirectionalLight(0xfffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  var ambient = new THREE.AmbientLight(0x666666);
  scene.add(ambient);

  var urls = [
    'px.jpg', // right
    'nx.jpg', // left
    'py.jpg', // top
    'ny.jpg', // bottom
    'pz.jpg', // back
    'nz.jpg'  // front
  ];
  var size = 300;

  var skyboxCubemap = THREE.ImageUtils.loadTextureCube(urls);
  skyboxCubemap.format = THREE.RGBFormat;

  var skyboxShader = THREE.ShaderLib.cube;
  skyboxShader.uniforms.tCube.value = skyboxCubemap;

  var skyBox = new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.ShaderMaterial({
      fragmentShader: skyboxShader.fragmentShader,
      vertexShader  : skyboxShader.vertexShader,
      uniforms      : skyboxShader.uniforms,
      depthWrite    : false,
      side          : THREE.BackSide
    })
  );
  scene.add(skyBox);


  /////////////////////////////////////////////////////////////////////////////
  // Models

  var loader = new THREE.OBJLoader();
  loader.load(
    'rin00.obj',
    function ( object  ) {
      scene.add( object );
    }
  );


  /////////////////////////////////////////////////////////////////////////////
  // responsive


  window.addEventListener('resize', function (e) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
  }, false);


  /////////////////////////////////////////////////////////////////////////////
  // Animations
  (function loop() {

    renderer.render(scene, camera);

    controls.update();

    if (isSP) {
      spControls.update();
    }

    requestAnimationFrame(loop);
  }());

}());
