/* Author: Chase Sillevis */
var SCREEN_WIDTH = window.innerWidth,
SCREEN_HEIGHT = window.innerHeight,
SCREEN_WIDTH_HALF = SCREEN_WIDTH  / 2,
SCREEN_HEIGHT_HALF = SCREEN_HEIGHT / 2;

var camera, scene, renderer,
birds, bird;

var boid, boids;

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.z = 450;

	scene = new THREE.Scene();

	birds = [];
	boids = [];

	for ( var i = 0; i < 75; i ++ ) {

		boid = boids[ i ] = new Boid();
		boid.position.x = Math.random() * 400 - 200;
		boid.position.y = Math.random() * 400 - 200;
		boid.position.z = Math.random() * 400 - 200;
		boid.velocity.x = Math.random() * 2 - 1;
		boid.velocity.y = Math.random() * 2 - 1;
		boid.velocity.z = Math.random() * 2 - 1;
		boid.setAvoidWalls( true );
		boid.setWorldSize( 1000, 1000, 800 );

		bird = birds[ i ] = new THREE.Mesh( new Bird(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xffffff } ) );
		bird.phase = Math.floor( Math.random() * 62.83 );
		bird.position = boids[ i ].position;
		bird.doubleSided = true;
		bird.scale.x = bird.scale.y = bird.scale.z = 3;
		scene.add( bird );


	}

	renderer = new THREE.CanvasRenderer();
	// renderer.autoClear = false;
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.body.appendChild( renderer.domElement );
}

function onDocumentMouseMove( event ) {

	var vector = new THREE.Vector3( event.clientX - SCREEN_WIDTH_HALF, - event.clientY + SCREEN_HEIGHT_HALF, 0 );

	for ( var i = 0, il = boids.length; i < il; i++ ) {

		boid = boids[ i ];

		vector.z = boid.position.z;

		boid.repulse( vector );

	}

}

//

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	for ( var i = 0, il = birds.length; i < il; i++ ) {

		boid = boids[ i ];
		boid.run( boids );

		bird = birds[ i ];

		color = bird.materials[ 0 ].color;
		color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

		bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
		bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

		bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
		bird.geometry.vertices[ 5 ].position.y = bird.geometry.vertices[ 4 ].position.y = Math.sin( bird.phase ) * 5;

	}

	renderer.render( scene, camera );

}

$( '#music_player' ).bind( 'playing', function() {
	var lyrics = {
		16 : "This ain't a song for the broken hearted",
		24 : "A silent prayer for the faith departed",
		33 : "I ain't gonna be just a face in the crowd",
		36 : "You're gonna hear my voice when I shout it out loud",
		44 : "It's my life, it's now or never",
		50 : "I ain't gonna live forever",
		54 : "I just want to live while I'm alive",
		61 : "It's my life, my heart is like the open highway", 
		67 : "Like Frankie said: I did it my way",
		72 : "I just wanna live while I'm alive",
		77 : "It's my life.",
	
	    80 : "break",

		87 : "This is for the ones who stood their ground",
		95 : "It's for Tommy and Gina who never backed down",
		104 : "Tomorrow's getting harder make no mistake",
		108 : "Luck ain't even enough, you've got to make your own breaks",
		115 : "It's my life",
		118 : "It's now or never",
		122 : "I ain't gonna live forever",
		126 : "I just want to live while I'm alive",
		132 : "It's my life, my heart is like the open highway",
		138 : "Like Frankie said: I did it my way",
		143 : "I just want to live while I'm alive", 
		148 : "It's my life",
    
	    158 : "break",

		158 : "Better stand tall when they're calling you out",
		162 : "Don't bend, don't break, baby, don't back down",
		170 : "It's my life",
		173 : "It's now or never",
		176 : "I ain't gonna live forever",
		181 : "I just want to live while I'm alive",
		186 : "It's my life",
		189 : "My heart is like the open highway",
		193 : "Like Frankie said: I did it my way",
		198 : "I just want to live while I'm alive",
		202 : "It's my life",
	
		212 : "break"
	},
	action = null;

	$.each( lyrics, function( time, value ) {
		time = (time*1000);
		action = setTimeout(function(){addLyric(value)}, time );
	});

	function addLyric( text ) {
		if( text != "break" ) {
			var lyric = $( '<div />' ).addClass( 'lyric' ).append(
				$( '<p />' ).text( text )
			)
			$( '#container' ).append(
				lyric
			);
		} else {
			$( '.lyric' ).fadeOut();
			$( '.lyric' ).remove();
		}
		action = setTimeout( function(){$(lyric).addClass('remove')}, 10500 );
	}
});

$( '#music_player' ).bind( 'ended', function() {
	$( '#sharing_container' ).fadeIn();
});