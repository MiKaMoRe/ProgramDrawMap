/*Переменные canvas*/
var cvsDraw = document.getElementById('canvasDraw');
var ctxDraw = cvsDraw.getContext('2d');
var cvsPalette = document.getElementById('canvasPalette');
var ctxPalette = cvsPalette.getContext('2d');



var img = new Image();

	/*Палитра*/
var widthTilesPalette = 0;
var heightTilesPalette = 0;
var widthWindowPalette;
var heightWindowPalette;

	/*Холст*/
var widthTilesDraw = document.getElementById("width").value;
var heightTilesDraw = document.getElementById("height").value;
var widthWindowDraw = widthTilesDraw * document.getElementById("tile").value;
var heightWindowDraw = heightTilesDraw * document.getElementById("tile").value;

var sizeTile = document.getElementById("tile").value;


var nameLayer = document.getElementById("name").value;
var outputBlock = document.getElementById("output");
/*Переменные селекторов*/
var selectorColumnDraw = 0;
var selectorColumnPalette = 0;
var selectorRowDraw = 0;
var selectorRowPalette = 0;
var selectorLayer = 0
var selectorMaterial = 0;
var selectorTools= 0;
var allMaterialsPalette = 0;

var xMouseDraw = 0;
var yMouseDraw = 0;
var xMousePalette = 0;
var yMousePalette = 0;


var layers = [];
var layersNames = [];

var imageLoader = document.getElementById('tilesetImage');

imageLoader.addEventListener('change', handleImage, false);
document.addEventListener('mousemove', mouseMoveHandler);
cvsPalette.addEventListener('click', clickPalette, false);
cvsDraw.addEventListener('mousemove', moveDraw, false);
cvsDraw.addEventListener('mousedown', clickDraw, false);
cvsDraw.addEventListener('click', unclickDraw, false);
var click = false;

function unclickDraw(){
	click = false;
}
function clickDraw(){
	click = true;
}

function clickPalette(){
	selectorColumnPalette = Math.floor(xMousePalette / sizeTile);
	selectorRowPalette = Math.floor(yMousePalette / sizeTile);
	selectorMaterial = selectorColumnPalette + (selectorRowPalette * 32);	
}

function moveDraw(){
	if (click){
		selectorColumnDraw = Math.floor(xMouseDraw / sizeTile);
		selectorRowDraw = Math.floor(yMouseDraw / sizeTile);

		var tileDraw = selectorColumnDraw + (selectorRowDraw * 32);
		layers[layersNames[0]][selectorRowDraw][selectorColumnDraw] = selectorMaterial;
	}
}

function layerAdd(){
	var widthArr = [];
	var layer = [];

	layers[nameLayer] = [];
	for(var h = 0; h < heightTilesDraw; h++){
		widthArr.push(0);
		for(var w = 0; w < widthTilesDraw; w++){
			layer.push(widthArr);
		}
	}
	layers[nameLayer] = layer.map(function(arr) {
		return arr.slice();
	});
	layersNames.push(nameLayer);
}

function clear(){
	var widthArr = [];
	var layer = [];
	layers[document.getElementById("name").value] = [];

	for(var h = 0; h < heightTilesDraw; h++){
		widthArr.push(0);
		for(var w = 0; w < widthTilesDraw; w++){
			layer.push(widthArr);
		}
	}

	layers[document.getElementById("name").value] = layer.map(function(arr) {
		return arr.slice();
	});
}

function handleImage(e){
	var reader = new FileReader();
	reader.onload = function(event){
		img.src = event.target.result;
	}
	reader.readAsDataURL(e.target.files[0]);
	drawPalette();
}
function mouseMoveHandler(e) {
	xMouseDraw = 0;
	yMouseDraw = 0;
	xMousePalette = 0;
	yMousePalette = 0;
	if (cvsDraw.offsetLeft == e.target.offsetLeft && cvsDraw.offsetTop == e.target.offsetTop) {
		xMouseDraw = e.pageX - e.target.offsetLeft;
		yMouseDraw = e.pageY - e.target.offsetTop;
	}else if (cvsPalette.offsetLeft == e.target.offsetLeft && cvsPalette.offsetTop == e.target.offsetTop) {
		xMousePalette = e.pageX - e.target.offsetLeft;
		yMousePalette = e.pageY - e.target.offsetTop;
	}
}

function drawCanvas(){
	
	
	ctxDraw.clearRect(0,0,widthWindowDraw,heightWindowDraw);
	heightTilesDraw = document.getElementById("height").value;
	widthTilesDraw = document.getElementById("width").value;
	widthWindowDraw = widthTilesDraw * document.getElementById("tile").value;
	heightWindowDraw = heightTilesDraw * document.getElementById("tile").value;
	
	
	canvasDraw.setAttribute("width", widthWindowDraw);
	canvasDraw.setAttribute("height", heightWindowDraw);
	



	for (var r = 0; r < heightTilesDraw; r++) { 
		for (var c = 0; c < widthTilesDraw; c++) { 
			var tile = layers[layersNames][r][c]
			var tileRow = (tile / sizeTile) | 0;
			var tileCol = (tile % sizeTile) | 0; 
			ctxDraw.drawImage(img, (tileCol * sizeTile), (tileRow * sizeTile), sizeTile, sizeTile, (c * sizeTile), (r * sizeTile), sizeTile, sizeTile); 
		}
	}
	

	
	canvasDraw.classList.add("visible");


	requestAnimationFrame(drawCanvas);
}

function drawPalette(){
	ctxPalette.clearRect(0,0,widthWindowPalette,heightWindowPalette);

	widthWindowPalette = img.width;
	heightWindowPalette = img.height;

	

	canvasPalette.setAttribute("width", widthWindowPalette);
	canvasPalette.setAttribute("height", heightWindowPalette);

	canvasPalette.classList.add("visible");

	ctxPalette.fillStyle = "#fff";
	ctxPalette.fillRect(0,0,widthWindowPalette,heightWindowPalette);
	ctxPalette.drawImage(img,0 ,0 ,widthWindowPalette, heightWindowPalette);

	

	requestAnimationFrame(drawPalette);
}


function output(){
	
	outputBlock.value = "var " + nameLayer + " = [ \n";
	outputBlock1 = outputBlock.value;
	for (var h = 0; h < heightTilesDraw; h++) {
		outputBlock.value =outputBlock1 + "    [";
		outputBlock1 = outputBlock.value;
		for (var w = 0; w < widthTilesDraw; w++) {
			outputBlock.value=outputBlock1 + layers[layersNames][h][w] + ", ";
			outputBlock1 = outputBlock.value;
		}
		outputBlock.value=outputBlock1 + "],\n";
		outputBlock1 = outputBlock.value;
	}
	outputBlock.value=outputBlock1 + "];";
	outputBlock1 = outputBlock.value;

	var textarea = document.querySelector('textarea');
	textarea.style.width =  Number(heightTilesDraw) * 30 + "px";
	textarea.setAttribute('rows', Number(widthTilesDraw) + 2);
}


layerAdd();



