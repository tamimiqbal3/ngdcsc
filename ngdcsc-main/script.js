// Main Website Script with JSONBin.io Live System - FIXED SYNC VERSION
document.addEventListener("DOMContentLoaded", function () {
  // Initialize current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // ============= JSONBin.io Configuration =============
  const BIN_ID = "6981baaeae596e708f0d9703";
  const API_KEY =
    "$2a$10$FQHf7jp2QVg9gC6OiFqVd.oE7ALHezMi0xD0v7fr0KmhgwxWFepge";
  // ====================================================

  // প্রথমে JSONBin থেকে ডাটা লোড করুন
  loadFromJSONBin();

  // Initialize with default data
  initializeWebsiteData();

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((item) => {
    item.addEventListener("click", function () {
      navLinks.classList.remove("active");
    });
  });

  // Join Now buttons functionality
  setupJoinButtons();

  // Smooth scrolling for anchor links
  setupSmoothScrolling();

  // Navbar scroll effect
  setupNavbarScroll();

  // Initialize admin panel
  initializeAdminPanel();

  // Load saved data from localStorage
  loadSavedData();

  // Auto-refresh every 5 seconds
  setInterval(loadFromJSONBin, 5000);
});

// ============= JSONBin.io Functions =============
async function loadFromJSONBin() {
  const BIN_ID = "6981baaeae596e708f0d9703";
  const API_KEY =
    "$2a$10$FQHf7jp2QVg9gC6OiFqVd.oE7ALHezMi0xD0v7fr0KmhgwxWFepge";

  if (!BIN_ID || !API_KEY) {
    console.log("JSONBin not configured yet");
    return;
  }

  try {
    const response = await fetch(
      `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`,
      {
        headers: { "X-Master-Key": API_KEY },
      },
    );

    if (!response.ok) throw new Error("Failed to fetch from JSONBin");

    const data = await response.json();
    const websiteData = data.record;

    console.log("✅ Data loaded from JSONBin:", websiteData);

    // IMPORTANT: Always update localStorage with fresh data from JSONBin
    if (websiteData.executives) {
      localStorage.setItem(
        "ngdcscExecutives",
        JSON.stringify(websiteData.executives),
      );
    }

    if (websiteData.notices) {
      localStorage.setItem(
        "ngdcscNotices",
        JSON.stringify(websiteData.notices),
      );
    }

    if (websiteData.events) {
      localStorage.setItem("ngdcscEvents", JSON.stringify(websiteData.events));
    }

    if (websiteData.content) {
      localStorage.setItem(
        "ngdcscContent",
        JSON.stringify(websiteData.content),
      );
    }

    // Now render everything with updated data
    loadSavedData();
  } catch (error) {
    console.log("⚠️ Using localStorage data:", error);
  }
}

async function saveAllToJSONBin() {
  const BIN_ID = "6981baaeae596e708f0d9703";
  const API_KEY =
    "$2a$10$FQHf7jp2QVg9gC6OiFqVd.oE7ALHezMi0xD0v7fr0KmhgwxWFepge";

  if (!BIN_ID || !API_KEY) {
    console.log("JSONBin not configured. Data saved locally only.");
    return false;
  }

  try {
    const allData = {
      executives: JSON.parse(localStorage.getItem("ngdcscExecutives") || "[]"),
      notices: JSON.parse(localStorage.getItem("ngdcscNotices") || "[]"),
      events: JSON.parse(localStorage.getItem("ngdcscEvents") || "[]"),
      content: JSON.parse(localStorage.getItem("ngdcscContent") || "{}"),
    };

    console.log("💾 Saving to JSONBin:", allData);

    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
        "X-Bin-Versioning": "false",
      },
      body: JSON.stringify(allData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Data saved to JSONBin:", result);
      return true;
    } else {
      throw new Error("Save failed");
    }
  } catch (error) {
    console.error("❌ Error saving to JSONBin:", error);
    return false;
  }
}

// ===============================================

// Picture Upload Functionality
let currentPictureFile = null;
let picturePreviewUrl = null;

