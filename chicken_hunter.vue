<template>
  <div class="center">
    <label>
      <h1>{{motivation}}</h1>
    </label>
    <label>
      {{freeplay}}
      <input type="checkbox" v-model="isFreeplay" />
    </label>
    <br />
    <br />
    <input
      type="range"
      :min="maxSpeed"
      :max="minSpeed"
      v-model="speed"
      :disabled="isFreeplay == false"
    />
    <br />

    <label v-if="levelUpCondition == true">{{ levelUpMessage }}</label>
    <div id="playground" class="playground">
      <label class="chicken-counter">{{ chickenCounter }}</label>
      <label class="point-counter">{{ counter }}</label>
      <img
        :id="link.id"
        :class="link.class"
        :src="link.src"
        :style="link.style"
        :key="i"
        v-for="(link, i) in enemies"
        @click="clickListener(i)"
      />
      <label class="speed">{{ speed/1000 }} {{speedUnit}}</label>
    </div>
  </div>
</template>

<script>
const ENEMY_WIDTH = 60;
const ENEMY_HEIGHT = 60;
const MAP_WIDTH = 650;
const MAP_HEIGHT = 488;
const ENEMIES_LIMIT = 10;
const MIN_SPEED = 3000;
const MAX_SPEED = 500;
const START_SPEED = MIN_SPEED;
const SPEED_MODIFICATION = 500;
const LEVEL_UP_LIMIT = 20;
const LEVEl_UP_TIMEOUT = 2000;

const MOTIVATION = "Találd el a csirkéket!";
const FREEPLAY = "Szabad játékmód?";
const SPEED_UNIT = "másodperc"

const LEVEL_UP_MESSAGE = "SZINT LÉPÉS, A JÁTÉK GYORSULT!";
const GAME_FINISHED =
  "GRATULÁLOK,  SIKERÜLT VISSZAVERNI A CSIRKÉK TÁMADÁSÁT. A JÁTÉK VÉGET ÉRT!";
const GAME_OVER = "VESZTETTÉL, A CSIRKÉK LEGYŐZTEK. A JÁTÉK VÉGET ÉRT!";

export default {
  data() {
    return {
      enemiesLoaded: [
        require("./assets/chicken1.png"),
        require("./assets/chicken2.png"),
        require("./assets/chicken3.png")
      ],
      enemies: [],
      counter: 0,
      speed: START_SPEED,
      minSpeed: MIN_SPEED,
      maxSpeed: MAX_SPEED,
      speedUnit: SPEED_UNIT,
      isFreeplay: false,
      levelUpCondition: false,
      levelUpMessage: LEVEL_UP_MESSAGE,
      chickenCounter: 0,
      motivation: MOTIVATION,
      freeplay: FREEPLAY
    };
  },
  methods: {
    clickListener(i) {
      if (this.chickenCounter >= ENEMIES_LIMIT && !this.isFreeplay) {
        return;
      }
      this.$set(this.enemies[i], "class", "enemy enemy-death");
      this.counter++;
      this.chickenCounter--;
    },
    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    loop() {
      if (this.counter >= LEVEL_UP_LIMIT && !this.isFreeplay) {
        if (this.speed == MIN_SPEED) {
          this.onGameOver();
          this.levelUpCondition = true;
          this.levelUpMessage = GAME_FINISHED;
          return;
        }
        this.speed -= SPEED_MODIFICATION;
        this.counter = 0;
        this.levelUpCondition = true;
        setTimeout(() => {
          this.levelUpCondition = false;
        }, LEVEl_UP_TIMEOUT);
      }
      const randForImage = this.getRndInteger(0, this.enemiesLoaded.length);
      const randForTop =
        this.getRndInteger(
          ENEMY_WIDTH / 2,
          MAP_HEIGHT - ENEMY_HEIGHT
        ).toString() + "px";
      const randForLeft =
        this.getRndInteger(
          ENEMY_WIDTH / 2,
          MAP_WIDTH - ENEMY_WIDTH
        ).toString() + "px";

      this.enemies.push({
        src: this.enemiesLoaded[randForImage],
        id: "enemy",
        class: "enemy enemy-spawn",
        style: {
          top: randForTop,
          left: randForLeft
        }
      });
      this.chickenCounter++;
      if (this.chickenCounter >= ENEMIES_LIMIT && !this.isFreeplay) {
        this.onGameOver();
        this.levelUpCondition = true;
        this.levelUpMessage = GAME_OVER;
        return;
      }
      window.setTimeout(this.loop, this.speed);
    },
    onInit() {
      this.loop();
    },
    onGameOver() {
      this.enemies = [];
      this.counter = 0;
      this.chickenCounter = 0;
    }
  },
  beforeMount() {
    this.onInit();
  }
};
</script>

<style>
.playground {
  background-image: url("./assets/background.jpg");
  width: 650px;
  height: 488px;
  margin: auto;
  position: relative;
}
.center {
  text-align: center;
}
.enemy {
  width: 60px;
  height: 60px;
  position: absolute;
}
.enemy-spawn {
  animation-name: appearAnimation;
  animation-duration: 250ms;
  animation-fill-mode: forwards;
}
.enemy-death {
  animation-name: disappearAnimation;
  animation-duration: 1000ms;
  animation-fill-mode: forwards;
}
.chicken-counter {
  color: red;
  font-size: 200%;
  position: absolute;
  top: 0;
  left: 0;
}
.point-counter {
  color: green;
  font-size: 200%;
  position: absolute;
  top: 0;
  right: 0;
}
.speed {
  color: blue;
  font-size: 200%;
  position: absolute;
  bottom: 0;
  right: 0;
}

@keyframes appearAnimation {
  0% {
    opacity: 0;
    height: 0px;
    width: 0px;
  }
  25% {
    opacity: 0.25;
    height: 15px;
    width: 15px;
  }
  50% {
    opacity: 0.5;
    height: 30px;
    width: 30px;
  }
  75% {
    opacity: 0.75;
    height: 45px;
    width: 45px;
  }
  100% {
    opacity: 1;
    height: 60px;
    width: 60px;
  }
}

@keyframes disappearAnimation {
  0% {
    opacity: 1;
    transform: rotateX(90deg);
  }
  50% {
    opacity: 0.5;
    transform: rotateX(0deg);
  }
  100% {
    display: none;
    opacity: 0;
    transform: rotateX(90deg);
  }
}
</style>