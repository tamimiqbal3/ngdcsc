// NGDC Science Club - Complete Script (CSP Compliant - No eval)
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // JSONBin.io Configuration
  const BIN_ID = "6981baaeae596e708f0d9703";
  const API_KEY = "$2a$10$FQHf7jp2QVg9gC6OiFqVd.oE7ALHezMi0xD0v7fr0KmhgwxWFepge";

  loadFromJSONBin();
  initializeWebsiteData();

  // Mobile menu
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle) {
    menuToggle.addEventListener("click", function () { 
      navLinks.classList.toggle("active"); 
    });
  }
  document.querySelectorAll(".nav-links a").forEach((item) => {
    item.addEventListener("click", function () { 
      navLinks.classList.remove("active"); 
    });
  });

  setupJoinButtons();
  setupSmoothScrolling();
  setupNavbarScroll();
  initializeAdminPanel();
  loadSavedData();
  setupFestButtons();
  setInterval(loadFromJSONBin, 5000);
});

// ============= JSONBin.io Functions =============
async function loadFromJSONBin() {
  const BIN_ID = "6981baaeae596e708f0d9703";
  const API_KEY = "$2a$10$FQHf7jp2QVg9gC6OiFqVd.oE7ALHezMi0xD0v7fr0KmhgwxWFepge";
  if (!BIN_ID || !API_KEY) { 
    console.log("JSONBin not configured"); 
    return; 
  }
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { 
      headers: { "X-Master-Key": API_KEY } 
    });
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    const websiteData = data.record;
    if (websiteData.executives) localStorage.setItem("ngdcscExecutives", JSON.stringify(websiteData.executives));
    if (websiteData.notices) localStorage.setItem("ngdcscNotices", JSON.stringify(websiteData.notices));
    if (websiteData.events) localStorage.setItem("ngdcscEvents", JSON.stringify(websiteData.events));
    if (websiteData.content) localStorage.setItem("ngdcscContent", JSON.stringify(websiteData.content));
    loadSavedData();
  } catch (error) { 
    console.log("Using localStorage data"); 
  }
}

async function saveAllToJSONBin() {
  const BIN_ID = "6981baaeae596e708f0d9703";
  const API_KEY = "$2a$10$FQHf7jp2QVg9gC6OiFqVd.oE7ALHezMi0xD0v7fr0KmhgwxWFepge";
  if (!BIN_ID || !API_KEY) return false;
  try {
    const allData = {
      executives: JSON.parse(localStorage.getItem("ngdcscExecutives") || "[]"),
      notices: JSON.parse(localStorage.getItem("ngdcscNotices") || "[]"),
      events: JSON.parse(localStorage.getItem("ngdcscEvents") || "[]"),
      content: JSON.parse(localStorage.getItem("ngdcscContent") || "{}"),
    };
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT", 
      headers: { 
        "Content-Type": "application/json", 
        "X-Master-Key": API_KEY, 
        "X-Bin-Versioning": "false" 
      },
      body: JSON.stringify(allData),
    });
    return response.ok;
  } catch (error) { 
    console.error("Error saving to JSONBin:", error); 
    return false; 
  }
}