// Website Data Management
function initializeWebsiteData() {
  // Default executives data
  const defaultExecutives = [
    {
      name: "Sarah Ahmed",
      position: "President",
      department: "Physics Department",
      hscYear: "2024",
      email: "sarah.ahmed@ngdc.edu",
      phone: "+880 1712 345678",
    },
    {
      name: "Rahim Khan",
      position: "Vice President",
      department: "Chemistry Department",
      hscYear: "2024",
      email: "rahim.khan@ngdc.edu",
      phone: "+880 1713 456789",
    },
    {
      name: "Fatima Jahan",
      position: "General Secretary",
      department: "Biology Department",
      hscYear: "2024",
      email: "fatima.jahan@ngdc.edu",
      phone: "+880 1714 567890",
    },
    {
      name: "Arif Hossain",
      position: "Treasurer",
      department: "Mathematics Department",
      hscYear: "2024",
      email: "arif.hossain@ngdc.edu",
      phone: "+880 1715 678901",
    },
  ];

  // Default notices data
  const defaultNotices = [
    {
      title: "Annual Science Fair Registration",
      date: "November 30, 2024",
      content:
        "Registration for Annual Science Fair 2024 is now open. Last date to submit project proposals is November 30.",
      type: "urgent",
    },
    {
      title: "Robotics Workshop",
      date: "December 5-6, 2024",
      content:
        "Two-day hands-on robotics workshop for beginners. Limited seats available.",
      type: "normal",
    },
    {
      title: "Inter-College Science Quiz",
      date: "December 15, 2024",
      content:
        "Prepare for the annual inter-college science competition. Team selection trials next week.",
      type: "normal",
    },
  ];

  // Default events data
  const defaultEvents = [
    {
      id: 1,
      title: "Annual Science Fair 2024",
      date: "December 15, 2024",
      time: "10:00 AM - 4:00 PM",
      description: "Showcase of innovative science projects by club members",
      location: "NGDC Auditorium",
      type: "exhibition",
    },
    {
      id: 2,
      title: "Physics Workshop",
      date: "December 10, 2024",
      time: "2:00 PM - 5:00 PM",
      description: "Hands-on workshop on modern physics experiments",
      location: "Physics Lab, Block B",
      type: "workshop",
    },
    {
      id: 3,
      title: "Chemistry Olympiad Preparation",
      date: "December 5, 2024",
      time: "3:00 PM - 6:00 PM",
      description:
        "Preparation session for upcoming national chemistry olympiad",
      location: "Chemistry Lab",
      type: "competition",
    },
  ];

  // Default content data
  const defaultContent = {
    tagline: "Igniting Curiosity, Building Future 🔬",
    welcomeDesc:
      "Join Bangladesh's premier student science organization fostering innovation and discovery",
    aboutDesc:
      "NGDC Science Club (NGDCSC) is a premier student-led organization established in 2026 with the mission to foster scientific curiosity, innovation, and practical learning among students.",
    mission:
      "To create a platform where theoretical knowledge meets practical application through hands-on experiments, workshops, and collaborative projects.",
    vision:
      "To develop the next generation of scientists and innovators who will contribute to scientific advancement and technological progress.",
    joinLink: "https://forms.gle/AXKhPyQ4ZBwRqUSt5",
    footerEmail: "ngdcscienceclub@ngdc.edu",
    facebookLink: "https://facebook.com/yourpage",
    instagramLink: "https://instagram.com/yourpage",
  };

  // Save default data if not exists
  if (!localStorage.getItem("ngdcscExecutives")) {
    localStorage.setItem("ngdcscExecutives", JSON.stringify(defaultExecutives));
  }
  if (!localStorage.getItem("ngdcscNotices")) {
    localStorage.setItem("ngdcscNotices", JSON.stringify(defaultNotices));
  }
  if (!localStorage.getItem("ngdcscEvents")) {
    localStorage.setItem("ngdcscEvents", JSON.stringify(defaultEvents));
  }
  if (!localStorage.getItem("ngdcscContent")) {
    localStorage.setItem("ngdcscContent", JSON.stringify(defaultContent));
  }
}

function loadSavedData() {
  // Load executives
  const executives = JSON.parse(
    localStorage.getItem("ngdcscExecutives") || "[]",
  );
  renderExecutives(executives);

  // Load notices
  const notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
  renderNotices(notices);

  // Load events
  const events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
  renderEvents(events);

  // Load content
  const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
  renderContent(content);
}

// FIXED: Executive rendering
function renderExecutives(executives) {
  const container = document.getElementById("executiveContainer");
  if (!container) return;
  container.innerHTML = "";

  executives.forEach((exec) => {
    const executiveCard = document.createElement("div");
    executiveCard.className = "executive-card fade-in-up";
    let pictureHtml = '<i class="fas fa-user-circle"></i>';
    if (exec.picture) {
      pictureHtml = `<img src="${exec.picture}" alt="${exec.name}" loading="lazy">`;
    }

    executiveCard.innerHTML = `
      <div class="executive-img-container">
        <div class="executive-img">${pictureHtml}</div>
      </div>
      <div class="executive-card-content">
        <h3>${exec.name}</h3>
        <p class="position">${exec.position}</p>
        <p class="department">${exec.department}</p>
        <p class="hsc-year">HSC Batch: ${exec.hscYear}</p>
        <div class="contact-info">
          <p><i class="fas fa-envelope"></i> <span>${exec.email}</span></p>
          <p><i class="fas fa-phone"></i> <span>${exec.phone}</span></p>
        </div>
      </div>
    `;
    container.appendChild(executiveCard);
  });
}

