export const vector = {
    define: (from, to) => {
        if (!from || !to)
            throw new Error('Invalid input for vector definition');
        return { "type": "vector", start: [from[0], from[1]], end: [to[0], to[1]] };
    },

    length: (vec) => {
        const dx = vec.end[0] - vec.start[0];
        const dy = vec.end[1] - vec.start[1];
        return Math.sqrt(dx * dx + dy * dy);
    },

    displacement: (vec) => {
        return {
        x: vec.end[0] - vec.start[0],
        y: vec.end[1] - vec.start[1],
        }
    },

    xlength: (vec) => Math.abs(vec.end[0] - vec.start[0]),
    ylength: (vec) => Math.abs(vec.end[1] - vec.start[1]),

    add: (v1, v2) => ({
        start: [v1.start[0] + v2.start[0], v1.start[1] + v2.start[1]],
        end: [v1.end[0] + v2.end[0], v1.end[1] + v2.end[1]]
    }),

    subtract: (v1, v2) => ({
        start: [v1.start[0] - v2.start[0], v1.start[1] - v2.start[1]],
        end: [v1.end[0] - v2.end[0], v1.end[1] - v2.end[1]]
    }),

    multiply: (vec, constant) => {
        const { x, y } = vector.displacement(vec);
        return {
            start: [...vec.start],
            end: [vec.start[0] + x * constant, vec.start[1] + y * constant]
        };
    },

    divide: (vec, constant) => {
        const { x, y } = vector.displacement(vec);
        return {
            start: [...vec.start],
            end: [vec.start[0] + x / constant, vec.start[1] + y / constant]
        };
    },

    normalise: (vec) => {
        const { x, y } = vector.displacement(vec);
        const len = Math.sqrt(x * x + y * y);
        if (len === 0) return { start: [0, 0], end: [0, 0] };
        return {
            start: [0, 0],
            end: [x / len, y / len]
        };
    },

    dot: (v1, v2) => {
        const a = vector.displacement(v1);
        const b = vector.displacement(v2);
        return a.x * b.x + a.y * b.y;
    },

    cross: (v1, v2) => {
        const a = vector.displacement(v1);
        const b = vector.displacement(v2);
        return a.x * b.y - a.y * b.x;
    },

    angle: (v1, v2) => {
        return Math.atan2(
            vector.cross(v1, v2),
            vector.dot(v1, v2)
        );
    },

    angleWithXaxis: (vec) => {
        const { x, y } = vector.displacement(vec);
        return Math.atan2(y, x);
    },

    angleWithYaxis: (vec) => {
        const { x, y } = vector.displacement(vec);
        return Math.atan2(x, y); // Yes, x over y here for Y-axis angle
    },

    reverse: (vec) => ({
        start: [...vec.end],
        end: [...vec.start]
    }),

    combine: (...vectors) => {
        let netStart = [0, 0], netEnd = [0, 0];
        vectors.forEach(vec => {
            if (!vec || !vec.start || !vec.end) throw new Error("Invalid vector in combination.");
            netStart[0] += vec.start[0];
            netStart[1] += vec.start[1];
            netEnd[0] += vec.end[0];
            netEnd[1] += vec.end[1];
        });
        return { start: netStart, end: netEnd };
    }
};
