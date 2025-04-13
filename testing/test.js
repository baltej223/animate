let _plane =  new Plane();
let setup = new Setup(_plane);
let obj = objectify(_plane, document.getElementById('n'));

let directionVector = vector.define([0, 0], [1930,1000]).draw();
// directionVector.draw();

// anim.rotate(obj, 2000, 1, 0, 10000);

useEffect(()=>{
    // console.log(obj.getter().definers.position.Y);
    console.log(window.ids);
},[obj.getter]);

// let [getPhasor, setPhasor] = useState({X:phasor.read(_phasor).X, Y:phasor.read(_phasor).Y}); 

// let directionVector = _phasor;

// anim.velocity(obj, 100, directionVector, 5000, {x:0, y:0});
// anim.velocity(objectify(document.getElementById("m")), 300, directionVector.reverse(), Infinity, {x:1000, y:500})
// anim.accelerate(obj, 250000, directionVector.reverse(), 100,  {x,y}, (x,y)=>{
//     anim.accelerate(obj, 100, directionVector, 5000, {x:0, y:0}, (x,y)=>{
//         anim.accelerate(obj, 250000, directionVector.reverse(), 50,  {x,y}, (x,y)=>{
        
//         });
//     });
// })
let _phasor = phasor.define();
phasor.phasorMotion(_phasor, [
    // { length: 1000, omega: Math.PI/32, phaseDiff: 0, duration: 100 },
    // { length: 100, angular_acceleration: true, fromAngle: "prev", toAngle: Math.PI/2, runtime: 1000 },
    { length: 100, omega: Math.PI/32, phaseDiff: 0, duration: 500 },
]);

// phasor.phasorMotion(_phasor, [
//     { length: 100, omega: Math.PI / 2, phaseDiff: 0, duration: 8000 } // 90 deg/sec
// ], performance.now());


instantaneous.acceleration(obj, 100, _phasor, 100000, { x: 100, y: 100 }, (x, y) => {
    console.log("Final position:", x, y);
});