function renderNotices(notices) {
  const container = document.getElementById("noticeBoardContainer");
  if (!container) return;
  container.innerHTML = "";

  notices.forEach((notice) => {
    const noticeItem = document.createElement("div");
    noticeItem.className = `notice-item ${notice.type}`;
    noticeItem.innerHTML = `
      <div class="notice-icon">
        <i class="fas ${notice.type === "urgent" ? "fa-exclamation-circle" : "fa-bullhorn"}"></i>
      </div>
      <div class="notice-content">
        <h4>${notice.title}</h4>
        <p class="notice-date"><i class="far fa-calendar"></i> ${notice.date}</p>
        <p>${notice.content}</p>
      </div>
    `;
    container.appendChild(noticeItem);
  });
}

function renderEvents(events) {
  const container = document.getElementById("eventContainer");
  if (!container) return;
  container.innerHTML = "";

  if (!events || events.length === 0) {
    container.innerHTML = `
      <div class="event-item">
        <div class="event-date" style="border-left-color: #4CAF50">
          <i class="fas fa-calendar" style="color: #4CAF50"></i>
          <span>No events scheduled</span>
        </div>
        <div class="event-content">
          <h4>No Upcoming Events</h4>
          <p>Check back soon for new events and announcements.</p>
        </div>
      </div>
    `;
    return;
  }

  // Sort events by date (nearest first)
  const sortedEvents = [...events].sort((a, b) => {
    try {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    } catch (error) {
      return 0;
    }
  });

  sortedEvents.slice(0, 3).forEach((event) => {
    const eventItem = document.createElement("div");
    eventItem.className = "event-item";

    let eventIcon = "fa-calendar";
    let eventColor = "#4CAF50";

    if (event.type) {
      switch (event.type.toLowerCase()) {
        case "workshop":
          eventIcon = "fa-flask";
          eventColor = "#2196F3";
          break;
        case "seminar":
          eventIcon = "fa-chalkboard-teacher";
          eventColor = "#FF9800";
          break;
        case "competition":
          eventIcon = "fa-trophy";
          eventColor = "#9C27B0";
          break;
        case "exhibition":
          eventIcon = "fa-images";
          eventColor = "#E91E63";
          break;
        case "meeting":
          eventIcon = "fa-users";
          eventColor = "#607D8B";
          break;
        default:
          eventIcon = "fa-calendar";
          eventColor = "#4CAF50";
      }
    }

    eventItem.innerHTML = `
      <div class="event-date" style="border-left-color: ${eventColor}">
        <i class="fas ${eventIcon}" style="color: ${eventColor}"></i>
        <span>${event.date || "Date TBA"}</span>
      </div>
      <div class="event-content">
        <h4>${event.title || "Event Title"}</h4>
        <p>${event.description || "Event details coming soon."}</p>
        ${event.time ? `<p><i class="fas fa-clock"></i> ${event.time}</p>` : ""}
        ${event.location ? `<p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>` : ""}
        <span class="event-tag" style="background: ${eventColor}20; color: ${eventColor}">${event.type || "Event"}</span>
      </div>
    `;
    container.appendChild(eventItem);
  });
}

function renderContent(content) {
  if (content.tagline)
    document.getElementById("dynamicTagline").textContent = content.tagline;
  if (content.welcomeDesc)
    document.getElementById("dynamicWelcomeDesc").textContent =
      content.welcomeDesc;
  if (content.aboutDesc)
    document.getElementById("dynamicAboutDesc").textContent = content.aboutDesc;
  if (content.mission)
    document.getElementById("dynamicMission").textContent = content.mission;
  if (content.vision)
    document.getElementById("dynamicVision").textContent = content.vision;
  if (content.footerEmail)
    document.getElementById("footerEmailText").textContent =
      content.footerEmail;

  if (content.facebookLink) {
    const facebookLink = document.getElementById("footerFacebookLink");
    if (facebookLink) facebookLink.href = content.facebookLink;
  }

  if (content.instagramLink) {
    const instagramLink = document.getElementById("footerInstagramLink");
    if (instagramLink) instagramLink.href = content.instagramLink;
  }

  if (content.joinLink) {
    const joinButtons = document.querySelectorAll(
      "#mainJoinBtn, #heroJoinBtn, #noticeJoinBtn, #footerJoinBtn",
    );
    joinButtons.forEach((btn) => {
      btn.href = content.joinLink;
    });
  }
}

