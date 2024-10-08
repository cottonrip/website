document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    const snapZones = document.querySelectorAll('.snap-zone');
    let snapHeight = window.innerHeight;
    let currentScrollTop = 0;

    const updateSnapHeight = () => {
        snapHeight = window.innerHeight;
        snapZones.forEach(zone => {
            zone.style.height = `${snapHeight}px`;
        });
        // Snap to the nearest zone after resizing
        let snapIndex = Math.round(currentScrollTop / snapHeight);
        snapToZone(snapIndex);
    };

    const snapToZone = (index) => {
        currentScrollTop = index * snapHeight;
        scrollContainer.scrollTo({
            top: currentScrollTop,
            behavior: 'smooth'
        });
    };

    window.addEventListener('resize', updateSnapHeight);

    scrollContainer.addEventListener('touchstart', (e) => {
        startY = e.touches[0].pageY;
    });

    scrollContainer.addEventListener('touchmove', (e) => {
        let touchY = e.touches[0].pageY;
        let touchMove = startY - touchY;

        scrollContainer.scrollTop = currentScrollTop + touchMove;
    });

    scrollContainer.addEventListener('touchend', () => {
        let scrollPosition = scrollContainer.scrollTop;
        let snapIndex = Math.round(scrollPosition / snapHeight);

        // Limit snapIndex to the number of snap zones
        snapIndex = Math.min(snapZones.length - 1, Math.max(0, snapIndex));

        snapToZone(snapIndex);
    });

    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        let scrollPosition = scrollContainer.scrollTop;
        let snapIndex = Math.round(scrollPosition / snapHeight);

        if (e.deltaY > 0) {
            snapIndex = Math.min(snapZones.length - 1, snapIndex + 1);
        } else {
            snapIndex = Math.max(0, snapIndex - 1);
        }

        snapToZone(snapIndex);
    });

    // Initial setup
    updateSnapHeight();
});

function changeText() {
    const originalText = "TikTok";
    const newText = "it's trash";
    const textElement = document.getElementById("myText");

    textElement.innerHTML = newText;

    setTimeout(function() {
        textElement.innerHTML = originalText;
    }, 1500);
}

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
    spotifyElement.innerText = "No song currently playing";
    return;
  }

  const { song, artist } = spotify;

  spotifyElement.innerText = `Currently playing: ${song} by ${artist}`;
}