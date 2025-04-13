import {vector} from "./vector.js";
import {useState, useEffect} from "./states.js";
import {phasor} from "./phasors.js"
import "./helpers.js";

const docs = "";

// Core functions
function objectify(_plane, element, qualities) {
    (typeof element != "object") || (typeof qualities != "object") ? new Error("parameters of objectify not recognized as an object") : null;
    // try{
    // }catch(e){
    //     console.log("Some Error Occured at the time of object defining.");
    // }
    let width = element.style.width;
    let height = element.style.height;
    var [ele, setElement] = useState({ element: element, plane: _plane, definers: { position: {}, rotation: {}, direction: {}, cm: { X: (parseFloat(height) / 2), Y: (parseFloat(width) / 2) } } });

    return { object: element, qualities: qualities, getter: ele, updater: setElement };
}


const anim = {
    accelerate: (object, acceleration, directionVector, fortime, fromPoint = { x: 0, y: 0 }, callback = () => { }) => {
        if (!object || !directionVector || !fortime) {
            throw new Error('Invalid input for acceleration calculation');
        }

        const direction = vector.normalise(directionVector);
        const accelerationVector = vector.multiply(direction, acceleration);

        const xacc = vector.displacement(accelerationVector).x;
        const yacc = vector.displacement(accelerationVector).y;

        let startTime = null;
        let stopid = null;

        function animate(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }

            let progress = timestamp - startTime;
            let t = progress / 1000; // seconds

            let dx = 0.5 * xacc * t * t;
            let dy = 0.5 * yacc * t * t;

            let X = fromPoint.x + dx;
            let Y = fromPoint.y + dy;

            object.object.style.left = X + "px";
            object.object.style.top = Y + "px";

            object.updater((obj) => {
                obj.definers.position["X"] = X;
                obj.definers.position["Y"] = Y;
                obj.definers.direction = directionVector;
                return obj;
            });

            if (progress < fortime) {
                stopid = requestAnimationFrame(animate);
            } else {
                cancelAnimationFrame(stopid);
                callback(Math.round(X), Math.round(Y));
            }
        }

        stopid = requestAnimationFrame(animate);
    },

    velocity: (object, velocity, directionVector, fortime, fromPoint = { "x": 0, "y": 0 }, callback = () => { }) => {

        if (!object || !directionVector || !fortime) {
            throw new Error('Invalid input for velocity calculation');
        }

        let direction = vector.normalise(directionVector);

        let velocityVector = vector.multiply(direction, velocity);

        let xvelocity = vector.displacement(velocityVector).x;
        let yvelocity = vector.displacement(velocityVector).y;
        let startTime = null;

        function animate(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }
            let progress = timestamp - startTime;
            let t = progress / 1000; // seconds

            let dx = (progress / 1000) * xvelocity;
            let dy = (progress / 1000) * yvelocity;

            let X = fromPoint.x + dx;
            let Y = fromPoint.y + dy;

            object.object.style.left = X + "px";
            object.object.style.top = Y + "px";

            object.updater((obj) => {
                obj.definers.position["X"] = X;
                obj.definers.position["Y"] = Y;
                return obj;
            });


            if (progress < fortime) {
                var stopid = requestAnimationFrame(animate);
            }
            else {
                cancelAnimationFrame(stopid);
                let left = Math.round(object.object.style.left.replace("px", ""));
                let top = Math.round(object.object.style.top.replace("px", ""));
                callback(left, top);
            }
        }

        requestAnimationFrame(animate);

    },
    force: (element, force = 0, directionVector, fortime, fromPoint = { "x": 0, "y": 0 }, callback = () => { }) => {
        if (!element || !directionVector || !fortime) {
            throw new Error('Invalid input for force calculation');
        }
        let mass = element.qualities.mass;
        (!element.qualities.mass) ? new Error("Mass of object not defined in object qualities") : null;
        let accelaration = force / mass;
        anim.accelerate(element, accelaration, directionVector, fortime, fromPoint, callback);

    },
    drawVector: (vec, color = "blue") => {
        let line = document.createElement("div");
        let anglewithxaxis = (vector.angleWithXaxis(vec) * 180) / Math.PI;
        line.setAttribute("style", `position:fixed;top:0px;transform: rotate(${anglewithxaxis}deg);transform-origin: 0% 0%;;left:0px;height:4px;width:${2 * Math.round(vector.length(vec))}px;background-color:${color};z-index: 1000;display:block;`);
        document.body.appendChild(line);
    },
    rotate: (element, angle, direction, startFrom, forTime, callback = () => { }) => {
        if (!element || !angle || !forTime) {
            throw new Error("Invalid input for rotation");
        }

        let startTime = null;
        function animate(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }
            let progress = timestamp - startTime;
            if (progress < forTime) {
                let prevRotation = element.object.style.transform.replace("rotate(", "").replace("deg)", "").replace(")", "");
                // console.log(prevRotation);
                RoTT = element.object.style.transform = `rotate(${(startFrom) + (angle / forTime * progress * (direction == 1 ? 1 : -1))}deg)`;

                element.updater((obj) => {
                    obj.rotation["deg"] = RoTT;
                    return obj;
                });

                var stopid = requestAnimationFrame(animate);
            }
            else {
                cancelAnimationFrame(stopid);
                let left = Math.round(element.object.style.left.replace("px", ""));
                let top = Math.round(element.object.style.top.replace("px", ""));
                let currentRotation = Math.round(element.object.style.transform.replace("rotate(", "").replace("deg)", "").replace(")", ""));

                callback(left, top, currentRotation);
            }
        }
        requestAnimationFrame(animate);
    }
}


