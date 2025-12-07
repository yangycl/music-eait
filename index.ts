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
;

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
function aiMax(model: any[]): number {
    let max = 0;

    for (let m of model) {
        if (!Array.isArray(m.after)) continue;

        for (let a of m.after) {
            if (typeof a.count === "number") {
                if (a.count > max) max = a.count;
            }
        }
    }

    return max;
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

            // 找現在這個音
            let nowModel = modelData.find((x:any) => x.value === now);

            if (!nowModel) break; // 找不到就停

            if (!Array.isArray(nowModel.after) || nowModel.after.length === 0) break;

            // 找最高 probability
            let max = aiMax([nowModel]);

            let choice = nowModel.after.find((x:any)=>x.count === max);

            if (!choice) break;

            soundArr.push(choice.note);
        }

        score.value = soundArr.join(" ");
    });
}else{
    throw new Error("找不到aibtn")
}

