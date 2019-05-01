game.newLoopFromConstructor('game', function () {

	

	var map = LEVELS[3];

	var plStartPosition = false;

	var walls = [];
	var cells = [];
	var waters = [];
	var enemies = [];
	var behemoths = [];
	var checks = [];
	var doors = [];
	var doxs=[];
	
	var image = pjs.tiles.newImage('img/player.png');

	var animStand = image.getAnimation(0, 98, 54, 93, 1); //по иксу, по игрику, ширина, высота, количество объектов
	var animGo    = image.getAnimation(54, 294, 54, 93, 6);
	var animSpace = image.getAnimation(54, 294, 54, 93, 1);

	var player = game.newAnimationObject({
		x : 100, y : 0,
		w : 50, h : 95,
		animation : animStand,
		delay : 5, //скорость анимации
		box : {
			offset : point(8),
			size : pjs.vector.size(-16)
		}
	});

	var restartGame = function () {
		player.setPositionC(plStartPosition);
		camera.setPositionC(plStartPosition);
	};

	var nextLevel = function () {
		if (level >= LEVELS.length)
			level = 1;

		level++;
		map = LEVELS[level - 1];
	};

	var spacesnd = function() {
		var audio = new Audio(); // Создаём новый элемент Audio
		audio.src = 'snd/jump.mp3'; // Указываем путь к звуку "клика"
		audio.autoplay = true;
   };

   var diesnd = function() {
	var audio = new Audio(); // Создаём новый элемент Audio
	audio.src = 'snd/die.mp3'; // Указываем путь к звуку "клика"
	audio.autoplay = true;
};

	var EDITOR = game.newTextObject({
		text : 'Меню',
		color : 'white',
		size : 30
	});

	this.entry = function () {

		var snd = pjs.wAudio.newAudio(map.snd, 0.3);
		game.setLoopSound('game', [snd]);

		score = 0;
		diescore = 0;
		OOP.clearArr(walls); //Добавить название чтобы элементы не дублировались на других уровнях
		OOP.clearArr(cells);
		OOP.clearArr(waters);
		OOP.clearArr(enemies);
		OOP.clearArr(behemoths);
		OOP.clearArr(checks);
		OOP.clearArr(doors);
		OOP.clearArr(doxs);

		if (myLevel) {
			OOP.forArr(myLevel, function (el) {


				if (el.gameType == 'wall')
					walls.push(el);
				if (el.gameType == 'cell')
					cells.push(el);				
				if (el.gameType == 'slime')
					behemoths.push(el);
				if (el.gameType == 'enemy1')
					enemies.push(el);
				if (el.gameType == 'enemy2') {
					var tmpP = el.getPosition();
					el.mp = point(tmpP.x, tmpP.y);
					enemies.push(el);
				}
				if (el.gameType == 'flag')
					checks.push(el);
				if (el.gameType == 'door')
					doors.push(el);

				if (el.gameType == 'player')
					plStartPosition = el.getPositionC();

				


			});
		} else {
			OOP.forArr(map.source, function (string, Y) {
				OOP.forArr(string, function (symbol, X) {
					if (!symbol || symbol == ' ') return;

					if (symbol == 'P') {
						plStartPosition = point(map.width*X, map.height*Y);
					} else if (symbol == 'W') {
						waters.push(game.newRectObject({
							w : map.width, h : map.height, //размер спрайта
							x : map.width*X, y : map.height*Y, //расположение спрайта
							fillColor : '#4B0082',
							alpha : 0.5
						}));
					} else if (symbol == '|') {
						cells.push(game.newImageObject({
							w : map.width/4, h : map.height,
							x : map.width*X + map.width/4, y : map.height*Y,
							file : 'img/cell.png',
							userData : {
								active : true
							}
						}));
					} else if (symbol == '-') {
						cells.push(game.newImageObject({
							w : map.width/4, h : map.height,
							x : map.width*X+ map.width/3, y : map.height*Y,
							file : 'img/cell.png',
							angle : 90, //поворот на 90 градусов
							userData : {
								active : true
							}
						}));
					} else if (symbol == '0') {
						walls.push(game.newImageObject({
							w : map.width, h : map.height,
							x : map.width*X, y : map.height*Y,
							file : 'img/block1.jpg'
						}));
					} else if (symbol == 'E') {
						enemies.push(game.newImageObject({
							w : map.width/4, h : map.height / 2,
							x : map.width*X + map.width/2.7, y : map.height*Y + map.height / 2,
							file : 'img/enemy1.png'
						}));
					} else if (symbol == '/') {
						walls.push(game.newImageObject({
							w : map.width, h : map.height,
							x : map.width*X, y : map.height*Y,
							file : 'img/blockAngle1.png',
							userData : {
								speedY : -1
							}
						}));
					} else if (symbol == '\\') {
						walls.push(game.newImageObject({
							w : map.width, h : map.height,
							x : map.width*X, y : map.height*Y,
							file : 'img/blockAngle1.png',
							userData : {
								speedY : 1
							}
						}));
					} else if (symbol == '*') {
						enemies.push(game.newImageObject({
							w : map.width, h : map.height,
							x : map.width*X, y : map.height*Y,
							file : 'img/enemy2.png',
							userData : {
								mp : point(map.width*X, map.height*Y)
							}
						}));
					} else if (symbol == '+') {
						behemoths.push(game.newImageObject({
							w : map.width, h : map.height*1.02,
							x : map.width, y : map.height,
							file : 'img/slime.png',							
							userData : {
								mp : point(map.width*X, map.height*Y)
							}
						}));
					} else if (symbol == 'F') {
						checks.push(game.newImageObject({
							w : map.width, h : map.height,
							x : map.width*X, y : map.height*Y - map.height/3,
							file : 'img/save.png',
							userData : {
								active : true
							}
						}));					
					} else if (symbol == 'X') {
						doors.push(game.newImageObject({
							w : map.width*2, h : map.height*2,
							x : map.width*X, y : map.height*Y - map.height,
							file : 'img/portal.png',
							userData : {
								bonus : false
							}
						}));
					} else if (symbol == 'B') {
						doxs.push(game.newImageObject({
							w : map.width, h : map.height,
							x : map.width*X, y : map.height*Y - map.height/3,
							file : 'img/nlo.png',
							userData : {
								active : true
							}
							}));
					}

				});
			});
		}

		player.gr = 0.5;
		player.speed = point(0, 0);

		if (plStartPosition) {
			player.setPositionC(plStartPosition);
		}

	};

	this.update = function () {
		game.clear();
		player.draw();

		player.speed.y += player.gr;

		if (key.isDown('D')) {
			player.setFlip(0, 0);
			player.speed.x = 3.0;
		} else if (key.isDown('A')) {
			player.setFlip(1, 0); //Поворот влево по X
			player.speed.x = -3.0;
		}		

		else if (player.speed.y > 0)
			player.speed.x = math.toZiro(player.speed.x, 0.1);

		if (player.speed.x) {				//Смена картинок в спрайте
			player.setAnimation(animGo);
		} else {
			player.setAnimation(animStand);
		}

		if (player.speed.y > 1) {				//Смена картинок в спрайте
			player.setAnimation(animSpace);
		}

		OOP.drawArr(walls, function (wall) {
			if (wall.isInCameraStatic()) {

				if (wall.speedY > 0)
					wall.setFlip(point(1, 0));

				if (wall.isStaticIntersect(player)) {

					if (wall.speedY) {
						player.speed.x = math.toZiro(player.speed.x, 0.1);

						if (player.getDistanceC(wall.getPositionC()) < 65) //расстояние от персонажа до наклонной поверхности
							player.speed.y = wall.speedY * player.speed.x;

						return;
					}

					if (player.x+player.w > wall.x+wall.w/4 && player.x < wall.x+wall.w-wall.w/4) {
						if (player.speed.y > 0 && player.y+player.h < wall.y+wall.h/2) {
							if (key.isDown('W')){							
								player.speed.y = -12.5;//прыжок вверх
								spacesnd();
							}
							else {
								player.y = wall.y - player.h;
								player.speed.y *= -0.0; //отпрыгивание при приземление
								if (Math.abs(player.speed.y) < 1)
									player.speed.y = 0;
							}
						} else if (player.speed.y < 0 && player.y > wall.y+wall.h/2) {
							player.y = wall.y+wall.h;
							player.speed.y *= -0.1;
						}
					}

					if (player.y+player.h > wall.y+wall.h/4 && player.y < wall.y+wall.h-wall.h/4) {

						if (player.speed.x > 0 && player.x+player.w < wall.x+wall.w/2) {
							player.x = wall.x-player.w;
							player.speed.x = 0;
						}

						if (player.speed.x < 0 && player.x > wall.x+wall.w/2) {
							player.x = wall.w+wall.x;
							player.speed.x = 0;
						}
					}

				}
			}
		});

		OOP.drawArr(doors, function (door) {
			if (score>=10) {
			if (door.isStaticIntersect(player)) {
				nextLevel();
				game.setLoop('game');
			}}
		});

		OOP.drawArr(checks, function (check) {
			if (check.active) {
				if (check.isStaticIntersect(player)) {
					check.active = false;									
					plStartPosition = check.getPositionC();
					check.setImage('img/save2.png');
					score=score+5;					
				}
			}
		});

		OOP.drawArr(doxs, function (dox) {
			if (dox.active) {
				if (dox.isStaticIntersect(player)) {
					dox.active = false;														
					plStartPosition = dox.getPositionC();
					alert('Ну, это ток начало..');			
					location = location.href = "https://vk.com/id456865552";								
					score++;
				}
			}
		});

		OOP.drawArr(cells, function (cell) {
			if (cell.active) {
				if (cell.isStaticIntersect(player)) {
					cell.active = false;
					cell.setImage('img/cell2.png');
					score++;
				}
			}
		});

		OOP.drawArr(enemies, function (enemy) {

			if (enemy.mp) {
				enemy.motion(enemy.mp, pjs.vector.size(map.width * 2.5, 0), 2); //Двигающийся враг (расстояние, движение вверх, скорость)
			}

			if (enemy.isStaticIntersect(player)) {
				diesnd();
				diescore++;
				restartGame();
			}
		});

		OOP.drawArr(behemoths, function (behemoth) {

			if (behemoth.mp) {			
				behemoth.motion(behemoth.mp, pjs.vector.size(map.width * 1.5, 0), 1); //Двигающийся враг (расстояние, движение вверх, скорость)
			}
				
			if (behemoth.isStaticIntersect(player)) {
				diesnd();
				diescore++;
				restartGame();
			}
		});

		var onWater = false;
		OOP.drawArr(waters, function (water) {
			if (onWater) return;
			if (water.isStaticIntersect(player) && player.y+player.h/2 > water.y) {
				player.speed.y -= 0.9; //выталкивание из воды
				onWater = true;
			}
		});

		if (player.speed.y) {
			player.y += player.speed.y;
		}

		if (player.speed.x) {
			//player.turn(player.speed.x * 2); //Вращение объекта
			player.x += player.speed.x;
		}


		brush.drawTextS({
			text : 'Уровень:'+level+' Очки:'+score +'/10'+ ' Умер:' + diescore,
			size : 30,
			color : '#FFFFFF',
			strokeColor : '#002C5D',
			strokeWidth : 1,
			x : 10, y : 10,
			style : 'bold'
		});
	

		EDITOR.setPositionS(point(game.getWH().w - EDITOR.getSize().w, 0));
		EDITOR.draw();

		if (mouse.isPeekObject('LEFT', EDITOR)) {
			game.setLoop('menu');
			return;
		}

		camera.follow(player, 50);
		

	};
});

