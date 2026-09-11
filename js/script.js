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

  const tripTabs = qsa(".trip-tab");
  const returnWrap = qs("#returnWrap");
  const multiCityFields = qs("#multiCityFields");
  const multiCityRows = qs("#multiCityRows");
  const addFlightBtn = qs("#addFlightBtn");

  /*
    Multi-city flight data.

    Each item represents one flight leg:
    Flight 1: From → To + Date
    Flight 2: From → To + Date
    etc.
  */

  let multiCityFlights = [];

  const MAX_MULTI_CITY_FLIGHTS = 6;

  /* =========================
     CREATE MULTI-CITY ROW
  ========================= */

  const createMultiCityRow = (index) => {
    const row = document.createElement("div");

    row.className = "multi-city-row";

    row.dataset.flightIndex = index;

    row.innerHTML = `
      <div class="multi-city-row-header">
        <strong>Flight ${index + 1}</strong>

        ${
          index > 0
            ? `
              <button
                type="button"
                class="remove-flight-btn"
                data-remove-flight="${index}"
                aria-label="Remove flight ${index + 1}"
                title="Remove flight"
              >
                ×
              </button>
            `
            : ""
        }
      </div>

      <div class="multi-city-row-fields">

        <label class="search-field">
          <span>From</span>

          <div class="field-content">
            <span class="field-icon">⌖</span>

            <input
              type="text"
              class="multi-city-from"
              data-field="from"
              data-index="${index}"
              placeholder="City or airport"
              autocomplete="off"
              required
            />
          </div>
        </label>

        <label class="search-field">
          <span>To</span>

          <div class="field-content">
            <span class="field-icon">⌖</span>

            <input
              type="text"
              class="multi-city-to"
              data-field="to"
              data-index="${index}"
              placeholder="City or airport"
              autocomplete="off"
              required
            />
          </div>
        </label>

        <label class="search-field">
          <span>Departure</span>

          <div class="field-content">
            <span class="field-icon">▣</span>

            <input
              type="date"
              class="multi-city-date"
              data-field="date"
              data-index="${index}"
              required
            />
          </div>
        </label>

      </div>
    `;

    return row;
  };

  /* =========================
     RENDER MULTI-CITY ROWS
  ========================= */

  const renderMultiCityRows = () => {
    if (!multiCityRows) return;

    multiCityRows.innerHTML = "";

    multiCityFlights.forEach((flight, index) => {
      const row = createMultiCityRow(index);

      multiCityRows.appendChild(row);

      const fromInput = row.querySelector(".multi-city-from");
      const toInput = row.querySelector(".multi-city-to");
      const dateInput = row.querySelector(".multi-city-date");

      if (fromInput) {
        fromInput.value = flight.from || "";
      }

      if (toInput) {
        toInput.value = flight.to || "";
      }

      if (dateInput) {
        dateInput.value = flight.date || "";
      }
    });

    updateAddFlightButton();

    /*
      Attach input events after rendering.
    */

    qsa(".multi-city-from").forEach((input) => {
      input.addEventListener("input", () => {
        const index = Number(input.dataset.index);

        if (!multiCityFlights[index]) return;

        multiCityFlights[index].from = input.value;

        /*
          If this is the From field of a flight after Flight 1,
          keep the previous destination synchronized.
        */

        if (index > 0) {
          const previousFlight = multiCityFlights[index - 1];

          if (previousFlight) {
            previousFlight.to = input.value;
          }
        }
      });

      input.addEventListener("blur", () => {
        const index = Number(input.dataset.index);

        if (index < 0) return;

        /*
          Automatically use the previous flight's destination
          as the current flight's origin.
        */

        if (index > 0 && !input.value.trim()) {
          const previousFlight = multiCityFlights[index - 1];

          if (previousFlight?.to) {
            input.value = previousFlight.to;
            multiCityFlights[index].from = previousFlight.to;
          }
        }
      });
    });

    qsa(".multi-city-to").forEach((input) => {
      input.addEventListener("input", () => {
        const index = Number(input.dataset.index);

        if (!multiCityFlights[index]) return;

        multiCityFlights[index].to = input.value;

        /*
          Automatically carry this destination into
          the next flight's origin.
        */

        if (index + 1 < multiCityFlights.length) {
          multiCityFlights[index + 1].from = input.value;

          const nextFrom = qs(`.multi-city-from[data-index="${index + 1}"]`);

          if (nextFrom) {
            nextFrom.value = input.value;
          }
        }
      });
    });

    qsa(".multi-city-date").forEach((input) => {
      input.addEventListener("change", () => {
        const index = Number(input.dataset.index);

        if (!multiCityFlights[index]) return;

        multiCityFlights[index].date = input.value;

        /*
          The next flight cannot depart before
          the previous flight.
        */

        if (index + 1 < multiCityFlights.length) {
          const nextDate = qs(`.multi-city-date[data-index="${index + 1}"]`);

          if (nextDate && input.value) {
            nextDate.min = input.value;

            if (nextDate.value && nextDate.value < input.value) {
              nextDate.value = input.value;

              multiCityFlights[index + 1].date = input.value;
            }
          }
        }
      });
    });

    /*
      Remove buttons.
    */

    qsa("[data-remove-flight]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.removeFlight);

        if (Number.isNaN(index)) return;

        removeMultiCityFlight(index);
      });
    });

    /*
      Set minimum dates for each subsequent flight.
    */

    for (let index = 1; index < multiCityFlights.length; index++) {
      const previousFlight = multiCityFlights[index - 1];

      const currentDate = qs(`.multi-city-date[data-index="${index}"]`);

      if (currentDate && previousFlight?.date) {
        currentDate.min = previousFlight.date;
      }
    }
  };

  /* =========================
     ADD MULTI-CITY FLIGHT
  ========================= */

  const addMultiCityFlight = () => {
    if (multiCityFlights.length >= MAX_MULTI_CITY_FLIGHTS) {
      toast(`You can add up to ${MAX_MULTI_CITY_FLIGHTS} flights.`);
      return;
    }

    const previousFlight = multiCityFlights[multiCityFlights.length - 1];

    const newFlight = {
      from: previousFlight?.to || "",
      to: "",
      date: previousFlight?.date || "",
    };

    multiCityFlights.push(newFlight);

    renderMultiCityRows();

    /*
      Focus the new From field.
    */

    const newIndex = multiCityFlights.length - 1;

    const newFrom = qs(`.multi-city-from[data-index="${newIndex}"]`);

    newFrom?.focus();
  };

  /* =========================
     REMOVE MULTI-CITY FLIGHT
  ========================= */

  const removeMultiCityFlight = (index) => {
    /*
      Flight 1 cannot be removed.
    */

    if (index <= 0) {
      return;
    }

    multiCityFlights.splice(index, 1);

    /*
      After removing a row, keep the route chain connected.
    */

    for (let i = 1; i < multiCityFlights.length; i++) {
      if (multiCityFlights[i - 1].to && !multiCityFlights[i].from) {
        multiCityFlights[i].from = multiCityFlights[i - 1].to;
      }
    }

    renderMultiCityRows();
  };

  /* =========================
     ADD FLIGHT BUTTON
  ========================= */

  addFlightBtn?.addEventListener("click", () => {
    addMultiCityFlight();
  });

  /* =========================
     UPDATE ADD BUTTON
  ========================= */

  const updateAddFlightButton = () => {
    if (!addFlightBtn) return;

    if (multiCityFlights.length >= MAX_MULTI_CITY_FLIGHTS) {
      addFlightBtn.disabled = true;
      addFlightBtn.innerHTML = `
        <span aria-hidden="true">✓</span>
        Maximum flights added
      `;
    } else {
      addFlightBtn.disabled = false;
      addFlightBtn.innerHTML = `
        <span aria-hidden="true">+</span>
        Add flight
      `;
    }
  };

  /* =========================
     START MULTI-CITY
  ========================= */

  const initializeMultiCity = () => {
    multiCityFlights = [
      {
        from: qs("#from")?.value || "",
        to: qs("#to")?.value || "",
        date: qs("#departure")?.value || "",
      },
    ];

    renderMultiCityRows();

    if (multiCityFields) {
      multiCityFields.hidden = false;
    }

    /*
      Hide the standard From/To/Departure fields.
    */

    qs("#standardFromField")?.style &&
      (qs("#standardFromField").style.display = "none");

    qs("#standardToField")?.style &&
      (qs("#standardToField").style.display = "none");

    qs("#standardDepartureField")?.style &&
      (qs("#standardDepartureField").style.display = "none");

    /*
      Hide swap button.
    */

    qs("#swapAirports")?.style && (qs("#swapAirports").style.display = "none");

    /*
      Hide Return because Multi-City uses
      individual departure dates.
    */

    if (returnWrap) {
      returnWrap.style.display = "none";
    }
  };

  /* =========================
     EXIT MULTI-CITY
  ========================= */

  const disableMultiCity = () => {
    if (multiCityFields) {
      multiCityFields.hidden = true;
    }

    qs("#standardFromField")?.style &&
      (qs("#standardFromField").style.display = "");

    qs("#standardToField")?.style &&
      (qs("#standardToField").style.display = "");

    qs("#standardDepartureField")?.style &&
      (qs("#standardDepartureField").style.display = "");

    qs("#swapAirports")?.style && (qs("#swapAirports").style.display = "");

    multiCityFlights = [];
  };

  /* =========================
     TRIP TYPE UPDATE
  ========================= */

  function updateTripType(button) {
    if (!button) return;

    /*
      Remove active state from all tabs.
    */

    tripTabs.forEach((item) => {
      item.classList.remove("active");
    });

    /*
      Activate selected tab.
    */

    button.classList.add("active");

    const tripType = button.dataset.trip;

    /*
      MULTI-CITY
    */

    if (tripType === "multi") {
      initializeMultiCity();
      return;
    }

    /*
      Leave Multi-City mode.
    */

    disableMultiCity();

    /*
      ONE WAY
    */

    if (tripType === "one") {
      if (returnWrap) {
        returnWrap.style.display = "none";
      }

      const returnDate = qs("#returnDate");

      if (returnDate) {
        returnDate.value = "";
      }

      return;
    }

    /*
      ROUND TRIP
    */

    if (returnWrap) {
      returnWrap.style.display = "block";
    }
  }

  /* =========================
     INITIAL STATE
  ========================= */

  const activeTrip = qs(".trip-tab.active");

  if (activeTrip) {
    updateTripType(activeTrip);
  } else if (tripTabs.length > 0) {
    updateTripType(tripTabs[0]);
  }

  /* =========================
     TRIP TAB CLICK
  ========================= */

  tripTabs.forEach((button) => {
    button.addEventListener("click", () => {
      updateTripType(button);
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

    const activeTripButton = qs(".trip-tab.active");

    const tripType = activeTripButton?.dataset.trip || "one";

    /*
      MULTI-CITY SEARCH
    */

    if (tripType === "multi") {
      /*
        Read the latest values directly from the inputs
        before submitting.
      */

      qsa(".multi-city-from").forEach((input) => {
        const index = Number(input.dataset.index);

        if (multiCityFlights[index]) {
          multiCityFlights[index].from = input.value.trim();
        }
      });

      qsa(".multi-city-to").forEach((input) => {
        const index = Number(input.dataset.index);

        if (multiCityFlights[index]) {
          multiCityFlights[index].to = input.value.trim();
        }
      });

      qsa(".multi-city-date").forEach((input) => {
        const index = Number(input.dataset.index);

        if (multiCityFlights[index]) {
          multiCityFlights[index].date = input.value;
        }
      });

      /*
        Validate every flight.
      */

      const incompleteFlight = multiCityFlights.find(
        (flight) => !flight.from || !flight.to || !flight.date,
      );

      if (incompleteFlight) {
        toast("Please complete all multi-city flight details.");
        return;
      }

      /*
        Create multi-city query parameters.

        Example:

        flights.html?
        trip=multi&
        multiCity=[...]
      */

      const url =
        `flights.html?trip=multi` +
        `&multiCity=${encodeURIComponent(JSON.stringify(multiCityFlights))}`;

      window.location.href = url;

      return;
    }

    /*
      ONE WAY / ROUND TRIP
    */

    const from = qs("#from")?.value.trim();
    const to = qs("#to")?.value.trim();

    if (!from || !to) {
      toast("Please enter departure and destination.");
      return;
    }

    const departure = qs("#departure")?.value || "";

    const returnDate = qs("#returnDate")?.value || "";

    const url =
      `flights.html?from=${encodeURIComponent(from)}` +
      `&to=${encodeURIComponent(to)}` +
      `&departure=${encodeURIComponent(departure)}` +
      `&return=${encodeURIComponent(returnDate)}` +
      `&trip=${encodeURIComponent(tripType)}`;

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

    /*
      Multi-city result summary.
    */

    const multiCityParam = params.get("multiCity");

    let multiCityResult = [];

    if (multiCityParam) {
      try {
        multiCityResult = JSON.parse(multiCityParam);
      } catch (error) {
        multiCityResult = [];
      }
    }

    if (routeSummary && multiCityResult.length > 0) {
      routeSummary.textContent =
        multiCityResult
          .map((flight) => `${flight.from} → ${flight.to}`)
          .join(" · ") + " · Compare available flight options";
    } else if (routeSummary) {
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
                  <span class="time">
                    ${flight.dep}
                  </span>

                  ─

                  <span class="time">
                    ${flight.arr}
                  </span>

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

    /* =========================
       SORT
    ========================= */

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

    /* =========================
       NONSTOP
    ========================= */

    qs("#filterNonstop")?.addEventListener("change", (event) => {
      const filtered = event.target.checked
        ? data.filter((flight) => flight.stops === 0)
        : data;

      renderFlights(filtered);
    });

    /* =========================
       CLEAR FILTER
    ========================= */

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

      <hr>

      <div class="detail-price">

        <span>
          Price per passenger
        </span>

        <strong>
          $${flight.price}
        </strong>

      </div>

      <br>

      <a
        class="btn btn-primary"
        href="booking.html?id=${id}"
      >
        Continue to booking
      </a>
    `;
  }

  /* =========================
     AIRLINE DETAILS
  ========================= */

  const airlineDetail = qs("#airlineDetail");

  if (airlineDetail) {
    const name =
      new URLSearchParams(window.location.search).get("name") || "Airline";

    airlineDetail.innerHTML = `
      <span class="eyebrow">
        Airline
      </span>

      <h1>
        ${name}
      </h1>

      <p>
        Explore flight options operated by
        ${name}.
        Availability, schedules and fares can
        change and should be confirmed through
        the applicable provider.
      </p>
    `;
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

  /* =========================
     SUPPORT CHAT FUNCTIONS
  ========================= */

  function showChatHome() {
    const body = qs("#chatBody");

    if (!body) return;

    body.innerHTML = `
      <div class="chat-message bot">
        Hi! Choose a common problem and
        I'll show you the available guidance.
      </div>

      <div class="chat-options">

        <button data-chat-topic="booking">
          🎫 Booking problem
        </button>

        <button data-chat-topic="payment">
          💳 Payment problem
        </button>

        <button data-chat-topic="cancel">
          🔄 Change / cancel
        </button>

        <button data-chat-topic="confirmation">
          📧 Confirmation
        </button>

        <button data-chat-topic="refund">
          💰 Refund
        </button>

        <button data-chat-topic="other">
          ❓ Other issue
        </button>

      </div>
    `;

    attachChatTopicEvents();
  }

  /* =========================
     SHOW CHAT ANSWER
  ========================= */

  function showChatAnswer(topic) {
    const body = qs("#chatBody");

    if (!body) return;

    const answer = supportAnswers[topic] || supportAnswers.other;

    body.innerHTML = `
      <button
        class="chat-back-btn"
        id="chatBack"
      >
        ← Back
      </button>

      <div class="chat-message bot">

        <strong>
          ${answer[0]}
        </strong>

        <br><br>

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

    /* BACK */

    qs("#chatBack")?.addEventListener("click", () => {
      showChatHome();
    });

    /* YES */

    qs("#chatYes")?.addEventListener("click", () => {
      body.innerHTML = `
          <button
            class="chat-back-btn"
            id="chatBack"
          >
            ← Back
          </button>

          <div class="chat-message bot">
            Great! Happy to help. ✈️
          </div>
        `;

      qs("#chatBack")?.addEventListener("click", () => {
        showChatAnswer(topic);
      });
    });

    /* NO */

    qs("#chatNo")?.addEventListener("click", () => {
      body.innerHTML = `
          <button
            class="chat-back-btn"
            id="chatBack"
          >
            ← Back
          </button>

          <div class="chat-message bot">
            No problem. A service agent can
            help with your issue.
          </div>

          <a
            class="btn btn-primary full"
            href="contact.html"
          >
            Contact service team
          </a>
        `;

      qs("#chatBack")?.addEventListener("click", () => {
        showChatAnswer(topic);
      });
    });
  }

  /* =========================
     CHAT TOPIC EVENTS
  ========================= */

  function attachChatTopicEvents() {
    qsa("[data-chat-topic]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = button.dataset.chatTopic;

        showChatAnswer(topic);
      });
    });
  }

  /* =========================
     INITIAL CHAT EVENTS
  ========================= */

  attachChatTopicEvents();

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

  let passengers = {
    adult: 1,
    child: 0,
    infant: 0,
  };

  /* =========================
     TOTAL PASSENGERS
  ========================= */

  const getTotalPassengers = () => {
    return passengers.adult + passengers.child + passengers.infant;
  };

  /* =========================
     PASSENGER DISPLAY
  ========================= */

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

  /* =========================
     OPEN PASSENGER POPUP
  ========================= */

  const openPassengerPopup = () => {
    if (!passengerPopup || !passengerTrigger) {
      return;
    }

    passengerPopup.classList.add("open");

    passengerTrigger.setAttribute("aria-expanded", "true");
  };

  /* =========================
     CLOSE PASSENGER POPUP
  ========================= */

  const closePassengerPopup = () => {
    if (!passengerPopup || !passengerTrigger) {
      return;
    }

    passengerPopup.classList.remove("open");

    passengerTrigger.setAttribute("aria-expanded", "false");
  };

  /* =========================
     PASSENGER FIELD CLICK
  ========================= */

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

      /*
            Maximum 9 travelers.
          */

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

      /*
            Adult minimum = 1.
          */

      if (type === "adult" && passengers.adult <= 1) {
        return;
      }

      /*
            Child / Infant minimum = 0.
          */

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
