const docs = "";
const vector = {
    define: (from, to) => {
        if (!from || !to) {
            throw new Error('Invalid input for vector definition');
        }
        return { "type": "vector", "start": [from[0], from[1]], "end": [to[0], to[1]] };
    },
    length: (vector) => {
        if (!vector || !vector.start || !vector.end) {
            throw new Error('Invalid vector input for length calculation');
        }
        return Math.sqrt((vector.end[0] - vector.start[0]) * (vector.end[0] - vector.start[0]) + (vector.end[1] - vector.start[1]) * (vector.end[1] - vector.start[1]));
    },
    xlength: (vector) => {
        if (!vector || !vector.start || !vector.end) {
            throw new Error('Invalid vector input for xlength calculation');
        }
        return Math.abs(vector.end[0] - vector.start[0]);
    },
    ylength: (vector) => {
        if (!vector || !vector.start || !vector.end) {
            throw new Error('Invalid vector input for ylength calculation');
        }
        return Math.abs(vector.end[1] - vector.start[1]);
    },
    add: (vector1, vector2) => {
        if (!vector1 || !vector2 || !vector1.start || !vector1.end || !vector2.start || !vector2.end) {
            throw new Error('Invalid input for vector addition');
        }
        return { "start": [vector1.start[0] + vector2.start[0], vector1.start[1] + vector2.start[1]], "end": [vector1.end[0] + vector2.end[0], vector1.end[1] + vector2.end[1]] };
    },
    multiply: (vector, constant) => {
        if (!vector || !vector.start || !vector.end) {
            throw new Error('Invalid vector input for multiplication');
        }
        return { "start": [vector.start[0] * constant, vector.start[1] * constant], "end": [vector.end[0] * constant, vector.end[1] * constant] };
    },
    normalise: (vect) => {
        if (!vect || !vect.start || !vect.end) {
            throw new Error('Invalid vector input for normalisation');
        }
        return { "start": [vect.start[0] / vector.length(vect), vect.start[1] / vector.length(vect)], "end": [vect.end[0] / vector.length(vect), vect.end[1] / vector.length(vect)] };
    },
    dot: (vector1, vector2) => {
        if (!vector1 || !vector2 || !vector1.start || !vector1.end || !vector2.start || !vector2.end) {
            throw new Error('Invalid input for dot product calculation');
        }
        return (vector1.end[0] - vector1.start[0]) * (vector2.end[0] - vector2.start[0]) + (vector1.end[1] - vector1.start[1]) * (vector2.end[1] - vector2.start[1]);
    },
    cross: (vector1, vector2) => {
        if (!vector1 || !vector2 || !vector1.start || !vector1.end || !vector2.start || !vector2.end) {
            throw new Error('Invalid input for cross product calculation');
        }
        return (vector1.end[0] - vector1.start[0]) * (vector2.end[1] - vector2.start[1]) - (vector1.end[1] - vector1.start[1]) * (vector2.end[0] - vector2.start[0]);
    },
    angle: (vector1, vector2) => {
        if (!vector1 || !vector2 || !vector1.start || !vector1.end || !vector2.start || !vector2.end) {
            throw new Error('Invalid input for angle calculation');
        }
        return Math.atan2(
            vector.cross(vector1, vector2),
            vector.dot(vector1, vector2)
        );

    },
    subtract: (vector1, vector2) => {
        if (!vector1 || !vector2 || !vector1.start || !vector1.end || !vector2.start || !vector2.end) {
            throw new Error('Invalid input for vector subtraction');
        }
        return { "start": [vector1.start[0] - vector2.start[0], vector1.start[1] - vector2.start[1]], "end": [vector1.end[0] - vector2.end[0], vector1.end[1] - vector2.end[1]] };
    },
    divide: (vector, constant) => {
        if (!vector || !vector.start || !vector.end) {
            throw new Error('Invalid vector input for division');
        }
        return { "start": [vector.start[0] / constant, vector.start[1] / constant], "end": [vector.end[0] / constant, vector.end[1] / constant] };
    },
    angleWithXaxis: (vector) => {
        if (!vector || !vector.start || !vector.end) {
            throw new Error('Invalid vector input for angle calculation');
        }
        return Math.atan2(vector.end[1] - vector.start[1], vector.end[0] - vector.start[0]);

    },
    angleWithYaxis: (vector) => {
        if (!vector || !vector.start || !vector.end) {
            throw new Error('Invalid vector input for angle calculation');
        }
        return Math.atan2(vector.end[0] - vector.start[0], vector.end[1] - vector.start[1]);

    },
    reverse: (vector) => {
        if (!vector || !vector.start || !vector.end) {
            throw new Error('Invalid vector input for reversal');
        }
        return { "start": [vector.end[0], vector.end[1]], "end": [vector.start[0], vector.start[1]] };
    },
    combine: (...vectors) => {
        if (!vectors || vectors.length === 0) {
            throw new Error("No vectors provided for combination.");
        }

        let netStart = [0, 0];
        let netEnd = [0, 0];

        vectors.forEach(vec => {
            if (!vec || !vec.start || !vec.end) {
                throw new Error("Invalid vector in combination.");
            }

            netStart[0] += vec.start[0];
            netStart[1] += vec.start[1];
            netEnd[0] += vec.end[0];
            netEnd[1] += vec.end[1];
        });

        return { start: netStart, end: netEnd };
    }
};
////////////////////////////////////////
// Implementation of states in pure JS.
// Code copied from baltej223/vanillaStates
// Checkout https://github.com/baltej223/VanillaStates/

