class CircleHitbox {
  constructor(radius) {
    this.type = "circle"
    this.radius = radius
    this.tested = false
  }
}

class PolygonHitbox {
  constructor(bodies) {
    this.type = "polygon"
    this.bodies = bodies
    this.tested = false
  }
}

function createPolygon(vertices) {
  const polygon = {
    vertices: vertices,
    edges: buildEdges(vertices),
    rotate(rotation) {
      this.vertices.forEach(vertex => {
        let newPos = vectorRotate(vertex.x , vertex.y, rotation)
        vertex.x = newPos.x
        vertex.y = newPos.y
      })
      this.edges = buildEdges(vertices)
    }
  };

  polygon.projectInAxis = function(x, y) {
    let min = 10000000000;
    let max = -10000000000;
    for (let i = 0; i < polygon.vertices.length; i++) {
      let px = polygon.vertices[i].x;
      let py = polygon.vertices[i].y;
      var projection = (px * x + py * y) / (Math.sqrt(x * x + y * y));
      if (projection > max) {
          max = projection;
      }
      if (projection < min) {
          min = projection;
      }
    }
    return { min, max };
  };

  polygon.testWith = function (otherPolygon) {
    // get all edges
    const edges = [];
    for (let i = 0; i < polygon.edges.length; i++) {
        edges.push(polygon.edges[i]);
    }
    for (let i = 0; i < otherPolygon.edges.length; i++) {
        edges.push(otherPolygon.edges[i]);
    }
    // build all axis and project
    for (let i = 0; i < edges.length; i++) {
      // get axis
      const length = Math.sqrt(edges[i].y * edges[i].y + edges[i].x * edges[i].x);
      const axis = {
          x: -edges[i].y / length,
          y: edges[i].x / length,
      };
      // project polygon under axis
      const { min: minA, max: maxA } = polygon.projectInAxis(axis.x, axis.y);
      const { min: minB, max: maxB } = otherPolygon.projectInAxis(axis.x, axis.y);
      if (intervalDistance(minA, maxA, minB, maxB) > 0) {
          return false;
      }
    }
    return true;
    };

  polygon.render = function(context, color) {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(
      polygon.vertices[0].x,
      polygon.vertices[0].y
    );
    for (let i = 1; i < polygon.vertices.length; i++) {
      context.lineTo(
          polygon.vertices[i].x,
          polygon.vertices[i].y
      );
    }
    context.closePath();
    context.stroke();
    };

  polygon.offset = function(dx, dy) {
    for (let i = 0; i < polygon.vertices.length; i++) {
      polygon.vertices[i] = {
          x: polygon.vertices[i].x + dx,
          y: polygon.vertices[i].y + dy,
      };
    }
	};
  
	return polygon;
}

function buildEdges(vertices) {
  const edges = [];
  if (vertices.length < 3) {
      console.error("Only polygons supported.");
      return edges;
  }
  for (let i = 0; i < vertices.length; i++) {
      const a = vertices[i];
      let b = vertices[0];
      if (i + 1 < vertices.length) {
          b = vertices[i + 1];
      }
      edges.push({
          x: (b.x - a.x),
          y: (b.y - a.y),
      });
  }
  return edges;
}

function intervalDistance(minA, maxA, minB, maxB) {
  if (minA < minB) {
      return (minB - maxA);
  }
  return (minA - maxB);
}


const PolygonBuilder = {
  //where the center of rotation
  triangle_right(dim = {x: 100, y: 100}, offset = {x: 0, y: 0}, flipHorizontal = false, flipVertical = false, rotationDeg = 0 ) { //rotation in deg
    let rotation = rotationDeg * PI/180
    let pivot = {x: dim.x/2, y: dim.y/2}
    let vertices = [
      {x: 0, y: 0},
      {x: dim.x, y: dim.y},
      {x: 0 , y: dim.y},
    ]
    if(flipHorizontal)
    vertices.forEach((vertex) => {
      let offset = pivot.x - vertex.x
      vertex.x += offset*2
    })

    if(flipVertical)
    vertices.forEach((vertex) => {
      let offset = pivot.y - vertex.y
      vertex.y += offset*2
    })

    vertices.forEach((vertex) => {
      let newPos = vectorRotate(vertex.x, vertex.y, rotation)
      vertex.x = newPos.x
      vertex.y = newPos.y //this works

      vertex = vectorRotate(vertex.x, vertex.y, rotation) //doesn't work somehow, idk
      
      vertex.x += offset.x
      vertex.y += offset.y
    })
    return createPolygon(vertices, offset)
  },
  rectangle(dim = {x: 0, y: 0}) {

  }
}


function boxCollision(hitbox1, hitbox2) {

}