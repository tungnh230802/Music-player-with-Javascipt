const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");
const PLAYER_STORARE_KEY = "F8_PLAYER";

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORARE_KEY)) || {},
  songs: [
    {
      name: "Mackenzie Ziegler",
      singer: "kenzie",
      path: "./music/song1.mp3",
      Image: "./image/song1.jpg",
    },
    {
      name: "Mad at Disney",
      singer: "Karalang Fk",
      path: "./music/song2.mp3",
      Image: "./image/song2.jpg",
    },
    {
      name: "Phoebe Ryan - Mine ",
      singer: "Phoebe Ryan",
      path: "./music/song3.mp3",
      Image: "./image/song3.jpg",
    },
    {
      name: "Renai Circulation",
      singer: "Lizz Robinett",
      path: "./music/song4.mp3",
      Image: "./image/song4.jpg",
    },
    {
      name: "Kanojo Wa Tabi Ni Deru",
      singer: "Sana",
      path: "./music/song5.mp3",
      Image: "./image/song5.jpg",
    },
    {
      name: "Oblivion",
      singer: " Fred Edd",
      path: "./music/song6.mp3",
      Image: "./image/song6.png",
    },
    {
      name: "Wicked Wonderland",
      singer: "Tungevaag",
      path: "./music/song7.mp3",
      Image: "./image/song7.png",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORARE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? "active" : ""
        }" data-index = "${index}">
        <div
          class="thumb"
          style="
            background-image: url('${song.Image}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
        </div>
        `;
    });
    playList.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // xử lý cd quay và dừng

    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // xử lý phóng to thu nhỏ cd

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // xử lý khi click play

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

      // khi tiến độ bài hát thay đổi

      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;
        }
      };

      // xử lý khi tua song

      progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;

        audio.currentTime = seekTime;
      };
    };

    // xử lý khi nhấn next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // xử lý khi nhấn prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // xử lý khi random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // xử lý phát lại lặp laị song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // xử lý khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // lắng nghe click vào playlist
    playList.onclick = function (e) {
      //xu ly khi click vao song
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };

    // khi song được play

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.Image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) this.currentIndex = 0;

    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex <= 0) this.currentIndex = this.songs.length - 1;

    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  start: function () {
    // gan cau hinh tu config vao app
    this.loadConfig();

    // định nghĩa thuôc tính cho object lấy ra bài hát hiện tại
    this.defineProperties();

    // lắng nghe / xử lý các sự kiện trong DOM
    this.handleEvent();

    // tải thông tin bài hát hiện tại vào UI
    this.loadCurrentSong();

    // Render playList
    this.render();

    //hien thi trang thai ban dau cua btn
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
