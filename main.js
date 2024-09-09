const vector = {
    define: (from, to) => {
        if (!from || !to) {
            throw new Error('Invalid input for vector definition');
        }
        return { "start": [from[0], from[1]], "end": [to[0], to[1]] };
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
        return Math.atan2(vector1.cross(vector2), vector1.dot(vector2));
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
    reverse: (vector)=>{
        if (!vector || !vector.start || !vector.end) {
            throw new Error('Invalid vector input for reversal');
        }
        return { "start": [vector.end[0], vector.end[1]], "end": [vector.start[0], vector.start[1]] };
    }
    };

function objectify(element,qualities){
    (typeof element != "object") || (typeof qualities != "object")? new Error("parmeters of objectify not recogonised as an object"):null;
    return {"object":element,"qualities":qualities};
}

const anim = {
accelarate: (object, acceleration, directionVector, fortime,fromPoint = { "x": 0, "y": 0 },callback=()=>{}) => {
    if (!object || !directionVector || !fortime) {
        throw new Error('Invalid input for acceleration calculation');
    }
    let direction = vector.normalise(directionVector);

    let accelerationVector = vector.multiply(direction, acceleration);

    let xacc = vector.xlength(accelerationVector);
    let yacc= vector.ylength(accelerationVector);

    let postive_negative;
    if (directionVector.start[0] >= directionVector.end[0] && directionVector.start[1] >= directionVector.end[1]) {

        postive_negative = -1; 
    } else {

        postive_negative = 1;
    }
    let startTime =null;

    function animate(timestamp) { 

        if (startTime === null) {

            startTime = timestamp;
        }

        let progress = timestamp - startTime;
        const multiplier = postive_negative === 1 ? 1 : -1;

        object.object.style.left = 0.5 * xacc * multiplier * (progress/1000) ** 2 + fromPoint.x + "px"; 

        object.object.style.top = 0.5 * yacc * multiplier * (progress/1000) ** 2 + fromPoint.y +"px"; 

        if (progress < fortime) {
            var stopid =requestAnimationFrame(animate);
        }
        else{
            cancelAnimationFrame(stopid);
            let left = Math.round(object.object.style.left.replace("px",""));
            let top = Math.round(object.object.style.top.replace("px",""));
            callback(left,top);
        }
    }

    requestAnimationFrame(animate);

},
velocity: (object, velocity, directionVector, fortime,fromPoint = { "x": 0, "y": 0 },callback=()=>{}) => {

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
    let startTime = null

    function animate(timestamp) { 

        if (startTime===null) {

            startTime = timestamp;
        }

        let progress = timestamp - startTime;

        const multiplier = postive_negative === 1 ? 1 : -1;

        object.object.style.left = (progress / 1000) * multiplier * xvelocity + fromPoint.x + "px";
        object.object.style.top = (progress / 1000) * multiplier * yvelocity + fromPoint.y + "px";

        if (progress < fortime) {
            var stopid = requestAnimationFrame(animate);
        }
        else{
            cancelAnimationFrame(stopid);
            let left = Math.round(object.object.style.left.replace("px",""));
            let top = Math.round(object.object.style.top.replace("px",""));
            callback(left,top);
        }
    }

    requestAnimationFrame(animate);

},
force:(element, force=0, directionVector, fortime,fromPoint= { "x": 0, "y": 0 }, callback=()=>{})=>{
if (!element || !directionVector || !fortime) {
    throw new Error('Invalid input for force calculation');
}
let mass = element.qualities.mass;
(!element.qualities.mass)?new Error("Mass of object not defined in object qualities"):null;
let accelaration = force/mass;
anim.accelarate(element,accelaration,directionVector,fortime,fromPoint,callback);

},
drawVector:(vec,color="blue")=>{
    let line = document.createElement("div");
    let anglewithxaxis = (vector.angleWithXaxis(vec)*180)/Math.PI;
    line.setAttribute("style",`position:fixed;top:0px;transform: rotate(${anglewithxaxis}deg);transform-origin: 0% 0%;;left:0px;height:4px;width:${2*Math.round(vector.length(vec))}px;background-color:${color};z-index: 1000;display:block;`);
    document.body.appendChild(line);
},  
rotate:(element,angle,direction,startFrom,forTime,callback=()=>{})=>{ 
    if(!element || !angle || !forTime){
        throw new Error("Invalid input for rotation");
    }

    let startTime = null;
    function animate(timestamp){
        if(startTime === null){
            startTime = timestamp;
        }
        let progress = timestamp - startTime;
        if(progress < forTime){
            let prevRotation = element.object.style.transform.replace("rotate(","").replace("deg)","").replace(")","");
            console.log(prevRotation);
            element.object.style.transform = `rotate(${(startFrom)+(angle/forTime*progress*(direction == 1 ? 1 : -1))}deg)`;
            var stopid = requestAnimationFrame(animate);
        }
        else{
            cancelAnimationFrame(stopid);
            let left = Math.round(element.object.style.left.replace("px",""));
            let top = Math.round(element.object.style.top.replace("px",""));
            let currentRotation = Math.round(element.object.style.transform.replace("rotate(","").replace("deg)","").replace(")","")); 

            callback(left,top,currentRotation);
        }
    }
    requestAnimationFrame(animate);
}
}

