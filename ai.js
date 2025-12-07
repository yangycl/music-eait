"use strict";
let model = [];
fetch("model.json")
    .then(res => res.json())
    .then(data => {
    modelData = data || [];
});
function train(notes) {
    for (let i = 0; i < notes.length - 1; i++) {
        const now = notes[i];
        const next = notes[i + 1];
        let m = model.find(x => x.value === now);
        if (!m) {
            model.push({
                value: now,
                after: [{ note: next, count: 1 }]
            });
        }
        else {
            let a = m.after.find(x => x.note === next);
            if (a) {
                a.count++;
            }
            else {
                m.after.push({
                    note: next,
                    count: 1
                });
            }
        }
    }
}
window.addEventListener("keydown", function (event) {
    if (event.code === "KeyS") {
        let stuTextArea = document.getElementById("stuNote");
        if (stuTextArea instanceof HTMLTextAreaElement) {
            let noteArr = stuTextArea.value
                .split(/\n|\s+/)
                .filter(x => x); // ✅ 過濾掉空字串
            train(noteArr);
            console.log(model); // ✅ 看看訓練結果
        }
    }
});
window.addEventListener("keydown", function (event) {
    if (event.code == "KeyD") {
        let blob = new Blob([JSON.stringify(model, null, 4)]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "model.json";
        a.click();
        URL.revokeObjectURL(url);
    }
});
