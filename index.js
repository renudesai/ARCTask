var today = new Date();
var month = today.getMonth() + 1;
document.getElementById("month").value = month;

// Function to authenticate and get the JWT token
async function authenticate() {
  const authUrl = "https://api.arenaracingcompany.co.uk/auth";
  const authToken = "264c77f740cc1f02cac8f0a7e30ccdcd2f20dcf5";

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Authentication failed.");
  }

  const jwtToken = await response.text();
  return jwtToken;
}

async function getEvents(jwtToken, monthNumber) {
  const eventsUrl = `https://api.arenaracingcompany.co.uk/event/month/1318/${monthNumber}`;

  const response = await fetch(eventsUrl, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events.");
  }

  const eventsData = await response.json();
  return eventsData;
}

(async () => {
  try {
    const jwtToken = await authenticate();
    const currentMonth = new Date().getMonth() + 1; // Adding 1 because January is 0
    const events = await getEvents(jwtToken, currentMonth);
    displayEvents(events);
  } catch (error) {
    console.error("Error:", error);
  }
})();

async function handleChange() {
  try {
    const month = document.getElementById("month").value;
    console.log(month);
    const jwtToken = await authenticate();

    const events = await getEvents(jwtToken, month);
    displayEvents(events);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayEvents(data) {
  var card = document.getElementById("cards-container");
  card.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = data[i].description;

    const extractedText = tempContainer.textContent;

    // const parser = new DOMParser();
    // const parsedDescription = parser.parseFromString(
    //   extractedText,
    //   "text/html"
    // );

    var row = `
      <article>
          <picture>
            <source
              media="(max-width: 600px)"
              srcset=${data[i].images.mobile}
            />
            <source
              media="(max-width: 800px)"
              srcset=${data[i].images.tablet_land}
            />
            <img
              src=${data[i].images.desktop}
              alt="Event card display"
            />
          </picture>

          <div class="text">
            <h3>${data[i].title}</h3>
            <p>
              ${extractedText}
            </p>

          </div>
        </article>

   `;

    card.innerHTML += row;
  }
}
