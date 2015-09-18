var DrawTogether = function(canvas, container){
	var canvas = canvas;
	var context = canvas.getContext("2d");
	// Creating a tmp canvas
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	var container = container;
	var container_style = getComputedStyle(container);
	canvas.width = parseInt(container_style.getPropertyValue('width'));
	canvas.height = parseInt(container_style.getPropertyValue('height'));

	this.isDraw = '';
	this.line = false;
	this.rect = false;
	this.ellipse = false;
	this.brush = false;
	this.erase = false;
	this.circle = false;
	this.strokeHoler = '#ff0000';
	this.fillHoler = '#ffffff';
	this.lineWidthHoler = 5;
	this.posX = '';
	this.posY = '';
	this.startX = 0;
	this.startY = 0;
	this.fromDB = [];
	this.ppts = [];
	this.initialize = function(){
		context.strokeStyle = "#FF0000";
		context.lineWidth = 5;
		context.lineCap = "round";
		context.fillStyle = "#fff";
		context.fillRect(0,0,canvas.width,canvas.height);

		tmp_canvas.width = canvas.width;
		tmp_canvas.height = canvas.height;
		container.appendChild(tmp_canvas);
		tmp_ctx.lineWidth = context.lineWidth;
		//tmp_ctx.lineJoin = 'round';
		tmp_ctx.lineCap = context.lineCap;
		tmp_ctx.strokeStyle = context.strokeStyle;
		tmp_ctx.fillStyle = context.fillStyle;
	}

	this.startLine = function(x,y){
		this.posX = x;
		this.posY = y;
		this.line = true;
		this.rect = false;
		this.ellipse = false;
		this.brush = false;
		this.erase = false;
		this.circle = false;
	}

	this.startRect = function(x,y){
		this.posX = x;
		this.posY = y;
		this.line = false;
		this.rect = true;
		this.ellipse = false;
		this.brush = false;
		this.erase = false;
		this.circle = false;
	}

	this.startEllipse = function(x,y){
		this.posX = x;
		this.posY = y;
		this.line = false;
		this.rect = false;
		this.ellipse = true;
		this.circle = false;
		this.brush = false;
		this.erase = false;
	}
	
	this.startCircle = function(x,y){
		this.posX = x;
		this.posY = y;
		this.line = false;
		this.rect = false;
		this.ellipse = false;
		this.brush = false;
		this.erase = false;
		this.circle = true;
	}
	
	this.startBrush = function(x,y){
		this.posX = x;
		this.posY = y;
		this.line = false;
		this.rect = false;
		this.ellipse = false;
		this.erase = false;
		this.brush = true;
		this.circle = false;
	}
	
	this.startErase = function(x,y){
		this.posX = x;
		this.posY = y;
		this.line = false;
		this.rect = false;
		this.ellipse = false;
		this.erase = true;
		this.brush = false;
		this.circle = false;
	}

	this.cancelDraw = function(){
		this.posX = '';
		this.posY = '';
		this.line = false;
		this.rect = false;
		this.ellipse = false;
		this.brush = false;
		this.erase = false;
		this.circle = false;

		this.ppts = [];
		context.drawImage(tmp_canvas, 0, 0);
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
	}

	this.drawLine = function(x,y){
		var obj = {x:x, y:y, color: {stroke:tmp_ctx.strokeStyle, fill:tmp_ctx.fillStyle, size: tmp_ctx.lineWidth}, type:'line'};
		return obj;
	}

	this.drawRect = function(x,y){
		var obj = {x:x, y:y, color: {stroke:tmp_ctx.strokeStyle, fill:tmp_ctx.fillStyle, size: tmp_ctx.lineWidth}, type:'rect'};
		return obj;
	}

	this.drawEllipse = function(x,y){
		var obj = {x:x, y:y, color: {stroke:tmp_ctx.strokeStyle, fill:tmp_ctx.fillStyle, size: tmp_ctx.lineWidth}, type:'ellipse'};
		return obj;
	}
	
	this.drawBrush = function(x,y){
		var obj = {x:x, y:y, color: {stroke:tmp_ctx.strokeStyle, fill:tmp_ctx.fillStyle, size: tmp_ctx.lineWidth}, type:'brush'};
		return obj;
	}
	
	this.drawErase = function(x,y){
		var obj = {x:x, y:y, color: {stroke:'#fff', fill:'#fff', size: tmp_ctx.lineWidth}, type:'erase'};
		return obj;
	}
	
	this.drawCircle = function(x,y){
		var obj = {x:x, y:y, color: {stroke:tmp_ctx.strokeStyle, fill:tmp_ctx.fillStyle, size: tmp_ctx.lineWidth}, type:'circle'};
		return obj;
	}

	this.drawLineCoors = function(x,y,color){
		//tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		tmp_ctx.beginPath();
		tmp_ctx.strokeStyle = color.stroke;
		tmp_ctx.lineWidth = color.size;
		tmp_ctx.moveTo(this.startX, this.startY);
		tmp_ctx.lineTo(x, y);
		tmp_ctx.stroke();
		tmp_ctx.closePath();
		return ('Coordinates Line ' + x + ' - ' + y + ' - ' + color.stroke);
	}

	this.drawRectCoors = function(x,y,color){
		//tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);

		tmp_ctx.beginPath();
		var width = Math.abs(x - this.startX);
		var height = Math.abs(y - this.startY);
		tmp_ctx.strokeStyle = color.stroke;
		tmp_ctx.lineWidth = color.size;
		tmp_ctx.fillStyle = color.fill;
		//context.clearRect(this.posX, this.posY, width+context.lineWidth+5, height+context.lineWidth+5);
		tmp_ctx.rect(x, y, width, height);
		tmp_ctx.closePath();
		tmp_ctx.fill();
		tmp_ctx.stroke();
		//context.closePath();
		return ('Coordinates Rect ' + x + ' - ' + y + ' - ' + width + ' - ' + height + ' - ' + color.stroke + ' - ' + color.fill);
	}

	this.drawCircleCoors = function(xx,yy, color){

		var x = (xx + this.startX) / 2;
		var y = (yy + this.startY) / 2;

		var radius = Math.max(
		Math.abs(xx - this.startX),
		Math.abs(yy - this.startY)
		) / 2;

		tmp_ctx.beginPath();
		tmp_ctx.strokeStyle = color.stroke;
		tmp_ctx.fillStyle = color.fill;
		tmp_ctx.lineWidth = color.size;
		tmp_ctx.arc(x, y, radius, 0, Math.PI*2, false);
		// tmp_ctx.arc(x, y, 5, 0, Math.PI*2, false);
		tmp_ctx.closePath();
		tmp_ctx.stroke();
		tmp_ctx.fill();
		return ('Coordinates Ellipse ' + x + ' - ' + y +  ' - ' + color.stroke + ' - ' + color.fill);
	}

	this.drawEllipseCoors = 	function(x, y, color) {
		var w = Math.abs(x - this.startX);
		var h = Math.abs(y - this.startY);
		var kappa = .5522848,
		ox = (w / 2) * kappa, // control point offset horizontal
		oy = (h / 2) * kappa, // control point offset vertical
		xe = x + w,           // x-end
		ye = y + h,           // y-end
		xm = x + w / 2,       // x-middle
		ym = y + h / 2;       // y-middle
		
		tmp_ctx.beginPath();
		tmp_ctx.fillStyle = color.fill;
		tmp_ctx.strokeStyle = color.stroke;
		tmp_ctx.lineWidth = color.size;
		tmp_ctx.moveTo(x, ym);
		tmp_ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
		tmp_ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
		tmp_ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
		tmp_ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
		tmp_ctx.closePath();
		tmp_ctx.stroke();
		tmp_ctx.fill();
	}

	this.drawBrushCoors = 	function(x, y, color) {
		if(x!==0&&x!==''&&x!==undefined&&x!==null){
			tmp_ctx.fillStyle = color.fill;
			tmp_ctx.strokeStyle = color.stroke;
			tmp_ctx.lineWidth = color.size;


			tmp_ctx.beginPath();
			tmp_ctx.moveTo(x, y);
			tmp_ctx.lineTo((this.posX !== '')?this.posX:x, (this.posY !== '')?this.posY:y);
			tmp_ctx.stroke();
			tmp_ctx.closePath();
		}

		this.posX = x;
		this.posY = y;
		
		return ('Coordinates Brush ' + x + ' - ' + y);
	}

	this.drawEraseCoors = 	function(x, y, color) {
		if(x!==0&&x!==''&&x!==undefined&&x!==null){
			//erase
			//tmp_ctx.globalCompositeOperation = 'destination-out';
			tmp_ctx.fillStyle = color.fill;
			tmp_ctx.strokeStyle = color.stroke;
			tmp_ctx.lineWidth = color.size;


			tmp_ctx.beginPath();
			tmp_ctx.moveTo(x, y);
			tmp_ctx.lineTo((this.posX !== '')?this.posX:x, (this.posY !== '')?this.posY:y);
			tmp_ctx.stroke();
			tmp_ctx.closePath();
		}

		this.posX = x;
		this.posY = y;
		
		return ('Coordinates Erase ' + x + ' - ' + y);
	}


	this.drawCoors = function(object, clear){
		var temp = 'hello world';
		var type = object.type;
		var x = object.x;
		var y = object.y;
		var color = object.color;
		switch(type){
			case 'brush':
				temp = this.drawBrushCoors(x,y,color);
				break;
			case 'erase':
				temp = this.drawEraseCoors(x,y,color);
				break;						
			default:
				break;
		}
		return temp;
	}

	this.drawCoorsDB = function(){
		var object1 = this.fromDB[0];
		var object2 = this.fromDB[1];
		var temp = 'hello world';
		var type = object1.type;
		this.startX = object2.x;
		this.startY = object2.y;
		var x = object1.x;
		var y = object1.y;
		var color = object1.color;
		switch(type){
			case 'line':
				temp = this.drawLineCoors(x,y,color);
				break;
			case 'rect':
				temp = this.drawRectCoors(x,y,color);
				break;
			case 'ellipse':
				temp = this.drawEllipseCoors(x,y,color);
				break;
			case 'circle':
				temp = this.drawCircleCoors(x,y,color);
				break;
			default:
				break;
		}
		this.fromDB = [];
		return temp;
	}

	this.clearScreen = function(){
		context.fillStyle = '#ffffff';
		context.rect(0,0,canvas.width,canvas.height);
		context.fill();
		tmp_ctx.clearRect(0,0,canvas.width,canvas.height);
		context.save();
		//tmp_ctx.save();
	}

	this.setStrokeColor = function(value){
		context.strokeStyle = value;
		tmp_ctx.strokeStyle = value;
	}
	
	this.setfillColor = function(value){
		context.fillStyle = value;
		tmp_ctx.fillStyle = value;
	}

	this.setStrokeSize = function(value){
		context.lineWidth = value;
		tmp_ctx.lineWidth = value;
	}
	
	this.getStrokeColor = function(){
		return context.strokeStyle;
	}
	
	this.getfillColor = function(){
		return context.fillStyle;
	}

	this.getStrokeSize = function(){
		return context.lineWidth;
	}

	this.getCurrentStyle = function(){
		this.strokeHoler = this.getStrokeColor();
		this.fillHoler = this.getfillColor();
		this.lineWidthHoler = this.getStrokeSize();
	}

	this.setCurrentStyle = function(){
		this.setStrokeColor(this.strokeHoler);
		this.setfillColor(this.fillHoler);
		this.setStrokeSize(this.lineWidthHoler);
	}




	this.getMousePosition = function(canvas, evt) {
	    var rect = canvas.getBoundingClientRect();
	    return {
	        x: evt.clientX - rect.left,
	        y: evt.clientY - rect.top
	    };
	}

}