const instantaneous = {
    acceleration: (object, acceleration, _phasor, fortime, fromPoint = { x: 0, y: 0 }, callback = () => { }) => {
        if (!object || !_phasor || !fortime) {
            throw new Error('Invalid input for acceleration calculation');
        }

        let startTime = null;
        let lastFrameTime = null;

        let velocity = { x: 0, y: 0 };
        let position = { x: fromPoint.x, y: fromPoint.y };

        function animate(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
                lastFrameTime = timestamp;
            }

            let progress = timestamp - startTime;
            let deltaTime = (timestamp - lastFrameTime) / 1000; // In seconds
            lastFrameTime = timestamp;

            // Get current phasor direction
            const phasorReading = phasor.read(_phasor, timestamp);
            let direction = vector.define([0, 0], [phasorReading.X, phasorReading.Y]);
            direction = vector.normalise(direction);

            object.updater((obj) => {
                obj.direction = direction;
                return obj;
            });

            // Get acceleration vector in direction of phasor
            direction = obj.getter().direction;
            let accVec = vector.multiply(direction, acceleration);

            // Accumulate velocity
            velocity.x += accVec.end[0] * deltaTime;
            velocity.y += accVec.end[1] * deltaTime;

            // Update position
            position.x += velocity.x * deltaTime;
            position.y += velocity.y * deltaTime;

            // Move object on screen
            object.object.style.left = position.x + "px";
            object.object.style.top = position.y + "px";

            // Update object data
            object.updater((obj) => {
                obj.definers.position["X"] = position.x;
                obj.definers.position["Y"] = position.y;
                obj.velocity = { ...velocity };
                obj.direction = direction;
                return obj;
            });

            if (progress < fortime) {
                requestAnimationFrame(animate);
            } else {
                callback(Math.round(position.x), Math.round(position.y));
            }
        }

        requestAnimationFrame(animate);
    },
    velocity: (object, velocity, _phasor, fortime, fromPoint = { x: 0, y: 0 }, callback = () => { }) => {
        if (!object || !_phasor || !fortime) {
            throw new Error('Invalid input for velocity calculation');
        }

        let startTime = null;

        function animate(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }

            let progress = timestamp - startTime;

            const phasorReading = phasor.read(_phasor, startTime + progress);

            let direction = vector.define([0, 0], [phasorReading.X, phasorReading.Y]);
            let directionVector = vector.normalise(direction);

            let velocityVector = vector.multiply(directionVector, velocity);

            let xvelocity = vector.xlength(velocityVector);
            let yvelocity = vector.ylength(velocityVector);

            var X = (progress / 1000) * xvelocity + fromPoint.x;
            var Y = (progress / 1000) * yvelocity + fromPoint.y;

            object.object.style.left = X + "px";
            object.object.style.top = Y + "px";

            object.updater((obj) => {
                obj.definers.position["X"] = X;
                obj.definers.position["Y"] = Y;
                obj.direction = directionVector;
                return obj;
            });

            if (progress < fortime) {
                requestAnimationFrame(animate);
            } else {
                callback(Math.round(X), Math.round(Y));
            }
        }
        requestAnimationFrame(animate);
    }
};

class Plane {
    constructor() {
        this.gravity = false;
        return useState(""); // return [plane, setPlane, planeID]

    }
    // Now the locas will be predetermined until an event occures, at the time of event all the calculation will take place once again.
    gravity() {
        this.gravity = true;
    }
}

class Setup {
    constructor(plane) {
        this.objects = [];
        if (!plane) {
            throw new Error("Set constructor requires one plane to work with.");
        }
        let [_plane, setPlane, planeID] = plane;
        this._plane = _plane;
        this.setPlane = setPlane;
        this.planeID = planeID;
    }
    defineObjects(...objs) {
        if (!objs) {
            throw new Error("defineObjects require atleat one object to work with. Please reffer its docs:", docs);
        }
        this.objects = objs;
    }
    initialise(fn = () => { }) {
        if (!this._plane || !this.objects) {
            throw new Error("Set can't be initialised before defining objects, please reffer its docs:", docs);
        }
        fn(this.objects);
    }
}

let plane = new Plane();
let set = new Setup(plane);

// set.defineObjects(obj1, obj2);
// set.initialise(([obj1, obj2])=>{

// });