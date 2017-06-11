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
        this._pause = false;
        this.play = (time) => {
          this._during = time;
          this._speed = $prog.width() / this._during;
          if (!this._pause) {
            this._runCount = setInterval(() => {
              this._curring += this._speed;
              $progCate.width(this._curring);
            }, 1000);
          }
        }
        this.pause = (curr) => {
          this._curring = (curr / this._during) * $prog.outerWidth();
          this._pause = true;
          clearInterval(this._runCount);
        }
        this.reset = (time) => {
          this._curring = 0;
          clearInterval(this._runCount);
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
  const playMode = ['normal', 'circle', 'random', 'single'];
  let currMode = 0;
  $('.js-vols').progress({
    width: 90,
    bgColor: 'white',
    forColor: '#03c3f5',
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
  const musicList = [];
  $('.m-list ul li').each((index, item) => {
    const src = $(item).data('src');
    const name = $(item).data('src').split('/').pop();
    musicList.push({ name, src });
  });
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

  // switch play order mode
  $('.js-circle').on('click', '.xmusic', (evt) => {
    const $self = $(evt.currentTarget);
    currMode = currMode >= playMode.length - 1 ? 0 : currMode + 1;
    switch(currMode) {
      case 0:
        $self.attr('class', 'xmusic xm-list-p');
        break;
      case 1:
        $self.attr('class', 'xmusic xm-list-circle');
        break;
      case 2:
        $self.attr('class', 'xmusic xm-list-suiji');
        break;
      case 3:
        $self.attr('class', 'xmusic xm-list-single');
        break;
      default:
        $self.attr('class', 'xmusic xm-list-p');
    }
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

  function orderPlay(curr) {

  }

  function switchMusic(curr, next) {
    const listLength = $('.m-list ul li').length; //曲目条数
    let nextStep = 0;
    let stop = false;
    next = next || '';
    switch(currMode) {
      case 0:
        if (next) {
          nextStep = curr <= 0
                     ? next > 0 ? curr + 1 : listLength - 1
                     : curr >= listLength -1
                       ? next > 0 ? 0 : curr -1
                       : next > 0 ? curr + 1: curr - 1;
        } else {
          if (curr >= listLength - 1) {
            stop = true;
          }
        }
        break;
      case 1:
        if (next) {
          nextStep = curr <= 0
                     ? next > 0 ? curr + 1 : listLength - 1
                     : curr >= listLength - 1
                       ? next > 0 ? 0 : curr -1
                       : next > 0 ? curr + 1: curr - 1;
        } else {
          nextStep = curr >= listLength - 1 ? 0 : curr + 1;
        }
        break;
      case 2:
        nextStep = Math.floor(Math.random() * listLength);
        break;
      case 3:
        if (next) {
          nextStep = curr <= 0
                     ? next > 0 ? curr + 1 : listLength - 1
                     : curr >= listLength - 1
                       ? next > 0 ? 0 : curr -1
                       : next > 0 ? curr + 1: curr - 1;
        } else {
          nextStep = curr;
        }
        break;
    }

    if (!stop) {
      playerDom.setAttribute('src', `${musicList[nextStep].src}`)
      $('.m-list li.active').removeClass('active').closest('ul').find('li').eq(nextStep).addClass('active');
      handlePlay(true);
      playerDom.play();
      initTimeProgress(musicList[nextStep].name, formatSeconds(musicList[nextStep].time))
      progress.reset(musicList[nextStep].time);
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
    playerDom.addEventListener('ended', () => {
      switchMusic($('.m-list li.active').index())
    });
    currMode = 0;
  }


  function initTimeProgress(name, duration) {
    $('.pro .time-dura').html(duration);
    $('.pro .time-curr').html('00:00');
    $('.pro marquee').html(name);
  }

  function initList($list, mList) {
    mList.forEach((item, index) => {
      const audio = document.createElement('audio');
      audio.setAttribute('src', `${item.src}`);
      audio.addEventListener("canplay", function(){
        item.time = audio.duration;
        $('.m-list ul li').eq(index).append(`${item.name}<span>${formatSeconds(audio.duration)}</span>`)
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