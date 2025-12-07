"use strict";
let model = [];
fetch("model.json")
    .then(res => res.json())
    .then(data => {
    model = data || [];
});
function train(notes) {
    for (let i = 0; i < notes.length - 2; i++) {
        const prev = notes[i];
        const now = notes[i + 1];
        const next = notes[i + 2];
        const key = `${prev}|${now}`;
        let m = model.find(x => x.key === key);
        if (!m) {
            model.push({
                key,
                after: [{ note: next, count: 1 }]
            });
        }
        else {
            let a = m.after.find(x => x.note === next);
            if (a)
                a.count++;
            else
                m.after.push({ note: next, count: 1 });
        }
    }
    // 加終止符號
    const END = "<END>";
    if (notes.length >= 2) {
        model.push({
            key: `${notes[notes.length - 2]}|${notes[notes.length - 1]}`,
            after: [{ note: END, count: 1 }]
        });
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
