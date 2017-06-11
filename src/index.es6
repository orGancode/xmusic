import './style.css';
import './progress.css';
import $ from '../static/jquery-3.0.0.js';

(function() {
  $.fn.extend({
    progress: function(obj) {
      if (!$(this)) { return }
      this._curring = 0;
      this._during = 0;
      this._runCount = '';
      this._speed = 0;
      this._pause = true;

      $(this).addClass('__progress');
      $(this).append('<span class="cate"></span>');

      const $prog = $(this);
      const $progCate = $(this).find('.cate');
      $prog.width(obj.width || 100);
      $prog.height(obj.height || 4);
      $prog.css('background', obj.bgColor || 'white');
      $progCate.width(obj.defaultPos);
      $progCate.css('background', obj.forColor || 'red');
      const startPos = $prog.offset().left;
      const endPos = $prog.offset().left + $prog.width();
      $prog.on('click', (evt) => {
        const activeLeng = evt.pageX - startPos;
        $progCate.width(activeLeng);
        if (typeof obj.handleClick === 'function') {
          this._curring = activeLeng;
          obj.handleClick(activeLeng / $prog.width());
        }
      });


      if (obj.play) {
        this.play = (time) => {
          this._during = time;
          this._speed = $prog.width() / this._during;
          this._pause = false;
          const run = ()=>{
            if (!this._pause) {
              this._curring += this._speed;
              $progCate.width(this._curring);
              setTimeout(run, 1000);
            }
          }
          run();
        }
        this.pause = (curr) => {
          this._curring = (curr / this._during) * $prog.outerWidth();
          this._pause = true;
        }
        this.reset = (time) => {
          this._curring = 0;
          $progCate.width(0);
          if (time) {
            this.play(time);
          }
        }
      }
      return this.each(function(){
        return $prog;
      })
    },
  });
})();

(function(){
  $('.js-vols').progress({
    width: 90,
    bgColor: 'white',
    forColor: 'red',
    defaultPos: 90,
    handleClick: changeVol
  });
  const progress = $('.time-pro').progress({
    width: '80%',
    bgColor: 'white',
    forColor: 'black',
    defaultPos: 0,
    handleClick: changeCurrTime,
    play: true,
  });
  const musicList = [
    { name:'DJ - Melody from heaven.mp3', src: './music'},
    { name:'Dragon Rider.mp3', src: './music'},
    { name:'Enya - Amarantine.mp3', src: './music'},
    { name:'Era - The Mass.mp3', src: './music'},
  ]
  // 获取页面唯一的播放器
  const playerDom = document.getElementsByTagName('audio')[0];
  let defaultVol = 1;
  let timeInterval = '';
  initList($('.m-list ul'), musicList);

  // open or hide player
  $('.info .xm-more').on('click', () => {
    $('.player').toggleClass('hide');
  });

  // prev play pause next and stop player
  $('.js-ctr').on('click', '.xm-prev', (evt) => {
    switchMusic($('.m-list li.active').index(), -1);
  });
  $('.js-ctr').on('click', '.xm-pause', (evt) => {
    handlePlay(false);
    playerDom.pause();
    progress.pause(playerDom.currentTime);
    timeRuning(false);
  });
  $('.js-ctr').on('click', '.xm-play', (evt) => {
    handlePlay(true);
    playerDom.play();
    progress.play(playerDom.duration);
    timeRuning(true);
  });
  $('.js-ctr').on('click', '.xm-next', (evt) => {
    switchMusic($('.m-list li.active').index(), 1);
  });
  $('.js-ctr').on('click', '.xm-stop', (evt) => {
    playerDom.currentTime = 0;
    playerDom.pause();
    handlePlay(false);
    progress.reset();
  });

  // quite volume
  $('.js-vol').on('click', '.xm-voice', () => {
    handleQuite(true)
  })
  $('.js-vol').on('click', '.xm-quite', () => {
    handleQuite(false)
  })

  function changeVol(vol) {
    defaultVol = playerDom.volume = vol;
  }

  function changeCurrTime(pos) {
    playerDom.currentTime = playerDom.duration * pos;
    $('.time-curr').html(formatSeconds(playerDom.currentTime));
  }

  function timeRuning(toRun) {
    if (toRun) {
      timeInterval = setInterval(() => {
        $('.time-curr').html(formatSeconds(playerDom.currentTime))
      }, 500);
    } else {
      clearInterval(timeInterval);
    }
  }

  function handleQuite(quite) {
    if (quite) {
      playerDom.volume = 0;
      $('.js-vol .xmusic').addClass('xm-quite').removeClass('xm-voice');
    } else {
      playerDom.volume = defaultVol;
      $('.js-vol .xmusic').addClass('xm-voice').removeClass('xm-quite');
    }
  }

  function handlePlay(play) {
    if(play) {
      $('.js-play').addClass('xm-pause').removeClass('xm-play');
    } else {
      $('.js-play').addClass('xm-play').removeClass('xm-pause');
    }
  }

  function switchMusic(curr, next) {
    const listLength = $('.m-list ul li').length; //曲目条数
    if ((curr < listLength - 1 && next > 0) || (curr > 0 && next < 0) ) {
      const nextStep = curr + next;
      playerDom.setAttribute('src', `${musicList[nextStep].src}/${musicList[nextStep].name}`)
      $('.m-list li.active').removeClass('active').closest('ul').find('li').eq(nextStep).addClass('active');
      handlePlay(true);
      playerDom.play();
      progress.reset(playerDom.duration);
    }
  }

  function initPlayer(audio) {
    const l = decodeURIComponent(audio.src).split('/');
    const musicName = l[l.length - 1];
    const musicDuration = formatSeconds(audio.duration);
    $('.m-list li').eq(0).addClass('active');
    initTimeProgress(musicName, musicDuration);
    $('.m-operate').append(audio);
    playerDom.setAttribute('src',audio.getAttribute('src'));
    defaultVol = playerDom.volume;
    playerDom.addEventListener('ended', () => switchMusic($('.m-list li.active').index(), 1));
  }


  function initTimeProgress(name, duration) {
    $('.pro .time-dura').html(duration);
    $('.pro marquee').html(name);
  }

  function initList($list, mList) {
    mList.forEach((item, index) => {
      const audio = document.createElement('audio');
      audio.setAttribute('src', `${item.src}/${item.name}`);
      audio.addEventListener("canplay", function(){
        $('.m-list ul').append(`<li>${item.name}<span>${formatSeconds(audio.duration)}</span></li>`)
        if (index === 0) {
          initPlayer(audio);
        }
      });
    });
  }

  function formatSeconds(sec, type) {
    let hours = parseInt(sec / 3600);
    let min = parseInt((sec % 3600) / 60);
    let second = parseInt(sec % 60);
    hours = hours < 10 ? `0${hours}` : hours;
    min = min < 10 ? `0${min}` : min;
    second = second < 10 ? `0${second}` : second;
    if (!type) {
      return hours === '00' ? `${min}:${second}` : `${hours}:${min}:${second}`
    }
    return (type).replace('H', hours).replace('M', min).replace('S', second);
  }


})();