function setupJoinButtons() {
  const joinButtons = document.querySelectorAll(
    "#mainJoinBtn, #heroJoinBtn, #noticeJoinBtn, #footerJoinBtn",
  );
  joinButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
      if (
        content.joinLink &&
        content.joinLink !== "https://forms.google.com/your-form-link"
      ) {
        window.open(content.joinLink, "_blank");
      } else {
        e.preventDefault();
        alert(
          "Join Now link is not configured. Please contact the admin or check back later.",
        );
      }
    });
  });
}

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;
      const targetId = this.getAttribute("href");
      if (targetId.startsWith("#") && targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

function setupNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    }
  });
}

// ============= COPY LINK FUNCTIONALITY =============
// Copy to clipboard function for notices and executives
window.copyToClipboard = function (type, index) {
  // Create the full URL with anchor
  const baseUrl = window.location.origin + window.location.pathname;
  const fullUrl = baseUrl + "#" + type + "-" + index;

  // Copy to clipboard
  navigator.clipboard
    .writeText(fullUrl)
    .then(() => {
      showCopySuccessMessage();
    })
    .catch((err) => {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = fullUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showCopySuccessMessage();
    });
};

// Show copy success message
function showCopySuccessMessage() {
  // Remove existing message if any
  const existingMessage = document.getElementById("copySuccessMessage");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create message element
  const message = document.createElement("div");
  message.id = "copySuccessMessage";
  message.innerHTML =
    '<i class="fas fa-check-circle"></i> Link copied to clipboard!';

  // Style the message
  message.style.position = "fixed";
  message.style.bottom = "30px";
  message.style.right = "30px";
  message.style.backgroundColor = "#28a745";
  message.style.color = "white";
  message.style.padding = "15px 25px";
  message.style.borderRadius = "8px";
  message.style.fontSize = "1rem";
  message.style.boxShadow = "0 5px 20px rgba(0,0,0,0.2)";
  message.style.zIndex = "9999";
  message.style.display = "flex";
  message.style.alignItems = "center";
  message.style.gap = "10px";
  message.style.animation = "slideIn 0.3s ease-out";

  // Add animation keyframes
  if (!document.querySelector("#copyLinkAnimations")) {
    const style = document.createElement("style");
    style.id = "copyLinkAnimations";
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(message);

  // Hide after 2 seconds
  setTimeout(() => {
    message.style.animation = "slideIn 0.3s ease-out reverse";
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 300);
  }, 2000);
}

// Handle anchor links for shared content
window.addEventListener("load", function () {
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const [type, index] = hash.split("-");

    if (type === "notice" && index) {
      const noticeElement = document.querySelector(
        `[data-notice-id="${index}"]`,
      );
      if (noticeElement) {
        noticeElement.style.backgroundColor = "#fff3cd";
        noticeElement.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          noticeElement.style.backgroundColor = "";
        }, 3000);
      }
    } else if (type === "executive" && index) {
      const execElement = document.querySelector(
        `[data-executive-id="${index}"]`,
      );
      if (execElement) {
        execElement.style.backgroundColor = "#fff3cd";
        execElement.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          execElement.style.backgroundColor = "";
        }, 3000);
      }
    }
  }
});
// ===================================================

// Admin Panel Functions
function initializeAdminPanel() {
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const adminLoginModal = document.getElementById("adminLoginModal");
  const closeModal = document.querySelector(".close-modal");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminPanel = document.getElementById("adminPanel");

  const ADMIN_USERNAME = "ngdcsc";
  const ADMIN_PASSWORD = "ngdc@sc@2026#";

  adminLoginBtn.addEventListener("click", function () {
    adminLoginModal.style.display = "block";
  });
  closeModal.addEventListener("click", function () {
    adminLoginModal.style.display = "none";
  });
  window.addEventListener("click", function (e) {
    if (e.target === adminLoginModal) adminLoginModal.style.display = "none";
  });

  adminLoginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      adminLoginModal.style.display = "none";
      adminPanel.style.display = "block";
      document.body.style.overflow = "hidden";
      loadAdminData();
      adminLoginForm.reset();
    } else {
      alert("Invalid username or password!");
    }
  });

  logoutBtn.addEventListener("click", function () {
    adminPanel.style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Tab switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      document
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.remove("active"));
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });

  setupAdminNotices();
  setupAdminExecutives();
  setupAdminEvents();
  setupAdminContent();
}