window.ids = {};
window.changeHooks = {};
let idCounter = 0;

function useEffect(fn, dependencies) {
    if (typeof fn !== "function" || !Array.isArray(dependencies)) {
        throw new Error("BAD PARAMETERS: useEffect requires a function and an array.");
    }

    dependencies.forEach((getStateFn) => {
        if (typeof getStateFn !== "function") {
            throw new Error("BAD PARAMETERS: Dependencies must be numbers.");
        }
        let id = getStateFn("get-id");
        window.changeHooks[id] = fn;
    });

    dependencies.forEach((getStateFn) => {
        let id = getStateFn("This is passed to get the id of the state");
        if (window.ids[id] !== undefined) {
            fn(window.ids[id]);
        }
    });
}

function handleChanges(id) {
    const fnToRun = window.changeHooks[id];
    if (typeof fnToRun === "function") {
        fnToRun(window.ids[id]);
    }
}

function useState(initialValue) {
    let id = idCounter++;
    window.ids[id] = initialValue;


    const setState = (updateValueFn) => {
        if (typeof updateValueFn !== "function") {
            throw new Error("State updater must be a function!");
        }

        window.ids[id] = updateValueFn(window.ids[id]);
        handleChanges(id);
    };
    const getter = (get_id) => {
        if (get_id == undefined) {
            return window.ids[id];
        }
        else {
            return id;
        }
    }
    return [getter, setState, id];

}
////////////////////////////////////////

const phasor = {
    define() {
        return {
            timeline: [],
            currentIndex: 0,
        };
    },

    phasorMotion(phasorObj, keyframes) {
        let timeline = [];
        let now = Date.now();
        let lastEndAngle = 0;
        let lastOmega = 0;
        let totalTime = 0;

        for (let frame of keyframes) {
            let entry = {};
            entry.startTime = now + totalTime;
            entry.duration = frame.duration ?? frame.runtime ?? 1000;
            entry.length = frame.length ?? 0;
            entry.type = "constant";
            entry.omega = frame.omega ?? lastOmega;

            entry.phaseDiff = frame.phaseDiff === "prev" ? lastEndAngle : (frame.phaseDiff ?? 0);

            if (frame.angular_acceleration === true) {
                entry.type = "accelerating";

                entry.fromAngle =
                    frame.fromAngle === "prev"
                        ? lastEndAngle
                        : typeof frame.fromAngle === "string" && frame.fromAngle.startsWith("prev +")
                            ? lastEndAngle + parseFloat(frame.fromAngle.split("+")[1])
                            : parseFloat(frame.fromAngle);

                entry.toAngle =
                    frame.toAngle === "prev"
                        ? lastEndAngle
                        : typeof frame.toAngle === "string" && frame.toAngle.startsWith("prev +")
                            ? lastEndAngle + parseFloat(frame.toAngle.split("+")[1])
                            : parseFloat(frame.toAngle);

                if (isNaN(entry.fromAngle) || isNaN(entry.toAngle)) {
                    throw new Error(`Invalid angles: from=${frame.fromAngle}, to=${frame.toAngle}`);
                }

                entry.angleDiff = entry.toAngle - entry.fromAngle;
                let durationSec = entry.duration / 1000;

                entry.alpha = (2 * entry.angleDiff) / (durationSec ** 2);
                entry.omega = (entry.angleDiff / durationSec) - (0.5 * entry.alpha * durationSec);
            }

            timeline.push(entry);
            totalTime += entry.duration;
            lastOmega = entry.omega;

            lastEndAngle = (entry.type === "accelerating")
                ? entry.toAngle
                : (entry.omega * (entry.duration / 1000)) + entry.phaseDiff;
        }

        phasorObj.timeline = timeline;
    },

    read: (phasorObj, time) => {
        if (time == undefined){
            time = Date.now();
        }
        if (!phasorObj.timeline || phasorObj.timeline.length === 0) return { x: 0, y: 0, angle: 0 };
    
        let currentFrame = phasorObj.timeline.find((entry, idx) => {
            let elapsed = time - entry.startTime;
            let withinFrame = elapsed >= 0 && elapsed <= entry.duration;
            if (withinFrame) phasorObj.currentIndex = idx;
            return withinFrame;
        }) || phasorObj.timeline[phasorObj.timeline.length - 1];
    
        if (!currentFrame) return { x: 0, y: 0, angle: 0 };
    
        let elapsed = time - currentFrame.startTime;
        let angle = 0;
    
        if (currentFrame.type === "accelerating") {
            let t = elapsed / 1000;
            angle = currentFrame.fromAngle + currentFrame.omega * t + 0.5 * currentFrame.alpha * t * t;
        } else {
            let t = elapsed / 1000;
            console.log("elapsed", elapsed);
            angle = currentFrame.phaseDiff + currentFrame.omega * t;
        }

        console.log(angle, currentFrame);
        return {
            X: Math.cos(angle) * (currentFrame.length ?? 1),
            Y: Math.sin(angle) * (currentFrame.length ?? 1),
            angle: angle,
        };
    }    
};


