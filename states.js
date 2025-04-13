////////////////////////////////////////
// Implementation of states in pure JS.
// Code copied from baltej223/vanillaStates
// Checkout https://github.com/baltej223/VanillaStates/ for its docs.

window.ids = {};
window.changeHooks = {};
let idCounter = 0;

export function useEffect(fn, dependencies) {
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

export function handleChanges(id) {
    const fnToRun = window.changeHooks[id];
    if (typeof fnToRun === "function") {
        fnToRun(window.ids[id]);
    }
}

export function useState(initialValue) {
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