// FIXED: Load admin data with JSONBin sync
function loadAdminData() {
  // Always sync with JSONBin first
  loadFromJSONBin().then(() => {
    // Load notices
    const notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
    const noticeList = document.getElementById("noticeList");
    if (noticeList) {
      noticeList.innerHTML = "";
      notices.forEach((notice, index) => {
        const noticeItem = document.createElement("div");
        noticeItem.className = "notice-item-admin";
        noticeItem.setAttribute("data-notice-id", index);
        noticeItem.innerHTML = `
          <div class="notice-content-admin">
            <h5>${notice.title}</h5>
            <p><strong>Date:</strong> ${notice.date}</p>
            <p><strong>Type:</strong> ${notice.type}</p>
            <p>${notice.content.substring(0, 100)}...</p>
          </div>
          <div class="action-buttons">
            <button class="copy-link-btn" onclick="copyToClipboard('notice', ${index})" title="Copy Link">
              <i class="fas fa-link"></i> Copy Link
            </button>
            <button class="delete-btn" onclick="deleteNotice(${index})">Delete</button>
          </div>
        `;
        noticeList.appendChild(noticeItem);
      });
    }

    // Load executives
    const executives = JSON.parse(
      localStorage.getItem("ngdcscExecutives") || "[]",
    );
    const executiveList = document.getElementById("executiveList");
    if (executiveList) {
      executiveList.innerHTML = "";
      executives.forEach((exec, index) => {
        let pictureHtml = '<i class="fas fa-user-circle"></i>';
        if (exec.picture)
          pictureHtml = `<img src="${exec.picture}" alt="${exec.name}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;">`;
        const execItem = document.createElement("div");
        execItem.className = "executive-item-admin";
        execItem.setAttribute("data-executive-id", index);
        execItem.innerHTML = `
          <div class="executive-preview-admin">${pictureHtml}</div>
          <div class="executive-content-admin">
            <h5>${exec.name}</h5>
            <p><strong>Position:</strong> ${exec.position}</p>
            <p><strong>Department:</strong> ${exec.department}</p>
            <p><strong>HSC Year:</strong> ${exec.hscYear}</p>
            <p><strong>Email:</strong> ${exec.email}</p>
            <p><strong>Phone:</strong> ${exec.phone}</p>
          </div>
          <div class="executive-actions">
            <button class="copy-link-btn" onclick="copyToClipboard('executive', ${index})" title="Copy Link">
              <i class="fas fa-link"></i> Copy Link
            </button>
            <button class="delete-btn" onclick="deleteExecutive(${index})">Delete</button>
          </div>
        `;
        executiveList.appendChild(execItem);
      });
    }

    // Load events
    const events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
    const eventList = document.getElementById("eventList");
    if (eventList) {
      eventList.innerHTML = "";
      events.forEach((event, index) => {
        const eventItem = document.createElement("div");
        eventItem.className = "admin-item";
        eventItem.innerHTML = `
          <div class="item-content">
            <h5>${event.title}</h5>
            <p><i class="fas fa-calendar"></i> ${event.date} ${event.time ? `| ${event.time}` : ""}</p>
            <p>${event.description}</p>
            ${event.location ? `<p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>` : ""}
            <span class="item-tag">${event.type}</span>
          </div>
          <div class="item-actions">
            <button class="edit-btn" onclick="editEvent(${index})"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick="deleteEvent(${index})"><i class="fas fa-trash"></i></button>
          </div>
        `;
        eventList.appendChild(eventItem);
      });
    }

    // Load content
    const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
    if (document.getElementById("clubTagline"))
      document.getElementById("clubTagline").value = content.tagline || "";
    if (document.getElementById("welcomeText"))
      document.getElementById("welcomeText").value = content.welcomeDesc || "";
    if (document.getElementById("joinLink"))
      document.getElementById("joinLink").value = content.joinLink || "";
    if (document.getElementById("aboutDescription"))
      document.getElementById("aboutDescription").value =
        content.aboutDesc || "";
    if (document.getElementById("missionText"))
      document.getElementById("missionText").value = content.mission || "";
    if (document.getElementById("visionText"))
      document.getElementById("visionText").value = content.vision || "";
    if (document.getElementById("footerEmail"))
      document.getElementById("footerEmail").value = content.footerEmail || "";
    if (document.getElementById("facebookLink"))
      document.getElementById("facebookLink").value =
        content.facebookLink || "";
    if (document.getElementById("instagramLink"))
      document.getElementById("instagramLink").value =
        content.instagramLink || "";
  });
}

// FIXED: Delete functions with proper JSONBin sync
window.deleteNotice = function (index) {
  if (!confirm("Are you sure you want to delete this notice?")) return;
  const notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
  notices.splice(index, 1);
  localStorage.setItem("ngdcscNotices", JSON.stringify(notices));
  saveAllToJSONBin().then(() => {
    // After saving to JSONBin, reload data to ensure sync
    loadFromJSONBin().then(() => {
      loadAdminData();
      renderNotices(notices);
      alert("Notice deleted successfully!");
    });
  });
};