// ============= Data Management =============
function initializeWebsiteData() {
  const defaultExecutives = [
    { name: "Sarah Ahmed", position: "President", department: "Physics Department", hscYear: "2024", email: "sarah.ahmed@ngdc.edu", phone: "+880 1712 345678" },
    { name: "Rahim Khan", position: "Vice President", department: "Chemistry Department", hscYear: "2024", email: "rahim.khan@ngdc.edu", phone: "+880 1713 456789" },
    { name: "Fatima Jahan", position: "General Secretary", department: "Biology Department", hscYear: "2024", email: "fatima.jahan@ngdc.edu", phone: "+880 1714 567890" },
    { name: "Arif Hossain", position: "Treasurer", department: "Mathematics Department", hscYear: "2024", email: "arif.hossain@ngdc.edu", phone: "+880 1715 678901" },
  ];
  const defaultNotices = [
    { title: "Annual Science Fair Registration", date: "November 30, 2024", content: "Registration for Annual Science Fair 2024 is now open.", type: "urgent" },
    { title: "Robotics Workshop", date: "December 5-6, 2024", content: "Two-day hands-on robotics workshop for beginners.", type: "normal" },
    { title: "Inter-College Science Quiz", date: "December 15, 2024", content: "Prepare for the annual inter-college science competition.", type: "normal" },
  ];
  const defaultEvents = [
    { id: 1, title: "Annual Science Fair 2024", date: "December 15, 2024", time: "10:00 AM - 4:00 PM", description: "Showcase of innovative science projects", location: "NGDC Auditorium", type: "exhibition" },
    { id: 2, title: "Physics Workshop", date: "December 10, 2024", time: "2:00 PM - 5:00 PM", description: "Hands-on workshop on modern physics", location: "Physics Lab", type: "workshop" },
  ];
  const defaultContent = {
    tagline: "Igniting Curiosity, Building Future 🔬",
    welcomeDesc: "Join Bangladesh's premier student science organization fostering innovation and discovery",
    aboutDesc: "NGDC Science Club (NGDCSC) is a premier student-led organization established in 2026.",
    mission: "To create a platform where theoretical knowledge meets practical application.",
    vision: "To develop the next generation of scientists and innovators.",
    joinLink: "https://forms.gle/AXKhPyQ4ZBwRqUSt5",
    festLink: "https://ngdcsc.fest.netlify.app",
    footerEmail: "ngdcscienceclub@ngdc.edu",
    facebookLink: "https://facebook.com/ngdcsc",
    instagramLink: "https://instagram.com/ngdc.sc",
  };
  if (!localStorage.getItem("ngdcscExecutives")) localStorage.setItem("ngdcscExecutives", JSON.stringify(defaultExecutives));
  if (!localStorage.getItem("ngdcscNotices")) localStorage.setItem("ngdcscNotices", JSON.stringify(defaultNotices));
  if (!localStorage.getItem("ngdcscEvents")) localStorage.setItem("ngdcscEvents", JSON.stringify(defaultEvents));
  if (!localStorage.getItem("ngdcscContent")) localStorage.setItem("ngdcscContent", JSON.stringify(defaultContent));
}

function loadSavedData() {
  renderExecutives(JSON.parse(localStorage.getItem("ngdcscExecutives") || "[]"));
  renderNotices(JSON.parse(localStorage.getItem("ngdcscNotices") || "[]"));
  renderEvents(JSON.parse(localStorage.getItem("ngdcscEvents") || "[]"));
  renderContent(JSON.parse(localStorage.getItem("ngdcscContent") || "{}"));
}

function renderExecutives(executives) {
  const container = document.getElementById("executiveContainer");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < executives.length; i++) {
    const exec = executives[i];
    const card = document.createElement("div");
    card.className = "executive-card fade-in-up";
    let pictureHtml = '<i class="fas fa-user-circle"></i>';
    if (exec.picture) pictureHtml = '<img src="' + exec.picture + '" alt="' + exec.name + '" loading="lazy">';
    card.innerHTML = 
      '<div class="executive-img-container"><div class="executive-img">' + pictureHtml + '</div></div>' +
      '<div class="executive-card-content">' +
        '<h3>' + escapeHtml(exec.name) + '</h3>' +
        '<p class="position">' + escapeHtml(exec.position) + '</p>' +
        '<p class="department">' + escapeHtml(exec.department) + '</p>' +
        '<p class="hsc-year">HSC Batch: ' + escapeHtml(exec.hscYear) + '</p>' +
        '<div class="contact-info">' +
          '<p><i class="fas fa-envelope"></i> <span>' + escapeHtml(exec.email) + '</span></p>' +
          '<p><i class="fas fa-phone"></i> <span>' + escapeHtml(exec.phone) + '</span></p>' +
        '</div>' +
      '</div>';
    container.appendChild(card);
  }
}

function renderNotices(notices) {
  const container = document.getElementById("noticeBoardContainer");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < notices.length; i++) {
    const notice = notices[i];
    const item = document.createElement("div");
    item.className = "notice-item " + notice.type;
    const iconClass = notice.type === "urgent" ? "fa-exclamation-circle" : "fa-bullhorn";
    item.innerHTML = 
      '<div class="notice-icon"><i class="fas ' + iconClass + '"></i></div>' +
      '<div class="notice-content">' +
        '<h4>' + escapeHtml(notice.title) + '</h4>' +
        '<p class="notice-date"><i class="far fa-calendar"></i> ' + escapeHtml(notice.date) + '</p>' +
        '<p>' + escapeHtml(notice.content) + '</p>' +
      '</div>';
    container.appendChild(item);
  }
}

