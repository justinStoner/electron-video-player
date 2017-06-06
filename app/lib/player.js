const fs=require('fs');
var ticking, last_known_scroll_position;
window.addEventListener(
    'DOMContentLoaded',
    init
);
function init(){
    document.querySelector('#prog').value = 0;
    document.querySelector('#volRange').value=document.querySelector('#videoContainer').volume;
    bindEvents();
}

function bindEvents(){
    var video = document.querySelector('#videoContainer');
    var progBar = document.querySelector('#prog');
    var dropArea = document.querySelector('#dropArea');
    var volContainer=document.getElementById('vol-container');
    var playlistToggle=document.getElementById('playlist-toggle');
    var playlist=document.getElementById('playlist');
    var playlistContainer=document.getElementById('playlist-container');
    playlistToggle.addEventListener(
      'mouseenter',
      showPlaylist
    )
    playlistContainer.addEventListener(
      'mouseleave',
      hidePlaylist
    )
    volContainer.addEventListener(
      'mouseenter',
      function(e){document.querySelector('#volRange').classList.toggle('hidden');}
    )
    volContainer.addEventListener(
      'mouseleave',
      function(e){document.querySelector('#volRange').classList.toggle('hidden');}
    )
    progBar.addEventListener(
      'mouseenter',
      progbarEnter
    )
    progBar.addEventListener(
      'mouseleave',
      progbarLeave
    )
    progBar.addEventListener(
      'mousemove',
      progbarMove
    )
    video.addEventListener(
        'timeupdate',
        showProgress
    );

    video.addEventListener(
        'play',
        playing
    );

    video.addEventListener(
        'ended',
        ended
    );

    video.addEventListener(
        'pause',
        paused
    );

    video.addEventListener(
        'error',
        function(e){
            videoError('Video Error');
        }
    );

    video.addEventListener(
        'stalled',
        function(e){
            videoError('Video Stalled');
        }
    );

    video.addEventListener(
      'mouseenter',
      function(){}
    )
    // video.addEventListener('scroll', function(e) {
    //   last_known_scroll_position = video.scrollY;
    //   if (!ticking) {
    //     window.requestAnimationFrame(function() {
    //       doSomething(last_known_scroll_position);
    //       ticking = false;
    //     });
    //   }
    //   ticking = true;
    // });
    dropArea.addEventListener(
        'dragleave',
        makeUnDroppable
    );

    dropArea.addEventListener(
        'dragenter',
        makeDroppable
    );

    dropArea.addEventListener(
        'dragover',
        makeDroppable
    );

    dropArea.addEventListener(
        'drop',
        loadVideo
    );

    document.querySelector('#playerContainer').addEventListener(
        'click',
        playerClicked
    );

    document.querySelector('#chooseVideo').addEventListener(
        'change',
        loadVideo
    );

    document.querySelector('#volRange').addEventListener(
        'change',
        adjustVolume
    );

    document.querySelector('#enterLink').addEventListener(
        'change',
        loadVideo
    );

    window.addEventListener(
        'keyup',
        function(e){
            switch(e.keyCode){
                case 13 : //enter
                case 32 : //space
                    togglePlay();
                    break;
            }
        }
    );
}

function progbarMove(e){
  console.log(e);
  var video = document.getElementById('hiddenvideo');
  video.currentTime = ((e.offsetX)/e.target.offsetWidth)*video.duration;
  var container=document.getElementById('frame-holder');
  container.style.display="block";
  console.log(window.innerWidth);
  console.log(e.pageX+100);
  if(e.pageX+100<window.innerWidth){
    container.style.left=e.pageX+'px';
  }
  console.log(video.currentTime);
}
function progbarEnter(e){
  console.log(e);
  var container=document.getElementById('frame-holder');
  container.style.display="block";
  console.log(window.innerWidth);
  console.log(e.pageX+100);
  if(e.pageX+100<window.innerWidth){
    container.style.left=e.pageX+'px';
  }
  var video = document.getElementById('hiddenvideo');
  video.currentTime = ((e.offsetX)/e.target.offsetWidth)*video.duration;
  if(video.paused){
    video.play();
  }
  console.log(video.currentTime);
  //if(video.src){

  //}
}
function progbarLeave(e){
  console.log(e);
  var video = document.getElementById('hiddenvideo');
  video.pause();
  //if(video.src){
    document.getElementById('frame-holder').style.display="none";
  //}
}

