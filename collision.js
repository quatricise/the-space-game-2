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
    },
    //todo this is missing the ability to rotate hitboxes on objects with position other than 0,0
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

function buildEdges(vertices) { //todo move this to a class, it's clumsily in the global scope
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


class PolygonBuilder {
  //where the center of rotation is somewhere, ffs, but i don't know where
  static Triangle_right(dim = {x: 100, y: 100}, offset = {x: 0, y: 0}, flipHorizontal = false, flipVertical = false, rotationDeg = 0 ) { //rotation in deg
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

    this.rotateVertices(vertices, rotation)
    this.offsetVertices(vertices, offset)
    return createPolygon(vertices)
  }
  static Rectangle(a, b, offset = {x: 0, y: 0}, rotationDeg = 0) {
    let rotation = rotationDeg * PI/180
    let vertices = [
      {x: 0, y: 0},
      {x: a, y: 0},
      {x: a , y: b},
      {x: 0 , y: b},
    ]
    this.rotateVertices(vertices, rotation)
    this.offsetVertices(vertices, offset)
    return createPolygon(vertices)
  }
  static Square(a, offset = {x: 0, y: 0}, rotationDeg = 0) {
    let rotation = rotationDeg * PI/180
    let vertices = [
      {x: 0, y: 0},
      {x: a, y: 0},
      {x: a , y: a},
      {x: 0 , y: a},
    ]
    this.rotateVertices(vertices, rotation)
    this.offsetVertices(vertices, offset)
    return createPolygon(vertices)
  }
  static Polygon(edge_count, offset = {x: 0, y: 0}, rotationDeg = 0) {

  }
  static Custom(vertices = [{x:0, y:0}], offset = {x: 0, y: 0}, rotationDeg = 0) {

  }
  static rotateVertices(vertices, rotation) {
    vertices.forEach((vertex) => {
      let newPos = vectorRotate(vertex.x, vertex.y, rotation)
      vertex.x = newPos.x
      vertex.y = newPos.y //this works
    })
  }
  static offsetVertices(vertices, offset) {
    vertices.forEach((vertex) => {   
      vertex.x += offset.x
      vertex.y += offset.y
    })
  }
}


class Collision {
  static polygonCircle(polygon, circle) {
    let vertices_array = []
    polygon.vertices.forEach((vertex)=> {
      vertices_array.push(vertex.x)
      vertices_array.push(vertex.y)
    })
    
    return Intersects.polygonCircle(
      vertices_array,
      circle.pos.x,
      circle.pos.y,
      circle.radius,
    )
  }
  static polygonPolygon(polygon1, polygon2) {
    //todo 
    return false
  }
  static circleCircle(circle1, circle2) {
    return Intersects.circleCircle(
      circle1.pos.x, circle1.pos.y, circle1.radius,
      circle2.pos.x, circle2.pos.y, circle2.radius,
    )
  }
  static boxBox(box1, box2) {
    return Intersects.boxBox(
      box1.x, box1.y, box1.dim.x, box1.dim.y, 
      box2.x, box2.y, box2.dim.x, box2.dim.y 
    )
  }
}

class HitboxTools {
  static drawPolygonHitbox(hitbox) {
    if(hitbox.type !== "polygon") return
    graphics.clear()
    hitbox.bodies.forEach((body) => {
      graphics.lineStyle(2, color, 1);
      body.vertices.forEach((vertex, index) => {
        graphics.moveTo(vertex.x, vertex.y);

        if(index === body.vertices.length - 1)
        graphics.lineTo(body.vertices[0].x, body.vertices[0].y);
        else
        graphics.lineTo(body.vertices[index + 1].x, body.vertices[index + 1].y);
      })
      graphics.closePath();
    })
  }
  static drawCircleHitbox(hitbox) {

  }
  static rotatePolygonHitbox(entity) {
    entity.hitbox.bodies.forEach((body, b) => {
      body.vertices.forEach((vertex, v) => {
        vertex.x = entity.hitbox_relative.bodies[b].vertices[v].x
        vertex.y = entity.hitbox_relative.bodies[b].vertices[v].y
      })
      body.rotate(-entity.rotation)
      body.vertices.forEach(vertex=> {
        vertex.x += entity.pos.x
        vertex.y += entity.pos.y
      })
    })
  }
  static updatePolygonHitbox(entity) {
    entity.hitbox.bodies.forEach((body, b) => {
      body.vertices.forEach((vertex, v) => {
        vertex.x = entity.pos.x + entity.hitbox_relative.bodies[b].vertices[v].x
        vertex.y = entity.pos.y + entity.hitbox_relative.bodies[b].vertices[v].y
      })
      body.edges = buildEdges(body)
    })
  }
}