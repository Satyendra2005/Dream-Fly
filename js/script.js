const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => document.querySelectorAll(selector);

/* =========================
   TOAST
========================= */

const toast = (message) => {
  const element = document.createElement("div");

  element.className = "toast";
  element.textContent = message;

  document.body.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, 2600);
};

/* =========================
   FLIGHT DATA
   DEMO ONLY
========================= */

const flightData = [
  {
    airline: "IndiGo",
    logo: "🔵",
    from: "Delhi",
    to: "Dubai",
    dep: "06:15",
    arr: "08:45",
    duration: "4h 00m",
    stops: 0,
    price: 315,
  },
  {
    airline: "Air India",
    logo: "🔴",
    from: "Delhi",
    to: "Dubai",
    dep: "09:20",
    arr: "12:00",
    duration: "4h 10m",
    stops: 0,
    price: 342,
  },
  {
    airline: "Emirates",
    logo: "✈",
    from: "Delhi",
    to: "Dubai",
    dep: "16:10",
    arr: "19:00",
    duration: "4h 20m",
    stops: 0,
    price: 389,
  },
  {
    airline: "Singapore Airlines",
    logo: "🟠",
    from: "Delhi",
    to: "Singapore",
    dep: "20:10",
    arr: "04:55",
    duration: "5h 35m",
    stops: 0,
    price: 410,
  },
  {
    airline: "Air India",
    logo: "🔴",
    from: "Mumbai",
    to: "London",
    dep: "02:15",
    arr: "07:10",
    duration: "9h 25m",
    stops: 0,
    price: 590,
  },
  {
    airline: "IndiGo",
    logo: "🔵",
    from: "Delhi",
    to: "London",
    dep: "22:30",
    arr: "11:15",
    duration: "11h 15m",
    stops: 1,
    price: 505,
  },
];

/* =========================
   SUPPORT ANSWERS
========================= */

const supportAnswers = {
  booking: [
    "Booking problem",
    "Check that the passenger details, route, dates and selected fare are correct. If the issue remains, contact support with your booking reference.",
  ],

  payment: [
    "Payment problem",
    "If payment was deducted but confirmation is not visible, check your email and allow a short time for processing. If there is still no confirmation, contact support with the transaction details.",
  ],

  cancel: [
    "Change or cancel booking",
    "Cancellation and change rules depend on the selected fare and provider. Review your booking conditions and contact the applicable service team if you need assistance.",
  ],

  confirmation: [
    "Confirmation not received",
    "Check your inbox and spam folder. Make sure the email address entered during booking was correct. If you still cannot find the confirmation, contact support.",
  ],

  refund: [
    "Refund problem",
    "Refund timing and eligibility depend on the fare and provider. Keep your booking reference and payment details ready when contacting support.",
  ],

  account: [
    "Account/login problem",
    "Check your email and password and try again. If you still cannot access your account, use the support contact option.",
  ],

  other: [
    "Other issue",
    "We can route your request to a support agent. Please provide your booking reference and a short description of the issue.",
  ],
};