function skip(dir){
  var video = document.querySelector('#videoContainer');
  if(dir==='back'){
    video.currentTime-=elec.get('skipBack');
  }else{
    video.currentTime+=elec.get('skipForward');
  }
}
function getTime(ms){

    var date = new Date(ms);
    var time = [];
    var minutes, seconds;
    minutes=date.getUTCMinutes();
    seconds=date.getUTCSeconds();
    if(minutes<10){
      minutes='0'+minutes;
    }
    if(seconds<10){
      seconds='0'+seconds;
    }
    time.push(date.getUTCHours());
    time.push(minutes);
    time.push(seconds);

    return time.join(':');
}

function adjustVolume(e){
    var video = document.querySelector('#videoContainer');
    video.volume=e.target.value;
}

function showProgress(){
    var video = document.querySelector('#videoContainer');
    var progBar = document.querySelector('#prog');
    var count = document.querySelector('#count');
    var duration = document.querySelector('#duration');
    console.log((video.currentTime/video.duration));
    progBar.value=(video.currentTime/video.duration);
    count.innerHTML = getTime(video.currentTime*1000);
    duration.innerHTML=getTime(video.duration*1000);
}

function togglePlay(){
    document.querySelector('.play:not(.hide),.pause:not(.hide)').click();
}

function toggleScreen(){
    document.querySelector('.fullscreen:not(.hide),.smallscreen:not(.hide)').click();
}

function playing(e){
    var player = document.querySelector('#playerContainer');

    document.querySelector('#play').classList.add('hide');
    document.querySelector('#pause').classList.remove('hide');
    player.classList.remove('paused');

    hideFileArea();
}

function fullscreened(e){
    var player = document.querySelector('#playerContainer');
    player.classList.add('fullscreened');
    player.webkitRequestFullscreen();

}


function smallscreened(e){
    var player = document.querySelector('#playerContainer');
    player.classList.remove('fullscreened');
    document.webkitExitFullscreen();
}


function hideFileArea(){
    var dropArea=document.querySelector('#dropArea');
    dropArea.classList.add('hidden');

    setTimeout(
        function(){
            var dropArea=document.querySelector('#dropArea');
            dropArea.classList.add('hide');
        },
        500
    );
}

function showFileArea(){
    var dropArea=document.querySelector('#dropArea');
    dropArea.classList.remove('hide');

    setTimeout(
        function(){
            var dropArea=document.querySelector('#dropArea');
            dropArea.classList.remove('hidden');
        },
        10
    );
}

function paused(e, show){
    var player = document.querySelector('#playerContainer');

    document.querySelector('#pause').classList.add('hide');
    document.querySelector('#play').classList.remove('hide');
    player.classList.add('paused');

    if(show){
      showFileArea();
    }
}

function ended(e){
    var player = document.querySelector('#playerContainer');

    document.querySelector('#play').classList.remove('hide');
    document.querySelector('#pause').classList.add('hide');
    player.classList.add('paused');

    showFileArea();
}

function makeDroppable(e) {
    e.preventDefault();
    e.target.classList.add('droppableArea');
};

function makeUnDroppable(e) {
    e.preventDefault();
    e.target.classList.remove('droppableArea');
};

