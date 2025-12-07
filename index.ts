var score = document.getElementById("score");
interface hzAndTime{
    hz:number;
    time:number
}
const audioCtx = new AudioContext();
let modelData:unknown;
fetch("model.json")
    .then(res => res.json())
    .then(data=>{
        modelData = data
    })
;//載入ai模型

function setHzAndTime(soundStr: string): hzAndTime {
    let hz: number = 0;
    let time: number = 1;
    
    for (let i = 0; i < soundStr.length; i++) {
        switch (soundStr[i]) {
            case "1":
                hz = 261.6; // 低音 C
                break;
            case "2":
                hz = 293.7; // 低音 D
                break;
            case "3":
                hz = 329.6; // 低音 E
                break;
            case "4":
                hz = 349.2; // 低音 F
                break;
            case "5":
                hz = 392.0; // 低音 G
                break;
            case "6":
                hz = 440.0; // 低音 A
                break;
            case "7":
                hz = 493.9; // 低音 B
                break;
            case "-":
                time ++;
                break;

            case "^":
                time /= 2;
                break;

            case ".":
                time *= 1.5;
                break;

            case ",":
                hz /= 2;
                break;

            case "'":
                hz *= 2;
                break;
        }
    }
    
    return {
        hz: hz,
        time: time*0.75
    };
}
class sound{
    soundStr:string;
    hz:number;
    time:number;
    constructor(soundStr:string){
        this.soundStr = soundStr;
        let set = setHzAndTime(soundStr);
        this.hz = set.hz;
        this.time = set.time;
        
    }
    draw():void{
        if(score instanceof HTMLTextAreaElement){
            score.value += this.soundStr; 
        }
    }
    play(startTime: number): void {
        if(this.hz == 0){
            setTimeout(() => {
                 
            }, this.time);
            return;
        }
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = this.hz;
        oscillator.connect(audioCtx.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + this.time);
    }
    

}


var soundArr:sound[] = [];
function updateSoundArr(soundText:string){
    let soundTextArr:string[] = soundText.split(/\s+|\n/);
    for (let partSoundText of soundTextArr){
        let waitPushObj = new sound(partSoundText);
        soundArr.push(waitPushObj); 
    }
}
var playBtn = document.getElementById("playBtn");
if(playBtn){
    playBtn.addEventListener("click", async () => {
        soundArr = [];
        if(score instanceof HTMLTextAreaElement){
            updateSoundArr(score.value)
        }
        await audioCtx.resume();  // 等待 AudioContext 啟動
        audioCtx.resume().then(() => {
            let currentTime = audioCtx.currentTime;
            for (let soundData of soundArr) {
                soundData.play(currentTime);
                currentTime += soundData.time;
            }
        });
    
    });
}else{
    throw new Error("找不到playBtn");
}
function choose(model: any[]): string {
    if (!model || model.length === 0)
        throw new Error("choose: model 空");

    const after = model[0].after;

    if (!after || after.length === 0)
        throw new Error("choose: after 空");

    // 計算權重總和
    let total = 0;
    for (let a of after) {
        if (typeof a.count !== "number" || a.count <= 0)
            throw new Error("choose: count 非正常數值");
        total += a.count;
    }

    // 0～total 的亂數
    let r = Math.random() * total;

    // 找到 r 落在哪個區間
    for (let a of after) {
        if (r < a.count)
            return a.note;

        r -= a.count;
    }

    // 理論上永遠不會到這裡
    throw new Error("choose: 達到不可能的狀態!");
}

let aibtn = document.getElementById("aibtn");
if(aibtn){
    aibtn?.addEventListener("click", () => {

        if (!(score instanceof HTMLTextAreaElement)) return;

        
        let soundArr = score.value.split(/\n|\s+/).filter(x=>x);

        // model 尚未讀到 JSON
        if (!Array.isArray(modelData)) {
            alert("模型還沒載入完成！");
            return;
        }

        for (let i = 0; i < 30 - soundArr.length; i++) {

            let now = soundArr[soundArr.length - 1];

            now = now.trim();
            console.log(now);
            let prev = soundArr[soundArr.length - 2];

            // 找現在這個音
            let nowModel = modelData.find((x:any) => x.key === `${prev}|${now}`);

            if (!nowModel) break; // 找不到就停

            if (!Array.isArray(nowModel.after) || nowModel.after.length === 0) break;

            // 依隨機數找 probability
            let next = choose([nowModel]);

            if (!next)
                throw new Error("choose 回傳 undefined（不可能）");

            soundArr.push(next);
        }

        score.value = soundArr.join(" ");
    });
}else{
    throw new Error("找不到aibtn")
}

