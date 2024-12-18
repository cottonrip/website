import '/styles/anims.scss'

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

function changeTextDiscord() {
    const originalText = "Discord";
    const newText = "Discord: cotton.rip";
    const textElement = document.getElementById("myTextDiscord");

    textElement.innerHTML = newText;
}

document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

const LANYARD_WS = "wss://api.lanyard.rest/socket";
const LANYARD_OP = {
  PRESENCE: 0,
  HELLO: 1,
  INITIALIZE: 2,
  HEARTBEAT: 3,
};
const EVENTS_TO_CALLBACK = ["INIT_STATE", "PRESENCE_UPDATE"];
const DISCORD_ID = "180456337518493697";

let spotifyBarTimer = null;

function initializeLanyard(callback) {
  let ws = new WebSocket(LANYARD_WS);

  ws.onmessage = ({ data }) => {
    const received = JSON.parse(data);

    switch (received.op) {
      case LANYARD_OP.HELLO: {
        ws.send(
          JSON.stringify({
            op: LANYARD_OP.INITIALIZE,
            d: { subscribe_to_id: DISCORD_ID },
          })
        );

        setInterval(() => {
          ws.send(JSON.stringify({ op: LANYARD_OP.HEARTBEAT }));
        }, 1000 * 30);
        break;
      }

      case LANYARD_OP.PRESENCE: {
        if (EVENTS_TO_CALLBACK.includes(received.t)) {
          callback(received.d);
        }
        break;
      }
    }
  };

  ws.onclose = () => initializeLanyard(callback);
}

initializeLanyard((data) => {
  setupBasicInfo(data);
  setupSpotify(data);
});

function setupBasicInfo({ discord_user, discord_status, activities }) {
  const { username, discriminator, avatar } = discord_user;
  const colorCodes = {
    online: "#30d158",
    offline: "#8e8e93",
    idle: "#ffd60a",
    dnd: "#ff453a",
  };

  let status = discord_status;

  for (const activity of activities) {
    if (activity.type === 4) {
      status = activity.state;
      break;
    }
  }

  const descriptionElement = document.getElementById("description");
  descriptionElement.innerText = `@${username} [${status}]`;
  descriptionElement.style.color = colorCodes[discord_status];
}

function setupSpotify({ listening_to_spotify, spotify }) {
  if (spotifyBarTimer) clearInterval(spotifyBarTimer);

  const spotifyElement = document.getElementById("spotify-song");

  if (!listening_to_spotify) {
    spotifyElement.innerText = "listening to: nothing :(";
    return;
  }

  const { song, artist } = spotify;

  spotifyElement.innerText = `listening to: ${song} by ${artist}`;
}

function setOverflow() {
  if (window.innerWidth >= 750) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

window.addEventListener('resize', setOverflow);
setOverflow();


// click to enter

document.getElementById('overlay').addEventListener('click', function () {
  console.log("Overlay clicked!");
  this.classList.add('fade-out');
  const audio = document.getElementById('introAudio');
  audio.play();
  
  setTimeout(() => {
    this.style.display = 'none';
  }, 500);
});

document.getElementById("overlay").addEventListener("click", async function() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  document.getElementById("overlay").style.display = "none";
});