let obj = objectify(document.getElementById('n'));

// let directionVector = vector.define([0, 0], [1930,1000]).draw();
// directionVector.draw();

// anim.rotate(obj, 2000, 1, 0, 10000);

useEffect(()=>{
    // console.log(obj.getter().position.X);
},[obj.getter]);

// let [getPhasor, setPhasor] = useState({X:phasor.read(_phasor).X, Y:phasor.read(_phasor).Y}); 

// let directionVector = _phasor;

// anim.accelerate(obj, 100, directionVector, 5000, {x:0, y:0}, (x,y)=>{
//     anim.accelerate(obj, 250000, directionVector.reverse(), 100,  {x,y}, (x,y)=>{
//         anim.accelerate(obj, 100, directionVector, 5000, {x:0, y:0}, (x,y)=>{
//             anim.accelerate(obj, 250000, directionVector.reverse(), 50,  {x,y}, (x,y)=>{
            
//             })
//         });
//     })
// });

let _phasor = phasor.define();
phasor.phasorMotion(_phasor, [
    { length: 1000, omega: Math.PI/32, phaseDiff: 0, duration: 100 },
    { length: 100, angular_acceleration: true, fromAngle: "prev", toAngle: "prev + 3.14", runtime: 2000 },
    { length: 100, omega: -Math.PI/32, phaseDiff: "prev", duration: 1000 },
]);

instantaneous.accelaration(obj, 50, _phasor, Infinity, { x: 100, y: 100 }, (x, y) => {
    console.log("Final position:", x, y);
});
