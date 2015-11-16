var container;
var scene, camera, renderer;
var loader;
var shards = [];
var shardTextures = [];
var textureCubes = [];
var materials = [];
var uiComponents;
// var w = 1440;
var w = window.innerWidth;
var h = window.innerHeight;
// var h = 800;
var clickCount = 0;

var mouseX = 0; 
var mouseY = 0;
var index = 0;
var init = true;
var texture;
initScene();
function initScene(){
	container = document.createElement('div');
	document.body.appendChild(container);
	camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, 1, 100000);
    // camera = new THREE.PerspectiveCamera(50, w / h, 1, 100000);

	// camera.position.z = 500;
	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: false});
	renderer.setSize(w,h);
	renderer.setClearColor(0xffffff,1);
	// renderer.domElement.style.width = "100%";
	// renderer.domElement.style.height = "100%";
	container.appendChild(renderer.domElement);
	//event listeners
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
	// window.addEventListener('resize', onWindowResize, false);
	shardTexs();
	texture = initTexture(index);

	animate();
}
function shardTexs(){
	for(var j = 0; j < 24; j++){
		var urls= [];
		for (var i = 0; i < 6; i++) {
	        var url = "textures/textureCube/" + (j+1) + ".jpg";
	        urls.push(url);
	    }
	    var texture = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping);
	    shardTextures.push(texture);
	}
}
// var texture = initTexture(index);

function SHARD_ME(texture){
	// var texture = initTexture(index);
	for(var index = 0; index<55; index++){
			initMaterial(index, texture);

	}
	// var material = initMaterial(index, shardTextures[index]);
}
function initTexture(index){
	var urls = [];
	for (var i = 0; i < 6; i++) {
        // var url = "textures/diamonds/diamond" + (index+1) + ".jpg";
        var url = "textures/textureCube/" + (index+1) + ".jpg";
        // var url = "textures/textureCube/2.jpg";
        urls.push(url)
    }
    var texture = THREE.ImageUtils.loadTextureCube(urls, THREE.CubeRefractionMapping, function(t){
			SHARD_ME(t);
    });
    // return texture;
}
function initMaterial(index, texture){
	var params = {
		color: 0xffffff,
		envMap: texture,
		refractionRatio: 0.3,
		reflectivity: 0.95
	}
	var material = new THREE.MeshBasicMaterial(params)
	// var material = new THREE.LineBasicMaterial({color: 0x7777ff});

	// return material;
	loadShard(index, material);

}
function loadShard(index, material){
	loader = new THREE.BinaryLoader(true);
	if(material){
			loader.load("models/shards/"+(index+1)+".js", function(geometry){
				createShard(index, geometry, material);
			});
	}

}
function createShard(index, geometry, material){
	var shard = new THREE.Mesh(geometry, material);
	// var shard = new THREE.Mesh(boxGeom, material);
	// shard.position.set(0,0,-1000);
	// shard.position.set(Math.random()*1500.0 -1000.0,Math.random()*1500.0 -1000.0,-1000);
	// shard.position.set(200*(index%8)-600,90*(index/7)-340,-1000);
	shard.position.set((w/8)*(index%8)-(w/2.25),(h/7)*(index%7)-(h/2.4),-1000);
	var scale = w*4.0;
	// var scale = 500.0;
	shard.scale.set(scale,scale,scale);
	scene.add(shard);
	shards.push(shard);
}
function checkViewport(shard){

}
function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}
function onDocumentMouseDown(){
	// shards[index-1].material.dispose();
	// shards[index-1].geometry.dispose();
	// scene.remove(shards[index]);
	if(clickCount = 0){
		index = Math.floor(Math.random()*16);
		clickCount++;
	}
	// if(index>shardTextures.length){
	// 	index = 0;
	// }

	index++;

 //    var newTex = shardTextures[index];
	// for(var i = 0; i< shards.length; i++){
	// 	shards[i].material.envMap = newTex;
	// }
	// texture.envMap = initTexture(index);
}
function onDocumentMouseMove(event) {

    // mouseX = (event.clientX - w/2) * 0.000000000000001;
    mouseX = (event.clientX + w/2) * 0.00075;
    // mouseY = (event.clientY - h/2) * 0.000000000000001;
    mouseY = (event.clientY + h/2) * 0.00075;

}
function animate(){
	requestAnimationFrame(animate);
    render();
}
function render(){
	camera.lookAt(scene.position);
	if(index == 56){
		index = 0;
	}
	for(var i = 0; i < shards.length; i++){
		shards[i].rotation.x = Date.now()*0.00003;
		shards[i].rotation.y = Date.now()*0.00003+mouseY;
		// shards[i].rotation.z = Date.now()*0.00003;
		shards[i].rotation.z = Date.now()*0.00003+mouseX;
	}	
	renderer.render(scene, camera);
}
var box = document.getElementById("box");
var shardCounter = 0;
function handleShardClick(e){
	if(shardCounter%2 == 0){
		box.style.display = "block";
	} else{
		box.style.display = "none";
	}
	shardCounter++;
}