/* =========================
   INITIALIZE
========================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     MOBILE NAVIGATION
  ========================= */

  const menu = qs("#menuToggle");
  const nav = qs("#mainNav");

  menu?.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  /* =========================
     TRIP TYPE
  ========================= */

  qsa(".trip-tab").forEach((button) => {
    button.addEventListener("click", () => {
      qsa(".trip-tab").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      const returnWrap = qs("#returnWrap");

      if (returnWrap) {
        returnWrap.style.display =
          button.dataset.trip === "one" ? "none" : "block";
      }
    });
  });

  /* =========================
     SWAP AIRPORTS
  ========================= */

  qs("#swapAirports")?.addEventListener("click", () => {
    const from = qs("#from");
    const to = qs("#to");

    if (!from || !to) return;

    [from.value, to.value] = [to.value, from.value];
  });

  /* =========================
     FLIGHT SEARCH
  ========================= */

  qs("#flightSearchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const from = qs("#from")?.value.trim();
    const to = qs("#to")?.value.trim();

    if (!from || !to) {
      toast("Please enter departure and destination.");
      return;
    }

    const url =
      `flights.html?from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}`;

    window.location.href = url;
  });

  /* =========================
     FLIGHT RESULTS
  ========================= */

  const results = qs("#flightResults");

  if (results) {
    const params = new URLSearchParams(window.location.search);

    const from = params.get("from");
    const to = params.get("to");

    const routeSummary = qs("#routeSummary");

    if (routeSummary) {
      routeSummary.textContent =
        `${from || "Delhi"} → ${to || "Dubai"} · ` +
        "Compare available flight options";
    }

    let data = flightData.filter((flight) => {
      const matchesFrom =
        !from || flight.from.toLowerCase().includes(from.toLowerCase());

      const matchesTo =
        !to || flight.to.toLowerCase().includes(to.toLowerCase());

      return matchesFrom && matchesTo;
    });

    if (!data.length) {
      data = flightData;
    }

    window._flightData = data;

    const renderFlights = (flights) => {
      results.innerHTML = flights
        .map(
          (flight, index) => `
            <article class="card flight-card">

              <div class="flight-main">

                <div>
                  <div class="airline-name">
                    ${flight.logo} ${flight.airline}
                  </div>

                  <small>
                    ${flight.from} → ${flight.to}
                  </small>
                </div>

                <div>
                  <span class="time">${flight.dep}</span>
                  ─
                  <span class="time">${flight.arr}</span>

                  <div class="duration">
                    ${flight.duration}
                  </div>
                </div>

                <div>
                  <span class="stops">
                    ${flight.stops === 0 ? "Nonstop" : flight.stops + " stop"}
                  </span>
                </div>

              </div>

              <div class="flight-price">

                <strong>
                  $${flight.price}
                </strong>

                <span class="stops">
                  per passenger
                </span>

                <br>

                <a
                  class="btn btn-primary"
                  href="flight-details.html?id=${index}"
                >
                  View
                </a>

              </div>

            </article>
          `,
        )
        .join("");

      const resultCount = qs("#resultCount");

      if (resultCount) {
        resultCount.textContent = `${flights.length} flights`;
      }
    };

    renderFlights(data);

    /* SORT */

    qs("#sortFlights")?.addEventListener("change", (event) => {
      const sorted = [...window._flightData];

      if (event.target.value === "price") {
        sorted.sort((a, b) => a.price - b.price);
      }

      if (event.target.value === "duration") {
        sorted.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
      }

      if (event.target.value === "departure") {
        sorted.sort((a, b) => a.dep.localeCompare(b.dep));
      }

      renderFlights(sorted);
    });

    /* NONSTOP */

    qs("#filterNonstop")?.addEventListener("change", (event) => {
      const filtered = event.target.checked
        ? data.filter((flight) => flight.stops === 0)
        : data;

      renderFlights(filtered);
    });

    /* CLEAR FILTER */

    qs("#clearFilters")?.addEventListener("click", () => {
      const checkbox = qs("#filterNonstop");

      if (checkbox) {
        checkbox.checked = false;
      }

      renderFlights(data);
    });
  }

  /* =========================
     FLIGHT DETAILS
  ========================= */

  const detail = qs("#flightDetailCard");

  if (detail) {
    const id = Number(
      new URLSearchParams(window.location.search).get("id") || 0,
    );

    const flight = flightData[id] || flightData[0];

    detail.innerHTML = `
      <div>

        <span class="eyebrow">
          ${flight.airline}
        </span>

        <h2>
          ${flight.logo} ${flight.airline}
        </h2>

      </div>

      <div class="detail-route">

        <div>
          <small>${flight.from}</small>

          <div class="time">
            ${flight.dep}
          </div>
        </div>

        <div>

          <strong>
            ${flight.duration}
          </strong>

          <div class="stops">
            ${flight.stops ? "1 stop" : "Nonstop"}
          </div>

        </div>

        <div>

          <small>${flight.to}</small>

          <div class="time">
            ${flight.arr}
          </div>

        </div>

      </div>

      <div>

        <strong>Fare</strong>

        <h2>
          $${flight.price}
        </h2>

        <p>
          Demo fare shown for the static prototype.
        </p>

      </div>
    `;

    localStorage.setItem("selectedFlight", JSON.stringify(flight));
  }

  /* =========================
     BOOKING SUMMARY
  ========================= */

  const bookingSummary = qs("#bookingSummary");

  if (bookingSummary) {
    const flight =
      JSON.parse(localStorage.getItem("selectedFlight") || "null") ||
      flightData[0];

    bookingSummary.innerHTML = `
      <p>
        <strong>
          ${flight.airline}
        </strong>
      </p>

      <p>
        ${flight.from} → ${flight.to}
      </p>

      <p>
        ${flight.dep} → ${flight.arr}
      </p>

      <hr>

      <h3>
        $${flight.price}
      </h3>

      <small>
        Demo prototype fare
      </small>
    `;
  }

  /* =========================
     BOOKING FORM
  ========================= */

  qs("#bookingForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const reference =
      "DF" + Math.random().toString(36).slice(2, 8).toUpperCase();

    localStorage.setItem("bookingRef", reference);

    window.location.href = "confirmation.html";
  });

  /* =========================
     CONFIRMATION
  ========================= */

  const bookingRef = qs("#bookingRef");

  if (bookingRef) {
    const flight =
      JSON.parse(localStorage.getItem("selectedFlight") || "null") ||
      flightData[0];

    bookingRef.textContent = localStorage.getItem("bookingRef") || "DF-DEMO01";

    const confirmationDetails = qs("#confirmationDetails");

    if (confirmationDetails) {
      confirmationDetails.innerHTML = `
        <p>
          <strong>
            ${flight.airline}
          </strong>
          ·
          ${flight.from} → ${flight.to}
        </p>

        <p>
          ${flight.dep} → ${flight.arr}
          ·
          $${flight.price}
        </p>
      `;
    }
  }

  /* =========================
     AIRLINES
  ========================= */

  const airlineInfo = {
    IndiGo: ["6E", "India"],
    "Air India": ["AI", "India"],
    Emirates: ["EK", "UAE"],
    "Singapore Airlines": ["SQ", "Singapore"],
  };

  const airlineName = qs("#airlineName");

  if (airlineName) {
    const name =
      new URLSearchParams(window.location.search).get("airline") || "IndiGo";

    const info = airlineInfo[name] || ["", ""];

    airlineName.textContent = name;

    const meta = qs("#airlineMeta");

    if (meta) {
      meta.textContent = `IATA: ${info[0]} · ${info[1]}`;
    }

    const description = qs("#airlineDescription");

    if (description) {
      description.textContent =
        `Explore flight options operated by ${name}. ` +
        `Availability, schedules and fares can change ` +
        `and should be confirmed through the applicable provider.`;
    }
  }

  /* =========================
     SUPPORT CENTER
  ========================= */

  const showSupport = (key, target) => {
    if (!target) return;

    const answer = supportAnswers[key] || supportAnswers.other;

    target.innerHTML = `
      <span class="eyebrow">
        Quick solution
      </span>

      <h2>
        ${answer[0]}
      </h2>

      <p>
        ${answer[1]}
      </p>

      <hr>

      <p>
        <strong>
          Was this helpful?
        </strong>
      </p>

      <button
        class="btn btn-secondary helpful"
      >
        Yes, solved
      </button>

      <button
        class="btn btn-primary not-helpful"
      >
        No, contact support
      </button>
    `;

    target.querySelector(".helpful")?.addEventListener("click", () => {
      target.innerHTML = `
          <h2>
            Glad we could help! ✓
          </h2>

          <p>
            You can return to your search
            whenever you are ready.
          </p>
        `;
    });

    target.querySelector(".not-helpful")?.addEventListener("click", () => {
      target.innerHTML = `
          <h2>
            Let's get this resolved.
          </h2>

          <p>
            Please contact the Dream Fly
            service team with your booking
            reference and issue details.
          </p>

          <a
            class="btn btn-primary"
            href="contact.html"
          >
            Contact service team
          </a>
        `;
    });
  };

  qsa("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      showSupport(button.dataset.topic, qs("#supportAnswer"));
    });
  });

  /* =========================
     CHAT WIDGET
  ========================= */

  const chatToggle = qs("#chatToggle");

  const chatPanel = qs("#chatPanel");

  chatToggle?.addEventListener("click", () => {
    chatPanel.classList.toggle("open");
  });

  qs("#chatClose")?.addEventListener("click", () => {
    chatPanel.classList.remove("open");
  });

  qsa("[data-chat-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      const body = qs("#chatBody");

      const answer =
        supportAnswers[button.dataset.chatTopic] || supportAnswers.other;

      body.innerHTML = `
            <div class="chat-message bot">

              <strong>
                ${answer[0]}
              </strong>

              <br>

              ${answer[1]}

            </div>

            <div class="chat-message bot">
              Was this helpful?
            </div>

            <div class="chat-options">

              <button id="chatYes">
                👍 Yes
              </button>

              <button id="chatNo">
                👎 No
              </button>

            </div>
          `;

      qs("#chatYes")?.addEventListener("click", () => {
        body.innerHTML = `
                <div class="chat-message bot">
                  Great! Happy to help. ✈️
                </div>
              `;
      });

      qs("#chatNo")?.addEventListener("click", () => {
        body.innerHTML = `
                <div class="chat-message bot">
                  No problem. A service agent
                  can help with your issue.
                </div>

                <a
                  class="btn btn-primary full"
                  href="contact.html"
                >
                  Contact service team
                </a>
              `;
      });
    });
  });

  /* =========================
     CONTACT FORM
  ========================= */

  qs("#contactForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    toast("Support request submitted (demo).");

    event.target.reset();
  });

  /* =========================
     PRICE FILTER
  ========================= */

  qs("#priceFilter")?.addEventListener("input", (event) => {
    const priceValue = qs("#priceValue");

    if (priceValue) {
      priceValue.textContent =
        "$" + Number(event.target.value).toLocaleString();
    }
  });

  /* =========================
     PASSENGER SELECTOR
  ========================= */

  const passengerTrigger = qs("#passengerTrigger");
  const passengerPopup = qs("#passengerPopup");
  const passengerDone = qs("#passengerDone");

  const adultCount = qs("#adultCount");
  const childCount = qs("#childCount");
  const infantCount = qs("#infantCount");

  const passengerSummary = qs("#passengerSummary");
  const passengerTotal = qs("#passengerTotal");

  /* Passenger numbers */

  let passengers = {
    adult: 1,
    child: 0,
    infant: 0,
  };

  /* Calculate total */

  const getTotalPassengers = () => {
    return passengers.adult + passengers.child + passengers.infant;
  };

  /* Update passenger display */

  const updatePassengerDisplay = () => {
    const total = getTotalPassengers();

    if (adultCount) {
      adultCount.textContent = passengers.adult;
    }

    if (childCount) {
      childCount.textContent = passengers.child;
    }

    if (infantCount) {
      infantCount.textContent = passengers.infant;
    }

    const travelerText = total === 1 ? "1 Traveler" : `${total} Travelers`;

    if (passengerSummary) {
      passengerSummary.textContent = travelerText;
    }

    if (passengerTotal) {
      passengerTotal.textContent = travelerText;
    }
  };

  /* Open passenger popup */

  const openPassengerPopup = () => {
    if (!passengerPopup || !passengerTrigger) {
      return;
    }

    passengerPopup.classList.add("open");

    passengerTrigger.setAttribute("aria-expanded", "true");
  };

  /* Close passenger popup */

  const closePassengerPopup = () => {
    if (!passengerPopup || !passengerTrigger) {
      return;
    }

    passengerPopup.classList.remove("open");

    passengerTrigger.setAttribute("aria-expanded", "false");
  };

  /* Passenger field click */

  passengerTrigger?.addEventListener("click", (event) => {
    event.stopPropagation();

    if (passengerPopup?.classList.contains("open")) {
      closePassengerPopup();
    } else {
      openPassengerPopup();
    }
  });

  /* =========================
     PLUS BUTTONS
  ========================= */

  qsa(".passenger-plus").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const type = button.dataset.type;

      if (!type || passengers[type] === undefined) {
        return;
      }

      const total = getTotalPassengers();

      /* Maximum 9 travelers */

      if (total >= 9) {
        toast("Maximum 9 travelers allowed.");
        return;
      }

      passengers[type]++;

      updatePassengerDisplay();
    });
  });

  /* =========================
     MINUS BUTTONS
  ========================= */

  qsa(".passenger-minus").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const type = button.dataset.type;

      if (!type || passengers[type] === undefined) {
        return;
      }

      /* Adult minimum = 1 */

      if (type === "adult" && passengers.adult <= 1) {
        return;
      }

      /* Child / Infant minimum = 0 */

      if (passengers[type] <= 0) {
        return;
      }

      passengers[type]--;

      updatePassengerDisplay();
    });
  });

  /* =========================
     DONE BUTTON
  ========================= */

  passengerDone?.addEventListener("click", (event) => {
    event.stopPropagation();

    closePassengerPopup();
  });

  /* =========================
     CLOSE WHEN CLICKING OUTSIDE
  ========================= */

  document.addEventListener("click", (event) => {
    if (
      passengerPopup &&
      passengerTrigger &&
      !passengerPopup.contains(event.target) &&
      !passengerTrigger.contains(event.target)
    ) {
      closePassengerPopup();
    }
  });

  /* =========================
     INITIAL DISPLAY
  ========================= */

  updatePassengerDisplay();
});