function renderEvents(events) {
  const container = document.getElementById("eventContainer");
  if (!container) return;
  container.innerHTML = "";
  if (!events || events.length === 0) {
    container.innerHTML = '<div class="event-item"><div class="event-date"><i class="fas fa-calendar"></i><span>No events scheduled</span></div><div class="event-content"><h4>No Upcoming Events</h4><p>Check back soon.</p></div></div>';
    return;
  }
  const sortedEvents = [...events].sort(function(a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  const maxEvents = Math.min(sortedEvents.length, 3);
  for (let i = 0; i < maxEvents; i++) {
    const event = sortedEvents[i];
    const eventItem = document.createElement("div");
    eventItem.className = "event-item";
    let eventIcon = "fa-calendar";
    let eventColor = "#4CAF50";
    if (event.type) {
      switch (event.type.toLowerCase()) {
        case "workshop": eventIcon = "fa-flask"; eventColor = "#2196F3"; break;
        case "seminar": eventIcon = "fa-chalkboard-teacher"; eventColor = "#FF9800"; break;
        case "competition": eventIcon = "fa-trophy"; eventColor = "#9C27B0"; break;
        case "exhibition": eventIcon = "fa-images"; eventColor = "#E91E63"; break;
        default: eventIcon = "fa-calendar"; eventColor = "#4CAF50";
      }
    }
    let timeHtml = "";
    if (event.time) timeHtml = '<p><i class="fas fa-clock"></i> ' + escapeHtml(event.time) + '</p>';
    let locationHtml = "";
    if (event.location) locationHtml = '<p><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location) + '</p>';
    eventItem.innerHTML = 
      '<div class="event-date" style="border-left-color: ' + eventColor + '">' +
        '<i class="fas ' + eventIcon + '" style="color: ' + eventColor + '"></i>' +
        '<span>' + escapeHtml(event.date || "Date TBA") + '</span>' +
      '</div>' +
      '<div class="event-content">' +
        '<h4>' + escapeHtml(event.title || "Event Title") + '</h4>' +
        '<p>' + escapeHtml(event.description || "Event details coming soon.") + '</p>' +
        timeHtml +
        locationHtml +
        '<span class="event-tag" style="background: ' + eventColor + '20; color: ' + eventColor + '">' + escapeHtml(event.type || "Event") + '</span>' +
      '</div>';
    container.appendChild(eventItem);
  }
}

function renderContent(content) {
  if (content.tagline) document.getElementById("dynamicTagline").textContent = content.tagline;
  if (content.welcomeDesc) document.getElementById("dynamicWelcomeDesc").textContent = content.welcomeDesc;
  if (content.aboutDesc) document.getElementById("dynamicAboutDesc").textContent = content.aboutDesc;
  if (content.mission) document.getElementById("dynamicMission").textContent = content.mission;
  if (content.vision) document.getElementById("dynamicVision").textContent = content.vision;
  if (content.footerEmail) document.getElementById("footerEmailText").textContent = content.footerEmail;
  if (content.facebookLink) document.getElementById("footerFacebookLink").href = content.facebookLink;
  if (content.instagramLink) document.getElementById("footerInstagramLink").href = content.instagramLink;
  if (content.joinLink) {
    const joinBtns = document.querySelectorAll("#mainJoinBtn, #heroJoinBtn, #noticeJoinBtn, #footerJoinBtn");
    for (var i = 0; i < joinBtns.length; i++) {
      joinBtns[i].href = content.joinLink;
    }
  }
}

function setupJoinButtons() {
  const joinBtns = document.querySelectorAll("#mainJoinBtn, #heroJoinBtn, #noticeJoinBtn, #footerJoinBtn");
  for (var i = 0; i < joinBtns.length; i++) {
    var btn = joinBtns[i];
    btn.addEventListener("click", function(e) {
      const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
      if (content.joinLink && content.joinLink !== "https://forms.google.com/your-form-link") {
        window.open(content.joinLink, "_blank");
      } else {
        e.preventDefault();
        alert("Join Now link is not configured.");
      }
    });
  }
}

function setupSmoothScrolling() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchors.length; i++) {
    var anchor = anchors[i];
    anchor.addEventListener("click", function(e) {
      if (this.getAttribute("href") === "#") return;
      var targetId = this.getAttribute("href");
      if (targetId.startsWith("#") && targetId.length > 1) {
        e.preventDefault();
        var targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({ top: targetElement.offsetTop - 80, behavior: "smooth" });
        }
      }
    });
  }
}

function setupNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function() {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
    } else {
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    }
  });
}

// ============= Fest Functions =============
function setupFestButtons() {
  const DEFAULT_FEST_URL = "https://ngdcsc.fest.netlify.app";
  function getFestUrl() {
    const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
    return content.festLink || DEFAULT_FEST_URL;
  }
  function openFest(e) { 
    e.preventDefault(); 
    window.open(getFestUrl(), "_blank"); 
  }
  const festNavBtn = document.getElementById("festNavBtn");
  const festRegisterBtn = document.getElementById("festRegisterBtn");
  if (festNavBtn) festNavBtn.addEventListener("click", openFest);
  if (festRegisterBtn) festRegisterBtn.addEventListener("click", openFest);
}

// ============= Helper Functions =============
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============= Copy Link Functionality =============
window.copyToClipboard = function(type, index) {
  var fullUrl = window.location.origin + window.location.pathname + "#" + type + "-" + index;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(fullUrl).then(function() {
      showCopySuccessMessage();
    }).catch(function() {
      fallbackCopy(fullUrl);
    });
  } else {
    fallbackCopy(fullUrl);
  }
};

function fallbackCopy(text) {
  var textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  showCopySuccessMessage();
}

function showCopySuccessMessage() {
  var existing = document.getElementById("copySuccessMessage");
  if (existing) existing.remove();
  var msg = document.createElement("div");
  msg.id = "copySuccessMessage";
  msg.className = "copy-success-message";
  msg.innerHTML = '<i class="fas fa-check-circle"></i> Link copied to clipboard!';
  document.body.appendChild(msg);
  setTimeout(function() { 
    if (msg.parentNode) msg.remove(); 
  }, 2000);
}

window.addEventListener("load", function() {
  if (window.location.hash) {
    var hashParts = window.location.hash.substring(1).split("-");
    var type = hashParts[0];
    var index = hashParts[1];
    if (type === "notice" && index) {
      var el = document.querySelector('[data-notice-id="' + index + '"]');
      if (el) { 
        el.style.backgroundColor = "#fff3cd"; 
        el.scrollIntoView({ behavior: "smooth", block: "center" }); 
        setTimeout(function() { el.style.backgroundColor = ""; }, 3000);
      }
    } else if (type === "executive" && index) {
      var el = document.querySelector('[data-executive-id="' + index + '"]');
      if (el) { 
        el.style.backgroundColor = "#fff3cd"; 
        el.scrollIntoView({ behavior: "smooth", block: "center" }); 
        setTimeout(function() { el.style.backgroundColor = ""; }, 3000);
      }
    }
  }
});

// ============= Admin Panel =============
var currentPictureFile = null;
var picturePreviewUrl = null;

function initializeAdminPanel() {
  var adminLoginBtn = document.getElementById("adminLoginBtn");
  var modal = document.getElementById("adminLoginModal");
  var closeModal = document.querySelector(".close-modal");
  var adminLoginForm = document.getElementById("adminLoginForm");
  var logoutBtn = document.getElementById("logoutBtn");
  var adminPanel = document.getElementById("adminPanel");
  var ADMIN_USERNAME = "ngdcsc";
  var ADMIN_PASSWORD = "ngdc@sc@2026#";

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", function() { 
      modal.style.display = "block"; 
    });
  }
  if (closeModal) {
    closeModal.addEventListener("click", function() { 
      modal.style.display = "none"; 
    });
  }
  window.addEventListener("click", function(e) { 
    if (e.target === modal) modal.style.display = "none"; 
  });

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      var username = document.getElementById("adminUsername").value;
      var password = document.getElementById("adminPassword").value;
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        modal.style.display = "none";
        adminPanel.style.display = "block";
        document.body.style.overflow = "hidden";
        loadAdminData();
        adminLoginForm.reset();
      } else {
        alert("Invalid username or password!");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() { 
      adminPanel.style.display = "none"; 
      document.body.style.overflow = "auto"; 
    });
  }

  var tabBtns = document.querySelectorAll(".tab-btn");
  for (var i = 0; i < tabBtns.length; i++) {
    var btn = tabBtns[i];
    btn.addEventListener("click", function() {
      var tabId = this.getAttribute("data-tab");
      var allBtns = document.querySelectorAll(".tab-btn");
      for (var j = 0; j < allBtns.length; j++) {
        allBtns[j].classList.remove("active");
      }
      this.classList.add("active");
      var allContents = document.querySelectorAll(".tab-content");
      for (var k = 0; k < allContents.length; k++) {
        allContents[k].classList.remove("active");
      }
      document.getElementById(tabId + "-tab").classList.add("active");
    });
  }

  setupAdminNotices();
  setupAdminExecutives();
  setupAdminEvents();
  setupAdminContent();
}