window.deleteExecutive = function (index) {
  if (!confirm("Are you sure you want to delete this executive?")) return;
  const executives = JSON.parse(
    localStorage.getItem("ngdcscExecutives") || "[]",
  );
  executives.splice(index, 1);
  localStorage.setItem("ngdcscExecutives", JSON.stringify(executives));
  saveAllToJSONBin().then(() => {
    loadFromJSONBin().then(() => {
      loadAdminData();
      renderExecutives(executives);
      alert("Executive deleted successfully!");
    });
  });
};

// FIXED: Delete event function with proper sync
window.deleteEvent = function (index) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  const events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
  if (index < 0 || index >= events.length) {
    alert("Invalid event index!");
    return;
  }

  events.splice(index, 1);
  localStorage.setItem("ngdcscEvents", JSON.stringify(events));

  // Save to JSONBin
  saveAllToJSONBin().then((success) => {
    if (success) {
      console.log("✅ Event deleted and synced to JSONBin");
      // IMPORTANT: Reload from JSONBin to ensure all devices have same data
      loadFromJSONBin().then(() => {
        // Reload admin panel
        loadAdminData();
        // Update website display
        renderEvents(JSON.parse(localStorage.getItem("ngdcscEvents") || "[]"));
        alert("Event deleted successfully and synced to all devices!");
      });
    } else {
      alert("Event deleted locally but failed to sync to cloud!");
    }
  });
};

// FIXED: Edit event function
window.editEvent = function (index) {
  const events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
  const event = events[index];

  if (!event) {
    alert("Event not found!");
    return;
  }

  document.getElementById("eventTitle").value = event.title;
  document.getElementById("eventDate").value = event.date;
  document.getElementById("eventTime").value = event.time || "";
  document.getElementById("eventDescription").value = event.description;
  document.getElementById("eventLocation").value = event.location || "";
  document.getElementById("eventType").value = event.type;

  const addBtn = document.getElementById("addEventBtn");
  const originalText = addBtn.innerHTML;
  addBtn.innerHTML = '<i class="fas fa-save"></i> Update Event';

  const originalClick = addBtn.onclick;

  addBtn.onclick = function (e) {
    e.preventDefault();

    event.title = document.getElementById("eventTitle").value.trim();
    event.date = document.getElementById("eventDate").value.trim();
    event.time = document.getElementById("eventTime").value.trim();
    event.description = document
      .getElementById("eventDescription")
      .value.trim();
    event.location = document.getElementById("eventLocation").value.trim();
    event.type = document.getElementById("eventType").value;

    localStorage.setItem("ngdcscEvents", JSON.stringify(events));

    saveAllToJSONBin().then((success) => {
      if (success) {
        console.log("✅ Event updated and synced to JSONBin");
        loadFromJSONBin().then(() => {
          loadAdminData();
          renderEvents(events);

          document.getElementById("eventTitle").value = "";
          document.getElementById("eventDate").value = "";
          document.getElementById("eventTime").value = "";
          document.getElementById("eventDescription").value = "";
          document.getElementById("eventLocation").value = "";
          document.getElementById("eventType").value = "workshop";

          addBtn.innerHTML = originalText;
          addBtn.onclick = originalClick;

          alert("Event updated successfully and synced to all devices!");
        });
      } else {
        alert("Event updated locally but failed to sync to cloud!");
      }
    });
  };

  document.querySelector('[data-tab="events"]').click();
  document.getElementById("eventTitle").focus();
};

function setupAdminNotices() {
  const addNoticeBtn = document.getElementById("addNoticeBtn");
  if (addNoticeBtn) {
    addNoticeBtn.addEventListener("click", function () {
      const title = document.getElementById("noticeTitle").value;
      const date = document.getElementById("noticeDate").value;
      const content = document.getElementById("noticeContent").value;
      const type = document.getElementById("noticeType").value;

      if (!title || !date || !content) {
        alert("Please fill in all notice fields!");
        return;
      }

      const notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
      notices.push({ title, date, content, type });
      localStorage.setItem("ngdcscNotices", JSON.stringify(notices));

      saveAllToJSONBin().then(() => {
        loadFromJSONBin().then(() => {
          loadAdminData();
          renderNotices(notices);
          document.getElementById("noticeTitle").value = "";
          document.getElementById("noticeDate").value = "";
          document.getElementById("noticeContent").value = "";
          alert("Notice added successfully!");
        });
      });
    });
  }
}