$(document).ready(function(){

	var myDataRef = new Firebase('https://wedraw.firebaseio.com/realtime_drawing');

	var theCanvas = document.getElementById("canvas");
	var container = document.querySelector('#container');
	var theDraw = new DrawTogether(theCanvas,container);
	theDraw.initialize();

	var $canvas = $("canvas");
	var layer = {};


		$('#lineBtn').click(function(){
			if(theDraw.isDraw === 'erase'){ theDraw.setCurrentStyle(); }
			theDraw.isDraw = 'line';
			//$("div#tools>div").removeClass('acive');
			$("#tools>div.active").removeClass("active");
			$(this).addClass('active');
			$canvas.attr('class', 'draw');
		});

		$('#rectangleBtn').click(function(){
			if(theDraw.isDraw === 'erase'){ theDraw.setCurrentStyle(); }
			theDraw.isDraw = 'rect';
			$("#tools>div.active").removeClass("active");
			$(this).addClass('active');
			$canvas.attr('class', 'draw');
		});

		$('#ellipseBtn').click(function(){
			if(theDraw.isDraw === 'erase'){ theDraw.setCurrentStyle(); }
			theDraw.isDraw = 'ellipse';
			$("#tools>div.active").removeClass("active");
			$(this).addClass('active');
			$canvas.attr('class', 'draw');
		});
		
		$('#brushBtn').click(function(){
			if(theDraw.isDraw === 'erase'){ theDraw.setCurrentStyle(); }
			theDraw.isDraw = 'brush';
			$("#tools>div.active").removeClass("active");
			$(this).addClass('active');
			$canvas.attr('class', 'brush');
		});
		
		$('#eraseBtn').click(function(){
			theDraw.getCurrentStyle();
			theDraw.isDraw = 'erase';
			$("#tools>div.active").removeClass("active");
			$(this).addClass('active');
			$canvas.attr('class', 'erase');
		});

		$('#circleBtn').click(function(){
			if(theDraw.isDraw === 'erase'){ theDraw.setCurrentStyle(); }
			theDraw.isDraw = 'circle';
			$("#tools>div.active").removeClass("active");
			$(this).addClass('active');
			$canvas.attr('class', 'draw');
		});

		$('#clearBtn').click(function(){
			if(theDraw.isDraw === 'erase'){ theDraw.setCurrentStyle(); }
			if(confirm('Are you sure you want to clear your drawings?')){
				theDraw.clearScreen();
				myDataRef.remove();
			}

		});
		
		$('#sizeBtn').change(function(){
			theDraw.setStrokeSize(this.value);
		});
		
		$('#strokeColorBtn').change(function(){
			theDraw.setStrokeColor(this.value);
		});
		
		$('#fillColorBtn').change(function(){
			theDraw.setfillColor(this.value);
		});



		$canvas.mousedown(function(event) {
			var position = theDraw.getMousePosition(theCanvas,event);
			var x = position.x;
			var y = position.y;
			theDraw.startX = x;
			theDraw.startY = y;
			switch(theDraw.isDraw){
				case 'line':
					theDraw.startLine(x,y);
					myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()}, type:'line'});
					break;
				case 'rect':
					theDraw.startRect(x,y);
					myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'rect'});
					break;
				case 'ellipse':
					theDraw.startEllipse(x,y);
					myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'ellipse'});
					break;
				case 'brush':
					theDraw.startBrush(x,y);
					//myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'brush'});
					break;
				case 'erase':
					theDraw.startErase(x,y);
					//myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'brush'});
					break;

				case 'circle':
					theDraw.startCircle(x,y);
					myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'circle'});
					break;
				default:
					theDraw.cancelDraw(x,y);
					break;
			}
		});

		$canvas.mousemove(function(event) {

			var holder = {};
			var position = theDraw.getMousePosition(theCanvas,event);
			var x = position.x;
			var y = position.y;
			switch(true){
				case theDraw.line:
					holder = theDraw.drawLine(x,y);
					//myDataRef.push(holder);
					//theDraw.drawCoors(holder,true);
					break;
				case theDraw.rect:
					holder = theDraw.drawRect(x,y);
					//myDataRef.push(holder);
					//theDraw.drawCoors(holder,true);
					break;
				case theDraw.ellipse:
					holder = theDraw.drawEllipse(x,y);
					//myDataRef.push(holder);
					//theDraw.drawCoors(holder,true);
					break;
				case theDraw.brush:
					holder = theDraw.drawBrush(x,y);
					myDataRef.push(holder);
					//theDraw.drawCoors(holder,true);
					break;
				case theDraw.erase:
					holder = theDraw.drawErase(x,y);
					myDataRef.push(holder);
					//theDraw.drawCoors(holder,true);
					break;
				case theDraw.circle:
					holder = theDraw.drawCircle(x,y);
					//myDataRef.push(holder);
					//theDraw.drawCoors(holder,true);
					break;
				default:
					break;
			}

		});

		$canvas.mouseup(function(event) {
			//theDraw.isDraw = '';

			var holder = {};
			var position = theDraw.getMousePosition(theCanvas,event);
			var x = position.x;
			var y = position.y;
			theDraw.startX = x;
			theDraw.startY = y;
			switch(theDraw.isDraw){
				case 'line':
					theDraw.startLine(x,y);
					myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()}, type:'line'});
					break;
				case 'rect':
					theDraw.startRect(x,y);
					myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'rect'});
					break;
				case 'ellipse':
					theDraw.startEllipse(x,y);
					myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'ellipse'});
					break;
				case 'brush':
					//theDraw.startBrush(theDraw.posX,theDraw.posY);
					myDataRef.push({x:'', y:'', color: {stroke:'#ffffff', fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'brush'});
					break;
				case 'erase':
					//theDraw.startErase(theDraw.posX,theDraw.posY);
					myDataRef.push({x:'', y:'', color: {stroke:'#ffffff', fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'erase'});
					break;
				case 'circle':
					//theDraw.startCircle(x,y);
					myDataRef.push({x:x, y:y, color: {stroke:theDraw.getStrokeColor(), fill:theDraw.getfillColor(), size:theDraw.getStrokeSize()},  type: 'circle'});
					break;
				default:
					theDraw.cancelDraw(x,y);
					break;
			}


			theDraw.cancelDraw();
		});

		$canvas.mouseout(function(event) {
			//theDraw.isDraw = '';
			theDraw.cancelDraw();
		});

		myDataRef.on('child_added', function(snapshot) {
			var coords = snapshot.val();
			//console.log(coords.type + ' - ' + coords.x + ' - ' + coords.y);
			if(coords.type === 'brush' || coords.type === 'erase'){
				console.log(theDraw.drawCoors(coords));
			} else {
				theDraw.fromDB.push(coords);
				console.log(theDraw.drawCoorsDB());
			}
		});



	
	
		
});