function loadAdminData() {
  var self = this;
  loadFromJSONBin().then(function() {
    // Notices
    var notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
    var noticeList = document.getElementById("noticeList");
    if (noticeList) {
      noticeList.innerHTML = "";
      for (var i = 0; i < notices.length; i++) {
        var notice = notices[i];
        var item = document.createElement("div");
        item.className = "notice-item-admin";
        item.setAttribute("data-notice-id", i);
        var shortContent = notice.content.substring(0, 100);
        if (notice.content.length > 100) shortContent += "...";
        item.innerHTML = 
          '<div class="notice-content-admin">' +
            '<h5>' + escapeHtml(notice.title) + '</h5>' +
            '<p><strong>Date:</strong> ' + escapeHtml(notice.date) + '</p>' +
            '<p><strong>Type:</strong> ' + escapeHtml(notice.type) + '</p>' +
            '<p>' + escapeHtml(shortContent) + '</p>' +
          '</div>' +
          '<div class="action-buttons">' +
            '<button class="copy-link-btn" onclick="copyToClipboard(\'notice\', ' + i + ')"><i class="fas fa-link"></i> Copy Link</button>' +
            '<button class="delete-btn" onclick="deleteNotice(' + i + ')">Delete</button>' +
          '</div>';
        noticeList.appendChild(item);
      }
    }

    // Executives
    var executives = JSON.parse(localStorage.getItem("ngdcscExecutives") || "[]");
    var executiveList = document.getElementById("executiveList");
    if (executiveList) {
      executiveList.innerHTML = "";
      for (var j = 0; j < executives.length; j++) {
        var exec = executives[j];
        var picHtml = '<i class="fas fa-user-circle"></i>';
        if (exec.picture) picHtml = '<img src="' + exec.picture + '" alt="' + exec.name + '" style="width:50px;height:50px;border-radius:50%;object-fit:cover;">';
        var item = document.createElement("div");
        item.className = "executive-item-admin";
        item.setAttribute("data-executive-id", j);
        item.innerHTML = 
          '<div class="executive-preview-admin">' + picHtml + '</div>' +
          '<div class="executive-content-admin">' +
            '<h5>' + escapeHtml(exec.name) + '</h5>' +
            '<p><strong>Position:</strong> ' + escapeHtml(exec.position) + '</p>' +
            '<p><strong>Department:</strong> ' + escapeHtml(exec.department) + '</p>' +
            '<p><strong>HSC Year:</strong> ' + escapeHtml(exec.hscYear) + '</p>' +
            '<p><strong>Email:</strong> ' + escapeHtml(exec.email) + '</p>' +
            '<p><strong>Phone:</strong> ' + escapeHtml(exec.phone) + '</p>' +
          '</div>' +
          '<div class="executive-actions">' +
            '<button class="copy-link-btn" onclick="copyToClipboard(\'executive\', ' + j + ')"><i class="fas fa-link"></i> Copy Link</button>' +
            '<button class="delete-btn" onclick="deleteExecutive(' + j + ')">Delete</button>' +
          '</div>';
        executiveList.appendChild(item);
      }
    }

    // Events
    var events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
    var eventList = document.getElementById("eventList");
    if (eventList) {
      eventList.innerHTML = "";
      for (var k = 0; k < events.length; k++) {
        var event = events[k];
        var item = document.createElement("div");
        item.className = "admin-item";
        var timeHtml = "";
        if (event.time) timeHtml = ' | ' + escapeHtml(event.time);
        var locationHtml = "";
        if (event.location) locationHtml = '<p><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location) + '</p>';
        item.innerHTML = 
          '<div class="item-content">' +
            '<h5>' + escapeHtml(event.title) + '</h5>' +
            '<p><i class="fas fa-calendar"></i> ' + escapeHtml(event.date) + timeHtml + '</p>' +
            '<p>' + escapeHtml(event.description) + '</p>' +
            locationHtml +
            '<span class="item-tag">' + escapeHtml(event.type) + '</span>' +
          '</div>' +
          '<div class="item-actions">' +
            '<button class="edit-btn" onclick="editEvent(' + k + ')"><i class="fas fa-edit"></i></button>' +
            '<button class="delete-btn" onclick="deleteEvent(' + k + ')"><i class="fas fa-trash"></i></button>' +
          '</div>';
        eventList.appendChild(item);
      }
    }

    // Content
    var content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
    if (document.getElementById("clubTagline")) document.getElementById("clubTagline").value = content.tagline || "";
    if (document.getElementById("welcomeText")) document.getElementById("welcomeText").value = content.welcomeDesc || "";
    if (document.getElementById("joinLink")) document.getElementById("joinLink").value = content.joinLink || "";
    if (document.getElementById("festLink")) document.getElementById("festLink").value = content.festLink || "https://ngdcsc.fest.netlify.app";
    if (document.getElementById("aboutDescription")) document.getElementById("aboutDescription").value = content.aboutDesc || "";
    if (document.getElementById("missionText")) document.getElementById("missionText").value = content.mission || "";
    if (document.getElementById("visionText")) document.getElementById("visionText").value = content.vision || "";
    if (document.getElementById("footerEmail")) document.getElementById("footerEmail").value = content.footerEmail || "";
    if (document.getElementById("facebookLink")) document.getElementById("facebookLink").value = content.facebookLink || "";
    if (document.getElementById("instagramLink")) document.getElementById("instagramLink").value = content.instagramLink || "";
  });
}

