$(document).ready(function() {
	window.requestAnimFrame = (function(){
	  	return  window.requestAnimationFrame   || 
	        window.webkitRequestAnimationFrame || 
	        window.mozRequestAnimationFrame    || 
	        window.oRequestAnimationFrame      || 
	        window.msRequestAnimationFrame     || 
	        function(callback, element){
	            window.setTimeout(callback, 1000 / 60);
	        };
	})();

	/**
	 * Initial scene, camera, and DOM setup
	 */
	    
		// scene size
		var WIDTH = $(window).width(),
		    HEIGHT = $(window).height();
		
		// camera attributes
		var VIEW_ANGLE = 45,
		    ASPECT = WIDTH / HEIGHT,
		    NEAR = 0.1,
		    FAR = 10000;
		
		// target DOM element
		var $container = $('#ParticleSystem .container');
		
		// WebGL renderer, camera
		var renderer = new THREE.WebGLRenderer();
		var camera = new THREE.Camera(  VIEW_ANGLE,
		    ASPECT,
		    NEAR,
		    FAR
		);

		var scene = new THREE.Scene();
		
		// pulls camera back from initial 0,0,0 position
		camera.position.z = 300;
		
		// Sets color of background
		renderer.setClearColor(new THREE.Color(0x0066FF));
		renderer.setSize(WIDTH, HEIGHT);
		
		// attach the render-supplied DOM element
		$container.append(renderer.domElement);
		
	/**
	 * Creates particle system
	 */

	 	// create the particle 
		var particleCount = 500,
		    particles = new THREE.Geometry(),
			pMaterial = new THREE.ParticleBasicMaterial({
				color: 0xFFFFFF,
				size:5,
				map: THREE.ImageUtils.loadTexture(
					"images/particle.png"
				),
				blending: THREE.AdditiveBlending,
				transparent: true
			});
		
		// creates individual particles
		for(var p = 0; p < particleCount; p++) {
		
			// create a particle with random position values, -250 -> 250
			var pX = Math.random() * 500 - 250,
				pY = Math.random() * 500 - 250,
				pZ = Math.random() * 500 - 250,
			    particle = new THREE.Vertex(
					new THREE.Vector3(pX, pY, pZ)
				);
			// create a velocity vector
			particle.velocity = new THREE.Vector3(0, -Math.random(), 0);

			// add it to the geometry
			particles.vertices.push(particle);
		}
		
		// create the particle system
		var particleSystem = new THREE.ParticleSystem(
			particles,
			pMaterial
		);
		
		particleSystem.sortParticles = true;
		
		// add it to the scene
		scene.addChild(particleSystem);
		
		// animation loop
		function update() {
			
			// add rotation to the system
			particleSystem.rotation.y += 0.005;
			
			var pCount = particleCount;
			while(pCount--) {
				// get the particle
				var particle = particles.vertices[pCount];
				
				// checks for reset
				if(particle.position.y < -200) {
					particle.position.y = 200;
					particle.velocity.y = 0;
				}
				
				// updates the velocity (modify second value for speed)
				particle.velocity.y -= Math.random() * .004;
				
				// and the position
				particle.position.addSelf(particle.velocity);
			}
			
			// flag to the particle system of changd vertices
			particleSystem.geometry.__dirtyVertices = true;
			
			renderer.render(scene, camera);
			
			// set up the next call
			requestAnimFrame(update);
		}

		requestAnimFrame(update);
});