function setupAdminExecutives() {
  const addExecutiveBtn = document.getElementById("addExecutiveBtn");
  const choosePictureBtn = document.getElementById("choosePictureBtn");
  const removePictureBtn = document.getElementById("removePictureBtn");
  const pictureInput = document.getElementById("execPicture");
  const picturePreview = document.getElementById("picturePreview");
  const clearFormBtn = document.getElementById("clearExecutiveForm");

  if (choosePictureBtn)
    choosePictureBtn.addEventListener("click", () => pictureInput.click());
  if (pictureInput) {
    pictureInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!validTypes.includes(file.type)) {
          alert("Please select a valid image file (JPG, PNG, GIF, WebP)");
          return;
        }
        if (file.size > 6 * 1024 * 1024) {
          alert("Image size should be less than 6MB");
          return;
        }
        currentPictureFile = file;
        const reader = new FileReader();
        reader.onload = function (e) {
          picturePreviewUrl = e.target.result;
          const img = new Image();
          img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 150;
            canvas.height = 150;
            ctx.drawImage(img, 0, 0, 150, 150);
            const previewData = canvas.toDataURL("image/jpeg", 0.8);
            picturePreview.innerHTML = `<img src="${previewData}" alt="Preview" style="width:150px;height:150px;border-radius:50%;object-fit:cover;">`;
            picturePreviewUrl = e.target.result;
          };
          img.src = picturePreviewUrl;
          removePictureBtn.style.display = "inline-flex";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removePictureBtn)
    removePictureBtn.addEventListener("click", function () {
      currentPictureFile = null;
      picturePreviewUrl = null;
      if (pictureInput) pictureInput.value = "";
      picturePreview.innerHTML =
        '<i class="fas fa-user-circle"></i><span>No picture selected</span>';
      removePictureBtn.style.display = "none";
    });

  if (clearFormBtn)
    clearFormBtn.addEventListener("click", function () {
      document.getElementById("execName").value = "";
      document.getElementById("execPosition").value = "";
      document.getElementById("execDepartment").value = "";
      document.getElementById("execHSCYear").value = "";
      document.getElementById("execEmail").value = "";
      document.getElementById("execPhone").value = "";
      currentPictureFile = null;
      picturePreviewUrl = null;
      if (pictureInput) pictureInput.value = "";
      picturePreview.innerHTML =
        '<i class="fas fa-user-circle"></i><span>No picture selected</span>';
      if (removePictureBtn) removePictureBtn.style.display = "none";
    });

  if (addExecutiveBtn) {
    addExecutiveBtn.addEventListener("click", function () {
      const name = document.getElementById("execName").value;
      const position = document.getElementById("execPosition").value;
      const department = document.getElementById("execDepartment").value;
      const hscYear = document.getElementById("execHSCYear").value;
      const email = document.getElementById("execEmail").value;
      const phone = document.getElementById("execPhone").value;

      if (!name || !position || !department || !hscYear || !email || !phone) {
        alert("Please fill in all required fields!");
        return;
      }

      const executives = JSON.parse(
        localStorage.getItem("ngdcscExecutives") || "[]",
      );
      const execId = "exec_" + Date.now();

      if (picturePreviewUrl) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const maxWidth = 300;
          const maxHeight = 300;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height = height * (maxWidth / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = width * (maxHeight / height);
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
          const pictureData = canvas.toDataURL("image/jpeg", 0.9);
          const newExecutive = {
            id: execId,
            name,
            position,
            department,
            hscYear,
            email,
            phone,
            picture: pictureData,
          };
          executives.push(newExecutive);
          localStorage.setItem("ngdcscExecutives", JSON.stringify(executives));
          saveAllToJSONBin().then(() => {
            loadFromJSONBin().then(() => {
              loadAdminData();
              renderExecutives(executives);
              clearExecutiveForm();
              alert("Executive added successfully!");
            });
          });
        };
        img.src = picturePreviewUrl;
      } else {
        const newExecutive = {
          id: execId,
          name,
          position,
          department,
          hscYear,
          email,
          phone,
          picture: null,
        };
        executives.push(newExecutive);
        localStorage.setItem("ngdcscExecutives", JSON.stringify(executives));
        saveAllToJSONBin().then(() => {
          loadFromJSONBin().then(() => {
            loadAdminData();
            renderExecutives(executives);
            clearExecutiveForm();
            alert("Executive added successfully!");
          });
        });
      }
    });
  }
}

