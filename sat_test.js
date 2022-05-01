const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const polygons = [];
const polygonsColors = [ 'red', 'blue', 'green', 'pink', 'purple', 'cyan' ];

polygons.push(createPolygon([
    { x: 50, y: 50 },
    { x: 100, y: 50 },
    { x: 100, y: 150 },
    { x: 50, y: 150 },
]));

polygons.push(
    PolygonBuilder.triangle_right({x: 100, y: 50}, {x: 200, y: 200}, false, false, 0)
);

function testCollision() {
    for (let i = 1; i < polygons.length; i++) {
        if (polygons[0].testWith(polygons[i])) {
            console.log("Tested with index: ", i);
        }
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
        polygons[0].offset(10, 0);
        testCollision();
    } else if (e.key === 'ArrowLeft') {
        polygons[0].offset(-10, 0);
        testCollision();
    } else if (e.key === 'ArrowDown') {
        polygons[0].offset(0, 10);
        testCollision();
    } else if (e.key === 'ArrowUp') {
        polygons[0].offset(0, -10);
        testCollision();
    }
});

function render() {
    requestAnimationFrame(render)
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    let colorIndex = 0;
    for (let i = 0; i < polygons.length; i++) {
        polygons[i].render(context, polygonsColors[colorIndex]);

        colorIndex++;
        if (colorIndex === polygonsColors.length) {
            colorIndex = 0;
        }
    }
}

render();