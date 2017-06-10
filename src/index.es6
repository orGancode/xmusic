import './style.css';
import $ from '../static/jquery-3.0.0.js';

(function(){
  const musicList = [
    { id: 1, name:'DJ - Melody from heaven.mp3', src: './music'},
    { id: 2, name:'Dragon Rider.mp3', src: './music'},
    { id: 3, name:'Enya - Amarantine.mp3', src: './music'},
    { id: 4, name:'Era - The Mass.mp3', src: './music'},
  ]
  initList($('.m-list ul'), musicList);

  $('.info .xm-more').on('click', () => {
    $('.player').toggleClass('hide');
  })

  function initPlayer(info, audio) {
    const l = decodeURIComponent(audio.src).split('/');
    const musicName = l[l.length - 1];
    const musicDuration = formatSeconds(audio.duration);
    $('.m-list li').each((i, item) => {
      if ($(item).data('id') === info.id) {
        $(item).addClass('active');
        $('.pro .time-dura').html(musicDuration);
        $('.pro marquee').html(musicName);
      }
    })
  }

  function initList($list, mList) {
    mList.forEach((item, index) => {
      const audio = document.createElement('audio');
      audio.setAttribute('src', `${item.src}/${item.name}`);
      audio.addEventListener("canplay", function(){
        $('.m-list ul').append(`<li data-id='${item.id}'>${item.name}<span>${formatSeconds(audio.duration)}</span></li>`)
        if (index === 0) {
          initPlayer(item, audio);
        }
      });
    });
  }

  function formatSeconds(sec, type) {
    const hours = parseInt(sec / 3600);
    const min = parseInt((sec % 3600) / 60);
    const second = parseInt(sec % 60);
    if (!type) {
      return hours === 0 ? `${min}:${second}` : `${hours}:${min}:${second}`
    }
    return (type).replace('H', hours).replace('M', min).replace('S', second);
  }


})();