function setupAdminEvents() {
  const addEventBtn = document.getElementById("addEventBtn");
  const clearEventBtn = document.getElementById("clearEventForm");

  if (addEventBtn) {
    addEventBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const title = document.getElementById("eventTitle").value.trim();
      const date = document.getElementById("eventDate").value.trim();
      const time = document.getElementById("eventTime").value.trim();
      const description = document
        .getElementById("eventDescription")
        .value.trim();
      const location = document.getElementById("eventLocation").value.trim();
      const type = document.getElementById("eventType").value;

      if (!title || !date || !description) {
        alert("Please fill in all required fields (Title, Date, Description)");
        return;
      }

      const events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
      const newId =
        events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
      const newEvent = {
        id: newId,
        title,
        date,
        time,
        description,
        location,
        type,
      };

      events.push(newEvent);
      localStorage.setItem("ngdcscEvents", JSON.stringify(events));

      saveAllToJSONBin().then((success) => {
        if (success) {
          console.log("✅ Event added and synced to JSONBin");
          loadFromJSONBin().then(() => {
            loadAdminData();
            renderEvents(events);

            document.getElementById("eventTitle").value = "";
            document.getElementById("eventDate").value = "";
            document.getElementById("eventTime").value = "";
            document.getElementById("eventDescription").value = "";
            document.getElementById("eventLocation").value = "";
            document.getElementById("eventType").value = "workshop";

            alert("Event added successfully and synced to all devices!");
          });
        } else {
          alert("Event added locally but failed to sync to cloud!");
        }
      });
    });
  }

  if (clearEventBtn) {
    clearEventBtn.addEventListener("click", function () {
      document.getElementById("eventTitle").value = "";
      document.getElementById("eventDate").value = "";
      document.getElementById("eventTime").value = "";
      document.getElementById("eventDescription").value = "";
      document.getElementById("eventLocation").value = "";
      document.getElementById("eventType").value = "workshop";
    });
  }
}

function setupAdminContent() {
  const saveHomeBtn = document.getElementById("saveHomeBtn");
  const saveAboutBtn = document.getElementById("saveAboutBtn");
  const saveFooterBtn = document.getElementById("saveFooterBtn");

  if (saveHomeBtn) {
    saveHomeBtn.addEventListener("click", function () {
      const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
      content.tagline =
        document.getElementById("clubTagline").value || content.tagline;
      content.welcomeDesc =
        document.getElementById("welcomeText").value || content.welcomeDesc;
      content.joinLink =
        document.getElementById("joinLink").value || content.joinLink;
      localStorage.setItem("ngdcscContent", JSON.stringify(content));
      saveAllToJSONBin().then(() => {
        loadFromJSONBin().then(() => {
          renderContent(content);
          alert("Home content saved successfully!");
        });
      });
    });
  }

  if (saveAboutBtn) {
    saveAboutBtn.addEventListener("click", function () {
      const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
      content.aboutDesc =
        document.getElementById("aboutDescription").value || content.aboutDesc;
      content.mission =
        document.getElementById("missionText").value || content.mission;
      content.vision =
        document.getElementById("visionText").value || content.vision;
      localStorage.setItem("ngdcscContent", JSON.stringify(content));
      saveAllToJSONBin().then(() => {
        loadFromJSONBin().then(() => {
          renderContent(content);
          alert("About content saved successfully!");
        });
      });
    });
  }

  if (saveFooterBtn) {
    saveFooterBtn.addEventListener("click", function () {
      const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
      content.footerEmail =
        document.getElementById("footerEmail").value || content.footerEmail;
      content.facebookLink =
        document.getElementById("facebookLink").value || content.facebookLink;
      content.instagramLink =
        document.getElementById("instagramLink").value || content.instagramLink;
      localStorage.setItem("ngdcscContent", JSON.stringify(content));
      saveAllToJSONBin().then(() => {
        loadFromJSONBin().then(() => {
          renderContent(content);
          alert("Footer content saved successfully!");
        });
      });
    });
  }
}

// Helper function to clear executive form
function clearExecutiveForm() {
  document.getElementById("execName").value = "";
  document.getElementById("execPosition").value = "";
  document.getElementById("execDepartment").value = "";
  document.getElementById("execHSCYear").value = "";
  document.getElementById("execEmail").value = "";
  document.getElementById("execPhone").value = "";
  currentPictureFile = null;
  picturePreviewUrl = null;
  const pictureInput = document.getElementById("execPicture");
  if (pictureInput) pictureInput.value = "";
  const picturePreview = document.getElementById("picturePreview");
  if (picturePreview)
    picturePreview.innerHTML =
      '<i class="fas fa-user-circle"></i><span>No picture selected</span>';
  const removePictureBtn = document.getElementById("removePictureBtn");
  if (removePictureBtn) removePictureBtn.style.display = "none";
}

// Add this at the end to ensure everything loads properly
window.addEventListener("load", function () {
  console.log("✅ Website loaded successfully");
  // Force a refresh of all data
  loadFromJSONBin();
});
