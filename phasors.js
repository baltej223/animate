export const phasor = {
    define() {
        return {
            timeline: [],
            currentIndex: 0,
        };
    },

    phasorMotion(phasorObj, keyframes, startTime = performance.now()) {
        let timeline = [];
        let now = startTime; // Use explicit base time instead of Date.now()
        phasorObj.startBaseTime = now; // Store this as a reference

        let lastEndAngle = 0, lastOmega = 0, totalTime = 0;

        for (let frame of keyframes) {
            let entry = {};
            entry.startTime = totalTime; // Changed: relative time in ms
            entry.duration = frame.duration ?? frame.runtime ?? 1000;
            entry.length = frame.length ?? 0;
            entry.type = "constant";
            entry.omega = frame.omega ?? lastOmega;
            entry.phaseDiff = frame.phaseDiff === "prev" ? lastEndAngle : (frame.phaseDiff ?? 0);

            if (frame.angular_acceleration) {
                entry.type = "accelerating";
                entry.fromAngle = typeof frame.fromAngle === "string" && frame.fromAngle.includes("prev")
                    ? lastEndAngle + (parseFloat(frame.fromAngle.split("+")[1]) || 0)
                    : parseFloat(frame.fromAngle);
                entry.toAngle = typeof frame.toAngle === "string" && frame.toAngle.includes("prev")
                    ? lastEndAngle + (parseFloat(frame.toAngle.split("+")[1]) || 0)
                    : parseFloat(frame.toAngle);
                let t = entry.duration / 1000;
                entry.angleDiff = entry.toAngle - entry.fromAngle;
                entry.alpha = (2 * entry.angleDiff) / (t ** 2);
                entry.omega = (entry.angleDiff / t) - (0.5 * entry.alpha * t);
            }

            timeline.push(entry);
            totalTime += entry.duration;
            lastOmega = entry.omega;
            lastEndAngle = (entry.type === "accelerating")
                ? entry.toAngle
                : entry.phaseDiff + (entry.omega * entry.duration / 1000);
        }

        phasorObj.timeline = timeline;
        phasorObj.startTime = startTime; // Save this for future reads
    },

    read: (phasorObj, time) => {
        if (time == undefined) {
            time = performance.now(); // always relative to performance.now()
        }
        if (!phasorObj.timeline || phasorObj.timeline.length === 0) return { x: 0, y: 0, angle: 0 };

        const base = phasorObj.startTime ?? performance.now();
        const relativeTime = time - base;

        let currentFrame = phasorObj.timeline.find((entry, idx) => {
            let elapsed = relativeTime - (entry.startTime - base);
            let withinFrame = elapsed >= 0 && elapsed <= entry.duration;
            if (withinFrame) phasorObj.currentIndex = idx;
            return withinFrame;
        }) || phasorObj.timeline[phasorObj.timeline.length - 1];

        if (!currentFrame) return { x: 0, y: 0, angle: 0 };

        let elapsed = relativeTime - (currentFrame.startTime - base);
        let t = elapsed / 1000;

        let angle = currentFrame.type === "accelerating"
            ? currentFrame.fromAngle + currentFrame.omega * t + 0.5 * currentFrame.alpha * t * t
            : currentFrame.phaseDiff + currentFrame.omega * t;

        return {
            X: Math.cos(angle) * (currentFrame.length ?? 1),
            Y: Math.sin(angle) * (currentFrame.length ?? 1),
            angle: angle,
        };
    }
};