function loadVideo(e) {
    e.preventDefault();
    var files = [];
    var index, folder, filename;
    if(e.dataTransfer){
        files=e.dataTransfer.files;
    }else if(e.target.files){
        files=e.target.files;
    }else{

        files=[
            {
                type:'video',
                path:e.target.value
            }
        ];
    }

    //@ToDo handle playlist
    for (var i=0; i<files.length; i++) {
        console.log(files[i]);
        if(files[i].type.indexOf('video')>-1){
            var video = document.getElementById('videoContainer');
            var hidden = document.getElementById('hiddenvideo');
            video.src=files[i].path;
            window.filePath=files[i].path;

            hidden.src=files[i].path;
            setTimeout(
                function(){
                    document.querySelector('.dropArea').classList.remove('droppableArea');
                    document.querySelector('.play:not(.hide),.pause:not(.hide)').click();
                },
                250
            );
        }
    };
    console.log(window.filePath);
    if(process.platform.indexOf('win')>-1){
      index=window.filePath.lastIndexOf('\\');
    }else{
      index=window.filePath.lastIndexOf('/');
    }
    folder = window.filePath.substring(0, index);
    filename=window.filePath.substring(index+1, window.filePath.length)
    console.log(folder);
    console.log(filename);
    window.folder=folder;
    window.filesInFolder=[];
    var i=0;
    fs.readdir(folder, (err, files) => {
      files.forEach(file => {
        if((/\.(mpeg|MPEG|mpg|MPG|mp4|MP4|mov|MOV)$/i).test(file)){
          window.filesInFolder.push(file);
          if(file===filename){
            window.fileIndex=i;
          }
          i++;
        }
      });
      console.log(window.filesInFolder);
    })

};
function showPlaylist(e){
  if(window.filesInFolder){
    var playlist=document.getElementById('playlist');
    var li, text;
    playlist.style.display="block";
    for(var i=0;i<window.filesInFolder.length; i++){
      li=document.createElement('li');
      li.setAttribute('onclick', 'changeVideo('+i+')');
      text=document.createTextNode(window.filesInFolder[i]);
      li.appendChild(text);
      playlist.children[0].children[0].appendChild(li);
    }
  }
}
function hidePlaylist(e){
  document.getElementById('playlist').style.display="none";
}
function nextVideo(){
  var slash;
  if(window.fileIndex===0){
    return;
  }
  paused(undefined, false);
  if(process.platform.indexOf('win')>-1){
    slash='\\'
  }else{
    slash='/'
  }
  window.fileIndex=window.fileIndex-1;
  var video = document.getElementById('videoContainer');
  video.pause();
  video.currentTime=0;
  var hidden = document.getElementById('hiddenvideo');
  video.src=window.folder+slash+window.filesInFolder[window.fileIndex];
  console.log(video.src);
  hidden.src=window.folder+slash+window.filesInFolder[window.fileIndex];
  setTimeout(
      function(){
          document.querySelector('.dropArea').classList.remove('droppableArea');
          document.querySelector('.play:not(.hide),.pause:not(.hide)').click();
      },
      250
  );
}
function changeVideo(index){
  var slash;
  console.log(index);
  paused(undefined, false);
  if(process.platform.indexOf('win')>-1){
    slash='\\'
  }else{
    slash='/'
  }
  window.fileIndex=index;
  var video = document.getElementById('videoContainer');
  video.pause();
  video.currentTime=0;
  var hidden = document.getElementById('hiddenvideo');
  video.src=window.folder+slash+window.filesInFolder[index];
  console.log(video.src);
  hidden.src=window.folder+slash+window.filesInFolder[index];
  setTimeout(
      function(){
          document.querySelector('.dropArea').classList.remove('droppableArea');
          document.querySelector('.play:not(.hide),.pause:not(.hide)').click();
      },
      250
  );
}
function lastVideo(){
  var slash;
  if(window.fileIndex===window.filesInFolder.length-1){
    return;
  }
  paused(undefined, false);
  if(process.platform.indexOf('win')>-1){
    slash='\\'
  }else{
    slash='/'
  }
  window.fileIndex=window.fileIndex+1;
  var video = document.getElementById('videoContainer');
  var hidden = document.getElementById('hiddenvideo');
  video.src=window.folder+slash+window.filesInFolder[window.fileIndex];
  hidden.src=window.folder+slash+window.filesInFolder[window.fileIndex];
  setTimeout(
      function(){
          document.querySelector('.dropArea').classList.remove('droppableArea');
          document.querySelector('.play:not(.hide),.pause:not(.hide)').click();
      },
      250
  );
}
function videoError(message){
    var err=document.querySelector('#error');
    err.querySelector('h1').innerHTML=message;
    err.classList.remove('hide')

    setTimeout(
        function(){
            document.querySelector('#error').classList.remove('hidden');
        },
        10
    );
}

function closeError(){
    document.querySelector('#error').classList.add('hidden');
    setTimeout(
        function(){
            document.querySelector('#error').classList.add('hide');
        },
        300
    );
}

function playerClicked(e){
    if(!e.target.id || e.target.id=='controlContainer' || e.target.id=='dropArea'){
        return;
    }

    var video = document.querySelector('#videoContainer');
    var player = document.querySelector('#playerContainer');

    switch(e.target.id){
        case 'video' :
            togglePlay();
            break;
        case 'play' :
            if(!video.videoWidth){
                videoError('Error Playing Video');
                return;
            }
            video.play();
            break;
        case 'pause' :
            video.pause();
            break;
        case 'volume' :
            document.getElementById('mute').style.display="initial";
            document.getElementById('volume').style.display="none";
            break;
        case 'mute' :
            video.muted=(video.muted)? false:true;
            document.getElementById('mute').style.display="none";
            document.getElementById('volume').style.display="initial";
            player.classList.toggle('muted');
            break;
        case 'volRange' :
            //do nothing for now
            break;
        case 'fullscreen' :
            fullscreened();
            break;
        case 'smallscreen' :
            smallscreened();
            break;
        case 'prog' :
            video.currentTime = ((e.offsetX)/e.target.offsetWidth)*video.duration;
            break;
        case 'close' :
            window.close();
            break;
        case 'fileChooser' :
            document.querySelector('#chooseVideo').click();
            break;
        case 'enterLink' :
            //do nothing for now
            break;
        case 'error' :
        case 'errorMessage' :
            closeError();
            break;
        default :
            console.log('stop half assing shit.');
    }
}
