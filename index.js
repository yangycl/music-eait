"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var score = document.getElementById("score");
const audioCtx = new AudioContext();
function setHzAndTime(soundStr) {
    let hz = 0;
    let time = 1;
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
                time++;
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
        time: time * 0.75
    };
}
class sound {
    constructor(soundStr) {
        this.soundStr = soundStr;
        let set = setHzAndTime(soundStr);
        this.hz = set.hz;
        this.time = set.time;
    }
    draw() {
        if (score instanceof HTMLTextAreaElement) {
            score.value += this.soundStr;
        }
    }
    play(startTime) {
        if (this.hz == 0) {
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
var soundArr = [];
function updateSoundArr(soundText) {
    let soundTextArr = soundText.split(/\s+|\n/);
    for (let partSoundText of soundTextArr) {
        let waitPushObj = new sound(partSoundText);
        soundArr.push(waitPushObj);
    }
}
var playBtn = document.getElementById("playBtn");
if (playBtn) {
    playBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        soundArr = [];
        if (score instanceof HTMLTextAreaElement) {
            updateSoundArr(score.value);
        }
        yield audioCtx.resume(); // 等待 AudioContext 啟動
        audioCtx.resume().then(() => {
            let currentTime = audioCtx.currentTime;
            for (let soundData of soundArr) {
                soundData.play(currentTime);
                currentTime += soundData.time;
            }
        });
    }));
}
else {
    throw new Error("找不到playBtn");
}