function objectify(element, qualities) {
    (typeof element != "object") || (typeof qualities != "object") ? new Error("parameters of objectify not recognized as an object") : null;
    // try{
    // }catch(e){
    //     console.log("Some Error Occured at the time of object defining.");
    // }
    var [ele, setElement] = useState({ element: element, position: {}, rotation: {}, direction: {} });

    return { "object": element, "qualities": qualities, getter: ele, updater: setElement };
}


const anim = {
    accelerate: (object, acceleration, directionVector, fortime, fromPoint = { "x": 0, "y": 0 }, callback = () => { }) => {
        if (!object || !directionVector || !fortime) {
            throw new Error('Invalid input for acceleration calculation');
        }
        var direction = vector.normalise(directionVector);

        var accelerationVector = vector.multiply(direction, acceleration);

        var xacc = vector.xlength(accelerationVector);
        var yacc = vector.ylength(accelerationVector);

        var postive_negative;
        if (directionVector.start[0] >= directionVector.end[0] && directionVector.start[1] >= directionVector.end[1]) {

            postive_negative = -1;
        } else {

            postive_negative = 1;
        }
        var startTime = null;
        function animate(timestamp) {

            if (startTime === null) {
                startTime = timestamp;
            }

            let progress = timestamp - startTime;

            const multiplier = postive_negative === 1 ? 1 : -1;

            X = object.object.style.left = 0.5 * xacc * multiplier * (progress / 1000) ** 2 + fromPoint.x + "px";

            Y = object.object.style.top = 0.5 * yacc * multiplier * (progress / 1000) ** 2 + fromPoint.y + "px";

            object.updater((obj) => {
                obj.position["X"] = X;
                obj.position["Y"] = Y;
                obj.direction = directionVector;
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
    velocity: (object, velocity, directionVector, fortime, fromPoint = { "x": 0, "y": 0 }, callback = () => { }) => {

        if (!object || !directionVector || !fortime) {
            throw new Error('Invalid input for velocity calculation');
        }

        let direction = vector.normalise(directionVector);

        let velocityVector = vector.multiply(direction, velocity);

        let postive_negative;

        if (directionVector.start[0] >= directionVector.end[0] && directionVector.start[1] >= directionVector.end[1]) {

            postive_negative = -1;
        } else {

            postive_negative = 1;
        }

        let xvelocity = vector.xlength(velocityVector);
        let yvelocity = vector.ylength(velocityVector);
        let startTime = null;

        function animate(timestamp) {

            if (startTime === null) {

                startTime = timestamp;
            }

            let progress = timestamp - startTime;

            const multiplier = postive_negative === 1 ? 1 : -1;

            object.object.style.left = (progress / 1000) * multiplier * xvelocity + fromPoint.x + "px";
            object.object.style.top = (progress / 1000) * multiplier * yvelocity + fromPoint.y + "px";

            object.updater((obj) => {
                obj.position["X"] = X;
                obj.position["Y"] = Y;
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

Object.prototype.draw = function (color) {
    anim.drawVector(this, color)
    return this;
}

Object.prototype.reverse = function () {
    return vector.reverse(this);;
}
const instantaneous = {
    accelaration: (object, acceleration, _phasor, fortime, fromPoint = { x: 0, y: 0 }, callback = () => { }) => {
        if (!object || !_phasor || !fortime) {
            throw new Error('Invalid input for acceleration calculation');
        }

        let startTime = null; // Move this outside the animation function

        function animate(timestamp) {
            if (startTime === null) {
                startTime = timestamp;
            }
        
            let progress = timestamp - startTime;
        
            // Get time-specific phasor reading
            const phasorReading = phasor.read(_phasor, startTime + progress);
        
            // Create direction vector from (0,0) to phasor endpoint
            let direction = vector.define([0, 0], [phasorReading.X, phasorReading.Y]);
            direction = vector.normalise(direction);
        
            let accelerationVector = vector.multiply(direction, acceleration);
        
            let xacc = vector.xlength(accelerationVector);
            let yacc = vector.ylength(accelerationVector);
        
            // Calculate new position based on time and acceleration vector
            let X = 0.5 * xacc * (progress / 1000) ** 2 + fromPoint.x;
            let Y = 0.5 * yacc * (progress / 1000) ** 2 + fromPoint.y;
        
            // Move object on screen
            object.object.style.left = X + "px";
            object.object.style.top = Y + "px";
        
            object.updater((obj) => {
                obj.position["X"] = X;
                obj.position["Y"] = Y;
                obj.direction = direction;
                return obj;
            });
        
            if (progress < fortime) {
                requestAnimationFrame(animate);
            } else {
                let left = Math.round(X);
                let top = Math.round(Y);
                callback(left, top);
            }
        }
        

        requestAnimationFrame(animate);
    }
};