window.deleteNotice = function(index) {
  if (!confirm("Delete this notice?")) return;
  var notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
  notices.splice(index, 1);
  localStorage.setItem("ngdcscNotices", JSON.stringify(notices));
  saveAllToJSONBin().then(function() { 
    loadFromJSONBin().then(function() { 
      loadAdminData(); 
      renderNotices(notices); 
      alert("Deleted!"); 
    }); 
  });
};

window.deleteExecutive = function(index) {
  if (!confirm("Delete this executive?")) return;
  var executives = JSON.parse(localStorage.getItem("ngdcscExecutives") || "[]");
  executives.splice(index, 1);
  localStorage.setItem("ngdcscExecutives", JSON.stringify(executives));
  saveAllToJSONBin().then(function() { 
    loadFromJSONBin().then(function() { 
      loadAdminData(); 
      renderExecutives(executives); 
      alert("Deleted!"); 
    }); 
  });
};

window.deleteEvent = function(index) {
  if (!confirm("Delete this event?")) return;
  var events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
  events.splice(index, 1);
  localStorage.setItem("ngdcscEvents", JSON.stringify(events));
  saveAllToJSONBin().then(function() { 
    loadFromJSONBin().then(function() { 
      loadAdminData(); 
      renderEvents(events); 
      alert("Deleted!"); 
    }); 
  });
};

window.editEvent = function(index) {
  var events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
  var event = events[index];
  if (!event) return;
  document.getElementById("eventTitle").value = event.title;
  document.getElementById("eventDate").value = event.date;
  document.getElementById("eventTime").value = event.time || "";
  document.getElementById("eventDescription").value = event.description;
  document.getElementById("eventLocation").value = event.location || "";
  document.getElementById("eventType").value = event.type;
  var addBtn = document.getElementById("addEventBtn");
  var originalText = addBtn.innerHTML;
  addBtn.innerHTML = '<i class="fas fa-save"></i> Update Event';
  var originalClick = addBtn.onclick;
  addBtn.onclick = function(e) {
    e.preventDefault();
    event.title = document.getElementById("eventTitle").value.trim();
    event.date = document.getElementById("eventDate").value.trim();
    event.time = document.getElementById("eventTime").value.trim();
    event.description = document.getElementById("eventDescription").value.trim();
    event.location = document.getElementById("eventLocation").value.trim();
    event.type = document.getElementById("eventType").value;
    localStorage.setItem("ngdcscEvents", JSON.stringify(events));
    saveAllToJSONBin().then(function() {
      loadFromJSONBin().then(function() {
        loadAdminData();
        renderEvents(events);
        document.getElementById("eventTitle").value = "";
        document.getElementById("eventDate").value = "";
        document.getElementById("eventTime").value = "";
        document.getElementById("eventDescription").value = "";
        document.getElementById("eventLocation").value = "";
        addBtn.innerHTML = originalText;
        addBtn.onclick = originalClick;
        alert("Event updated!");
      });
    });
  };
  var eventsTabBtn = document.querySelector('[data-tab="events"]');
  if (eventsTabBtn) eventsTabBtn.click();
};

