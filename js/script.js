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

    // x??? l?? cd quay v?? d???ng

    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // x??? l?? ph??ng to thu nh??? cd

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // x??? l?? khi click play

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

      // khi ti???n ????? b??i h??t thay ?????i

      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progressPercent = Math.floor(
            (audio.currentTime / audio.duration) * 100
          );
          progress.value = progressPercent;
        }
      };

      // x??? l?? khi tua song

      progress.onchange = function (e) {
        const seekTime = (audio.duration / 100) * e.target.value;

        audio.currentTime = seekTime;
      };
    };

    // x??? l?? khi nh???n next song
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

    // x??? l?? khi nh???n prev song
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

    // x??? l?? khi random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // x??? l?? ph??t l???i l???p la??? song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // x??? l?? khi audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // l???ng nghe click v??o playlist
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

    // khi song ???????c play

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // khi song b??? pause
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

    // ?????nh ngh??a thu??c t??nh cho object l???y ra b??i h??t hi???n t???i
    this.defineProperties();

    // l???ng nghe / x??? l?? c??c s??? ki???n trong DOM
    this.handleEvent();

    // t???i th??ng tin b??i h??t hi???n t???i v??o UI
    this.loadCurrentSong();

    // Render playList
    this.render();

    //hien thi trang thai ban dau cua btn
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
