# Physics Animation Engine

This is a JavaScript-based animation engine for the browser that simulates realistic physics using DOM elements. It supports concepts like vectors, forces, acceleration, velocity, rotation, and allows you to model and animate object behaviors in a 2D space. The engine has been designed to be modular, stateful, and extensible, and it leverages custom vector math and animation logic.

---

## 📦 Core Concepts

### 1. Vectors

Vectors are defined as directed line segments between two points in 2D space. In this library, a vector is an object with a `start` and `end` array, each having `[x, y]` coordinates.

```js
const vec = vector.define([0, 0], [10, 10]);
// => { start: [0, 0], end: [10, 10] }
```

#### Vector Utilities

- `vector.length(v)`: Euclidean length.
- `vector.xlength(v)`: Horizontal component.
- `vector.ylength(v)`: Vertical component.
- `vector.add(v1, v2)`: Vector addition.
- `vector.subtract(v1, v2)`: Vector subtraction.
- `vector.multiply(v, scalar)`: Scales a vector.
- `vector.divide(v, scalar)`: Scales down a vector.
- `vector.normalise(v)`: Returns a unit vector.
- `vector.dot(v1, v2)`: Dot product.
- `vector.cross(v1, v2)`: Cross product.
- `vector.angle(v1, v2)`: Angle between vectors in radians.
- `vector.angleWithXaxis(v)`, `vector.angleWithYaxis(v)`
- `vector.reverse(v)`: Flips vector direction.
- `vector.combine(...v)`: Combines multiple vectors.

### 2. Stateful DOM Element Wrapping

We use `objectify(element, qualities)` to wrap a DOM element with physics state:

```js
const box = objectify(document.getElementById("box"), { mass: 2 });
```

Returns:

```js
{
  object: DOMElement,
  qualities: { mass: 2 },
  getter: Function -> get internal state,
  updater: Function -> update internal state
}
```

Each object tracks its own position and rotation using a custom `useState` function (inspired by React).

### 3. Custom useState Implementation

This is a minimal state system:

```js
const [getter, setter, id] = useState(initialValue);
```

- `getter()` returns current state.
- `setter(updateFn)` updates state.
- `id` is the unique identifier.

We also provide `useEffect(callback, [dependencies])` that binds an effect to states. It runs the callback when a dependency state changes.

---

## ⚙️ Animation Engine - `anim`

### `anim.accelerate(...)`

Animates an element using a directional acceleration vector.

**Signature:**

```js
anim.accelerate(object, acceleration, directionVector, fortime, fromPoint, callback)
```

- `acceleration`: scalar value
- `directionVector`: unit direction vector
- `fortime`: duration in ms
- `fromPoint`: starting offset `{ x, y }`

The animation uses physics:

```
displacement = 0.5 * a * t^2
```

DOM element's `style.left` and `style.top` are updated every frame.

Edge cases:

- Non-unit direction vector → it is normalized.
- Opposing vectors → signs handled by `postive_negative` flag.

### `anim.velocity(...)`

Same as `accelerate`, but with a constant speed:

```
displacement = velocity * t
```

### `anim.force(...)`

Shortcut to apply force via:

```
F = m * a
```

It internally calls `accelerate` after computing acceleration from mass.

### `anim.rotate(...)`

Rotates a DOM element by `angle` degrees, clockwise or anti-clockwise.

```js
anim.rotate(element, angle, direction, startFrom, forTime, callback);
```

- `direction`: 1 for clockwise, -1 for counter.
- `startFrom`: angle in degrees.

---

## ➕ Vector Drawing

```js
anim.drawVector(vec, "red");
```

Draws a div element visually representing the vector.

Uses CSS `transform: rotate(...)` and `width` from vector length. Positioned absolutely.

---

## 🧠 Object Prototype Extensions

We’ve added:

```js
Object.prototype.draw = function(color) {...};
Object.prototype.reverse = function() {...};
```

Now you can do:

```js
vector.define([0,0],[20,30]).draw("blue").reverse().draw("red");
```

---

## 🔁 Real-Time State Tracking

Each animated object stores its `position` and `rotation` internally using the custom state system. You can:

```js
let pos = obj.getter();
console.log(pos.position.X, pos.rotation.deg);
```

---

## 🔁 Multiple Forces & Dynamic Vectors

A single animation can only act on one direction vector, so to simulate **changing vectors** or **multiple forces**, you need to:

- Compose vectors using `vector.add()`.
- Track timing offsets.
- Sum forces before applying acceleration.

**Example: Multiple accelerations on object**

```js
let a1 = vector.define([0,0],[5,0]);
let a2 = vector.define([0,0],[0,5]);
let final = vector.combine(a1, a2);
anim.accelerate(obj, 3, final, 2000);
```

For offset forces:

```js
anim.accelerate(obj, 2, a1, 2000, {x:0,y:0}, ()=>{
  anim.accelerate(obj, 3, a2, 2000, {
    x: parseInt(obj.object.style.left),
    y: parseInt(obj.object.style.top)
  });
});
```

---

## 🔥 Edge Cases & Validation

### Invalid Inputs

Each function throws descriptive errors for:

- Missing DOM objects.
- Zero mass in force function.
- Invalid vectors (non-array, missing `start` or `end`).
- State functions with wrong signatures.

### CSS edge quirks

- Rotation resets existing transform styles.
- Use `position: fixed` or `absolute` on animated elements.

---

## 📈 Diagrams (Example Render)

```
+----------------------+         +----------------------+
|  DOM element (box)   |         |  Vector Definition   |
+----------------------+         +----------------------+
|  <div id="box">       | <--\     | start: [0, 0]        |
|  style.left          |     |--> | end: [100, 100]      |
|  style.top           |     |    +----------------------+
+----------------------+     |           ↓
                              |      Normalized Vector
+----------------------+     |           ↓
|    useState          |     |   +----------------------+
|  object.position     |<----/   | x length, y length    |
|  object.rotation     |         +----------------------+
+----------------------+               ↓
                                      ↓
                        +-----------------------------+
                        |     requestAnimationFrame    |
                        +-----------------------------+
```

---

## 🧪 Testing & Debug

To test visually:

- Place a `<div>` with style.

```html
<div id="ball" style="position:fixed;width:50px;height:50px;background:red;"></div>
```

Then:

```js
let obj = objectify(document.getElementById("ball"), { mass: 3 });
let dir = vector.define([0, 0], [100, 0]);
anim.force(obj, 6, dir, 2000);
```

Watch the red ball move!

---

## ✅ Future Scope

- Vector fields
- Elastic collisions
- Gravity simulation
- Mouse force dragging
- Custom easing
- Spring physics

---

## ✅ Author Notes

Built by Baltej Singh (Bavi) as a creative physics visualizer and animation system. It started as a deep dive into vector logic and evolved into a full-blown DOM physics engine.

Happy hacking!

---

*Full API docs and advanced topics like chainable anims, pausing, reversing, and vector fields coming soon.*