function setupAdminNotices() {
  var addBtn = document.getElementById("addNoticeBtn");
  if (addBtn) {
    addBtn.addEventListener("click", function() {
      var title = document.getElementById("noticeTitle").value;
      var date = document.getElementById("noticeDate").value;
      var content = document.getElementById("noticeContent").value;
      var type = document.getElementById("noticeType").value;
      if (!title || !date || !content) { 
        alert("Fill all fields!"); 
        return; 
      }
      var notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
      notices.push({ title: title, date: date, content: content, type: type });
      localStorage.setItem("ngdcscNotices", JSON.stringify(notices));
      saveAllToJSONBin().then(function() {
        loadFromJSONBin().then(function() {
          loadAdminData(); 
          renderNotices(notices);
          document.getElementById("noticeTitle").value = "";
          document.getElementById("noticeDate").value = "";
          document.getElementById("noticeContent").value = "";
          alert("Notice added!");
        });
      });
    });
  }
}

function setupAdminExecutives() {
  var addBtn = document.getElementById("addExecutiveBtn");
  var choosePic = document.getElementById("choosePictureBtn");
  var removePic = document.getElementById("removePictureBtn");
  var picInput = document.getElementById("execPicture");
  var preview = document.getElementById("picturePreview");
  var clearBtn = document.getElementById("clearExecutiveForm");

  if (choosePic) {
    choosePic.addEventListener("click", function() { 
      if (picInput) picInput.click(); 
    });
  }
  if (picInput) {
    picInput.addEventListener("change", function(e) {
      var file = e.target.files[0];
      if (file) {
        var validTypes = ["image/jpeg","image/jpg","image/png","image/gif","image/webp"];
        var isValid = false;
        for (var i = 0; i < validTypes.length; i++) {
          if (file.type === validTypes[i]) isValid = true;
        }
        if (!isValid) { 
          alert("Invalid format!"); 
          return; 
        }
        if (file.size > 6*1024*1024) { 
          alert("Max 6MB!"); 
          return; 
        }
        currentPictureFile = file;
        var reader = new FileReader();
        reader.onload = function(e) {
          picturePreviewUrl = e.target.result;
          if (preview) preview.innerHTML = '<img src="' + picturePreviewUrl + '" alt="Preview" style="width:150px;height:150px;border-radius:50%;object-fit:cover;">';
          if (removePic) removePic.style.display = "inline-flex";
        };
        reader.readAsDataURL(file);
      }
    });
  }
  if (removePic) {
    removePic.addEventListener("click", function() {
      currentPictureFile = null;
      picturePreviewUrl = null;
      if (picInput) picInput.value = "";
      if (preview) preview.innerHTML = '<i class="fas fa-user-circle"></i><span>No picture selected</span>';
      if (removePic) removePic.style.display = "none";
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function() {
      document.getElementById("execName").value = "";
      document.getElementById("execPosition").value = "";
      document.getElementById("execDepartment").value = "";
      document.getElementById("execHSCYear").value = "";
      document.getElementById("execEmail").value = "";
      document.getElementById("execPhone").value = "";
      currentPictureFile = null;
      picturePreviewUrl = null;
      if (picInput) picInput.value = "";
      if (preview) preview.innerHTML = '<i class="fas fa-user-circle"></i><span>No picture selected</span>';
      if (removePic) removePic.style.display = "none";
    });
  }
  if (addBtn) {
    addBtn.addEventListener("click", function() {
      var name = document.getElementById("execName").value;
      var position = document.getElementById("execPosition").value;
      var department = document.getElementById("execDepartment").value;
      var hscYear = document.getElementById("execHSCYear").value;
      var email = document.getElementById("execEmail").value;
      var phone = document.getElementById("execPhone").value;
      if (!name || !position || !department || !hscYear || !email || !phone) { 
        alert("Fill all fields!"); 
        return; 
      }
      var executives = JSON.parse(localStorage.getItem("ngdcscExecutives") || "[]");
      var newExec = { 
        name: name, 
        position: position, 
        department: department, 
        hscYear: hscYear, 
        email: email, 
        phone: phone, 
        picture: picturePreviewUrl || null 
      };
      executives.push(newExec);
      localStorage.setItem("ngdcscExecutives", JSON.stringify(executives));
      saveAllToJSONBin().then(function() {
        loadFromJSONBin().then(function() {
          loadAdminData(); 
          renderExecutives(executives);
          if (clearBtn) clearBtn.click();
          alert("Executive added!");
        });
      });
    });
  }
}

function setupAdminEvents() {
  var addBtn = document.getElementById("addEventBtn");
  var clearBtn = document.getElementById("clearEventForm");
  if (addBtn) {
    addBtn.addEventListener("click", function(e) {
      e.preventDefault();
      var title = document.getElementById("eventTitle").value.trim();
      var date = document.getElementById("eventDate").value.trim();
      var time = document.getElementById("eventTime").value.trim();
      var description = document.getElementById("eventDescription").value.trim();
      var location = document.getElementById("eventLocation").value.trim();
      var type = document.getElementById("eventType").value;
      if (!title || !date || !description) { 
        alert("Fill required fields!"); 
        return; 
      }
      var events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
      var newId = 1;
      if (events.length > 0) {
        var maxId = 0;
        for (var i = 0; i < events.length; i++) {
          if (events[i].id > maxId) maxId = events[i].id;
        }
        newId = maxId + 1;
      }
      events.push({ id: newId, title: title, date: date, time: time, description: description, location: location, type: type });
      localStorage.setItem("ngdcscEvents", JSON.stringify(events));
      saveAllToJSONBin().then(function() {
        loadFromJSONBin().then(function() {
          loadAdminData(); 
          renderEvents(events);
          if (clearBtn) clearBtn.click();
          alert("Event added!");
        });
      });
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener("click", function() {
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
  var saveHome = document.getElementById("saveHomeBtn");
  var saveAbout = document.getElementById("saveAboutBtn");
  var saveFooter = document.getElementById("saveFooterBtn");

  if (saveHome) {
    saveHome.addEventListener("click", function() {
      var content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
      content.tagline = document.getElementById("clubTagline").value || content.tagline;
      content.welcomeDesc = document.getElementById("welcomeText").value || content.welcomeDesc;
      content.joinLink = document.getElementById("joinLink").value || content.joinLink;
      content.festLink = document.getElementById("festLink").value || content.festLink;
      localStorage.setItem("ngdcscContent", JSON.stringify(content));
      saveAllToJSONBin().then(function() { 
        loadFromJSONBin().then(function() { 
          renderContent(content); 
          alert("Saved!"); 
        }); 
      });
    });
  }

  if (saveAbout) {
    saveAbout.addEventListener("click", function() {
      var content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
      content.aboutDesc = document.getElementById("aboutDescription").value || content.aboutDesc;
      content.mission = document.getElementById("missionText").value || content.mission;
      content.vision = document.getElementById("visionText").value || content.vision;
      localStorage.setItem("ngdcscContent", JSON.stringify(content));
      saveAllToJSONBin().then(function() { 
        loadFromJSONBin().then(function() { 
          renderContent(content); 
          alert("Saved!"); 
        }); 
      });
    });
  }

  if (saveFooter) {
    saveFooter.addEventListener("click", function() {
      var content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
      content.footerEmail = document.getElementById("footerEmail").value || content.footerEmail;
      content.facebookLink = document.getElementById("facebookLink").value || content.facebookLink;
      content.instagramLink = document.getElementById("instagramLink").value || content.instagramLink;
      localStorage.setItem("ngdcscContent", JSON.stringify(content));
      saveAllToJSONBin().then(function() { 
        loadFromJSONBin().then(function() { 
          renderContent(content); 
          alert("Saved!"); 
        }); 
      });
    });
  }
}
