// NGDC Science Club - Complete Script
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
    menuToggle.addEventListener("click", function () { navLinks.classList.toggle("active"); });
  }
  document.querySelectorAll(".nav-links a").forEach((item) => {
    item.addEventListener("click", function () { navLinks.classList.remove("active"); });
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
  if (!BIN_ID || !API_KEY) { console.log("JSONBin not configured"); return; }
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers: { "X-Master-Key": API_KEY } });
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    const websiteData = data.record;
    if (websiteData.executives) localStorage.setItem("ngdcscExecutives", JSON.stringify(websiteData.executives));
    if (websiteData.notices) localStorage.setItem("ngdcscNotices", JSON.stringify(websiteData.notices));
    if (websiteData.events) localStorage.setItem("ngdcscEvents", JSON.stringify(websiteData.events));
    if (websiteData.content) localStorage.setItem("ngdcscContent", JSON.stringify(websiteData.content));
    loadSavedData();
  } catch (error) { console.log("Using localStorage data"); }
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
      method: "PUT", headers: { "Content-Type": "application/json", "X-Master-Key": API_KEY, "X-Bin-Versioning": "false" },
      body: JSON.stringify(allData),
    });
    return response.ok;
  } catch (error) { console.error("Error saving to JSONBin:", error); return false; }
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
  executives.forEach((exec) => {
    const card = document.createElement("div");
    card.className = "executive-card fade-in-up";
    let pictureHtml = '<i class="fas fa-user-circle"></i>';
    if (exec.picture) pictureHtml = `<img src="${exec.picture}" alt="${exec.name}" loading="lazy">`;
    card.innerHTML = `
      <div class="executive-img-container"><div class="executive-img">${pictureHtml}</div></div>
      <div class="executive-card-content">
        <h3>${exec.name}</h3><p class="position">${exec.position}</p><p class="department">${exec.department}</p>
        <p class="hsc-year">HSC Batch: ${exec.hscYear}</p>
        <div class="contact-info"><p><i class="fas fa-envelope"></i> <span>${exec.email}</span></p><p><i class="fas fa-phone"></i> <span>${exec.phone}</span></p></div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderNotices(notices) {
  const container = document.getElementById("noticeBoardContainer");
  if (!container) return;
  container.innerHTML = "";
  notices.forEach((notice) => {
    const item = document.createElement("div");
    item.className = `notice-item ${notice.type}`;
    item.innerHTML = `<div class="notice-icon"><i class="fas ${notice.type === "urgent" ? "fa-exclamation-circle" : "fa-bullhorn"}"></i></div>
      <div class="notice-content"><h4>${notice.title}</h4><p class="notice-date"><i class="far fa-calendar"></i> ${notice.date}</p><p>${notice.content}</p></div>`;
    container.appendChild(item);
  });
}

function renderEvents(events) {
  const container = document.getElementById("eventContainer");
  if (!container) return;
  container.innerHTML = "";
  if (!events || events.length === 0) {
    container.innerHTML = `<div class="event-item"><div class="event-date"><i class="fas fa-calendar"></i><span>No events scheduled</span></div><div class="event-content"><h4>No Upcoming Events</h4><p>Check back soon.</p></div></div>`;
    return;
  }
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  sortedEvents.slice(0, 3).forEach((event) => {
    const eventItem = document.createElement("div");
    eventItem.className = "event-item";
    let eventIcon = "fa-calendar", eventColor = "#4CAF50";
    if (event.type) {
      switch (event.type.toLowerCase()) {
        case "workshop": eventIcon = "fa-flask"; eventColor = "#2196F3"; break;
        case "seminar": eventIcon = "fa-chalkboard-teacher"; eventColor = "#FF9800"; break;
        case "competition": eventIcon = "fa-trophy"; eventColor = "#9C27B0"; break;
        case "exhibition": eventIcon = "fa-images"; eventColor = "#E91E63"; break;
        default: eventIcon = "fa-calendar"; eventColor = "#4CAF50";
      }
    }
    eventItem.innerHTML = `
      <div class="event-date" style="border-left-color: ${eventColor}"><i class="fas ${eventIcon}" style="color: ${eventColor}"></i><span>${event.date || "Date TBA"}</span></div>
      <div class="event-content"><h4>${event.title || "Event Title"}</h4><p>${event.description || "Event details coming soon."}</p>
      ${event.time ? `<p><i class="fas fa-clock"></i> ${event.time}</p>` : ""}
      ${event.location ? `<p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>` : ""}
      <span class="event-tag" style="background: ${eventColor}20; color: ${eventColor}">${event.type || "Event"}</span></div>`;
    container.appendChild(eventItem);
  });
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
    document.querySelectorAll("#mainJoinBtn, #heroJoinBtn, #noticeJoinBtn, #footerJoinBtn").forEach(btn => btn.href = content.joinLink);
  }
}

function setupJoinButtons() {
  document.querySelectorAll("#mainJoinBtn, #heroJoinBtn, #noticeJoinBtn, #footerJoinBtn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
      if (content.joinLink && content.joinLink !== "https://forms.google.com/your-form-link") window.open(content.joinLink, "_blank");
      else { e.preventDefault(); alert("Join Now link is not configured."); }
    });
  });
}

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href") === "#") return;
      const targetId = this.getAttribute("href");
      if (targetId.startsWith("#") && targetId.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) window.scrollTo({ top: targetElement.offsetTop - 80, behavior: "smooth" });
      }
    });
  });
}

function setupNavbarScroll() {
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", function () {
    navbar.style.boxShadow = window.scrollY > 50 ? "0 5px 15px rgba(0, 0, 0, 0.1)" : "0 2px 10px rgba(0, 0, 0, 0.1)";
  });
}

// ============= Fest Functions =============
function setupFestButtons() {
  const DEFAULT_FEST_URL = "https://ngdcsc.fest.netlify.app";
  function getFestUrl() {
    const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
    return content.festLink || DEFAULT_FEST_URL;
  }
  function openFest(e) { e.preventDefault(); window.open(getFestUrl(), "_blank"); }
  const festNavBtn = document.getElementById("festNavBtn");
  const festRegisterBtn = document.getElementById("festRegisterBtn");
  if (festNavBtn) festNavBtn.addEventListener("click", openFest);
  if (festRegisterBtn) festRegisterBtn.addEventListener("click", openFest);
}

// ============= Copy Link Functionality =============
window.copyToClipboard = function (type, index) {
  const fullUrl = window.location.origin + window.location.pathname + "#" + type + "-" + index;
  navigator.clipboard.writeText(fullUrl).then(() => showCopySuccessMessage()).catch(() => {
    const textarea = document.createElement("textarea");
    textarea.value = fullUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showCopySuccessMessage();
  });
};

function showCopySuccessMessage() {
  const existing = document.getElementById("copySuccessMessage");
  if (existing) existing.remove();
  const msg = document.createElement("div");
  msg.id = "copySuccessMessage";
  msg.className = "copy-success-message";
  msg.innerHTML = '<i class="fas fa-check-circle"></i> Link copied to clipboard!';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2000);
}

window.addEventListener("load", function () {
  if (window.location.hash) {
    const [type, index] = window.location.hash.substring(1).split("-");
    if (type === "notice" && index) {
      const el = document.querySelector(`[data-notice-id="${index}"]`);
      if (el) { el.style.backgroundColor = "#fff3cd"; el.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => el.style.backgroundColor = "", 3000); }
    } else if (type === "executive" && index) {
      const el = document.querySelector(`[data-executive-id="${index}"]`);
      if (el) { el.style.backgroundColor = "#fff3cd"; el.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => el.style.backgroundColor = "", 3000); }
    }
  }
});

// ============= Admin Panel =============
let currentPictureFile = null, picturePreviewUrl = null;

function initializeAdminPanel() {
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const modal = document.getElementById("adminLoginModal");
  const closeModal = document.querySelector(".close-modal");
  const adminLoginForm = document.getElementById("adminLoginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminPanel = document.getElementById("adminPanel");
  const ADMIN_USERNAME = "ngdcsc", ADMIN_PASSWORD = "ngdc@sc@2026#";

  adminLoginBtn.addEventListener("click", () => modal.style.display = "block");
  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  adminLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.getElementById("adminUsername").value === ADMIN_USERNAME && document.getElementById("adminPassword").value === ADMIN_PASSWORD) {
      modal.style.display = "none";
      adminPanel.style.display = "block";
      document.body.style.overflow = "hidden";
      loadAdminData();
      adminLoginForm.reset();
    } else alert("Invalid username or password!");
  });

  logoutBtn.addEventListener("click", () => { adminPanel.style.display = "none"; document.body.style.overflow = "auto"; });

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });

  setupAdminNotices();
  setupAdminExecutives();
  setupAdminEvents();
  setupAdminContent();
}

function loadAdminData() {
  loadFromJSONBin().then(() => {
    // Notices
    const notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
    const noticeList = document.getElementById("noticeList");
    if (noticeList) {
      noticeList.innerHTML = "";
      notices.forEach((notice, index) => {
        const item = document.createElement("div");
        item.className = "notice-item-admin";
        item.setAttribute("data-notice-id", index);
        item.innerHTML = `<div class="notice-content-admin"><h5>${notice.title}</h5><p><strong>Date:</strong> ${notice.date}</p><p><strong>Type:</strong> ${notice.type}</p><p>${notice.content.substring(0, 100)}...</p></div>
          <div class="action-buttons"><button class="copy-link-btn" onclick="copyToClipboard('notice', ${index})"><i class="fas fa-link"></i> Copy Link</button><button class="delete-btn" onclick="deleteNotice(${index})">Delete</button></div>`;
        noticeList.appendChild(item);
      });
    }

    // Executives
    const executives = JSON.parse(localStorage.getItem("ngdcscExecutives") || "[]");
    const executiveList = document.getElementById("executiveList");
    if (executiveList) {
      executiveList.innerHTML = "";
      executives.forEach((exec, index) => {
        let picHtml = '<i class="fas fa-user-circle"></i>';
        if (exec.picture) picHtml = `<img src="${exec.picture}" alt="${exec.name}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;">`;
        const item = document.createElement("div");
        item.className = "executive-item-admin";
        item.setAttribute("data-executive-id", index);
        item.innerHTML = `<div class="executive-preview-admin">${picHtml}</div><div class="executive-content-admin"><h5>${exec.name}</h5><p><strong>Position:</strong> ${exec.position}</p><p><strong>Department:</strong> ${exec.department}</p><p><strong>HSC Year:</strong> ${exec.hscYear}</p><p><strong>Email:</strong> ${exec.email}</p><p><strong>Phone:</strong> ${exec.phone}</p></div>
          <div class="executive-actions"><button class="copy-link-btn" onclick="copyToClipboard('executive', ${index})"><i class="fas fa-link"></i> Copy Link</button><button class="delete-btn" onclick="deleteExecutive(${index})">Delete</button></div>`;
        executiveList.appendChild(item);
      });
    }

    // Events
    const events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
    const eventList = document.getElementById("eventList");
    if (eventList) {
      eventList.innerHTML = "";
      events.forEach((event, index) => {
        const item = document.createElement("div");
        item.className = "admin-item";
        item.innerHTML = `<div class="item-content"><h5>${event.title}</h5><p><i class="fas fa-calendar"></i> ${event.date} ${event.time ? `| ${event.time}` : ""}</p><p>${event.description}</p>${event.location ? `<p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>` : ""}<span class="item-tag">${event.type}</span></div>
          <div class="item-actions"><button class="edit-btn" onclick="editEvent(${index})"><i class="fas fa-edit"></i></button><button class="delete-btn" onclick="deleteEvent(${index})"><i class="fas fa-trash"></i></button></div>`;
        eventList.appendChild(item);
      });
    }

    // Content
    const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
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

window.deleteNotice = function (index) {
  if (!confirm("Delete this notice?")) return;
  const notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
  notices.splice(index, 1);
  localStorage.setItem("ngdcscNotices", JSON.stringify(notices));
  saveAllToJSONBin().then(() => { loadFromJSONBin().then(() => { loadAdminData(); renderNotices(notices); alert("Deleted!"); }); });
};

window.deleteExecutive = function (index) {
  if (!confirm("Delete this executive?")) return;
  const executives = JSON.parse(localStorage.getItem("ngdcscExecutives") || "[]");
  executives.splice(index, 1);
  localStorage.setItem("ngdcscExecutives", JSON.stringify(executives));
  saveAllToJSONBin().then(() => { loadFromJSONBin().then(() => { loadAdminData(); renderExecutives(executives); alert("Deleted!"); }); });
};

window.deleteEvent = function (index) {
  if (!confirm("Delete this event?")) return;
  const events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
  events.splice(index, 1);
  localStorage.setItem("ngdcscEvents", JSON.stringify(events));
  saveAllToJSONBin().then(() => { loadFromJSONBin().then(() => { loadAdminData(); renderEvents(events); alert("Deleted!"); }); });
};

window.editEvent = function (index) {
  const events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
  const event = events[index];
  if (!event) return;
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
    event.description = document.getElementById("eventDescription").value.trim();
    event.location = document.getElementById("eventLocation").value.trim();
    event.type = document.getElementById("eventType").value;
    localStorage.setItem("ngdcscEvents", JSON.stringify(events));
    saveAllToJSONBin().then(() => {
      loadFromJSONBin().then(() => {
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
  document.querySelector('[data-tab="events"]').click();
};

function setupAdminNotices() {
  document.getElementById("addNoticeBtn")?.addEventListener("click", function () {
    const title = document.getElementById("noticeTitle").value;
    const date = document.getElementById("noticeDate").value;
    const content = document.getElementById("noticeContent").value;
    const type = document.getElementById("noticeType").value;
    if (!title || !date || !content) { alert("Fill all fields!"); return; }
    const notices = JSON.parse(localStorage.getItem("ngdcscNotices") || "[]");
    notices.push({ title, date, content, type });
    localStorage.setItem("ngdcscNotices", JSON.stringify(notices));
    saveAllToJSONBin().then(() => {
      loadFromJSONBin().then(() => {
        loadAdminData(); renderNotices(notices);
        document.getElementById("noticeTitle").value = "";
        document.getElementById("noticeDate").value = "";
        document.getElementById("noticeContent").value = "";
        alert("Notice added!");
      });
    });
  });
}

function setupAdminExecutives() {
  const addBtn = document.getElementById("addExecutiveBtn");
  const choosePic = document.getElementById("choosePictureBtn");
  const removePic = document.getElementById("removePictureBtn");
  const picInput = document.getElementById("execPicture");
  const preview = document.getElementById("picturePreview");
  const clearBtn = document.getElementById("clearExecutiveForm");

  choosePic?.addEventListener("click", () => picInput.click());
  picInput?.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg","image/jpg","image/png","image/gif","image/webp"].includes(file.type)) { alert("Invalid format!"); return; }
      if (file.size > 6*1024*1024) { alert("Max 6MB!"); return; }
      currentPictureFile = file;
      const reader = new FileReader();
      reader.onload = function (e) {
        picturePreviewUrl = e.target.result;
        preview.innerHTML = `<img src="${picturePreviewUrl}" alt="Preview" style="width:150px;height:150px;border-radius:50%;object-fit:cover;">`;
        removePic.style.display = "inline-flex";
      };
      reader.readAsDataURL(file);
    }
  });
  removePic?.addEventListener("click", function () {
    currentPictureFile = null; picturePreviewUrl = null;
    if (picInput) picInput.value = "";
    preview.innerHTML = '<i class="fas fa-user-circle"></i><span>No picture selected</span>';
    removePic.style.display = "none";
  });
  clearBtn?.addEventListener("click", function () {
    document.getElementById("execName").value = "";
    document.getElementById("execPosition").value = "";
    document.getElementById("execDepartment").value = "";
    document.getElementById("execHSCYear").value = "";
    document.getElementById("execEmail").value = "";
    document.getElementById("execPhone").value = "";
    currentPictureFile = null; picturePreviewUrl = null;
    if (picInput) picInput.value = "";
    preview.innerHTML = '<i class="fas fa-user-circle"></i><span>No picture selected</span>';
    if (removePic) removePic.style.display = "none";
  });
  addBtn?.addEventListener("click", function () {
    const name = document.getElementById("execName").value;
    const position = document.getElementById("execPosition").value;
    const department = document.getElementById("execDepartment").value;
    const hscYear = document.getElementById("execHSCYear").value;
    const email = document.getElementById("execEmail").value;
    const phone = document.getElementById("execPhone").value;
    if (!name || !position || !department || !hscYear || !email || !phone) { alert("Fill all fields!"); return; }
    const executives = JSON.parse(localStorage.getItem("ngdcscExecutives") || "[]");
    const newExec = { name, position, department, hscYear, email, phone, picture: picturePreviewUrl || null };
    executives.push(newExec);
    localStorage.setItem("ngdcscExecutives", JSON.stringify(executives));
    saveAllToJSONBin().then(() => {
      loadFromJSONBin().then(() => {
        loadAdminData(); renderExecutives(executives);
        clearBtn.click();
        alert("Executive added!");
      });
    });
  });
}

function setupAdminEvents() {
  const addBtn = document.getElementById("addEventBtn");
  const clearBtn = document.getElementById("clearEventForm");
  addBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    const title = document.getElementById("eventTitle").value.trim();
    const date = document.getElementById("eventDate").value.trim();
    const time = document.getElementById("eventTime").value.trim();
    const description = document.getElementById("eventDescription").value.trim();
    const location = document.getElementById("eventLocation").value.trim();
    const type = document.getElementById("eventType").value;
    if (!title || !date || !description) { alert("Fill required fields!"); return; }
    const events = JSON.parse(localStorage.getItem("ngdcscEvents") || "[]");
    const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
    events.push({ id: newId, title, date, time, description, location, type });
    localStorage.setItem("ngdcscEvents", JSON.stringify(events));
    saveAllToJSONBin().then(() => {
      loadFromJSONBin().then(() => {
        loadAdminData(); renderEvents(events);
        clearBtn?.click();
        alert("Event added!");
      });
    });
  });
  clearBtn?.addEventListener("click", function () {
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDate").value = "";
    document.getElementById("eventTime").value = "";
    document.getElementById("eventDescription").value = "";
    document.getElementById("eventLocation").value = "";
    document.getElementById("eventType").value = "workshop";
  });
}

function setupAdminContent() {
  const saveHome = document.getElementById("saveHomeBtn");
  const saveAbout = document.getElementById("saveAboutBtn");
  const saveFooter = document.getElementById("saveFooterBtn");

  saveHome?.addEventListener("click", function () {
    const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
    content.tagline = document.getElementById("clubTagline").value || content.tagline;
    content.welcomeDesc = document.getElementById("welcomeText").value || content.welcomeDesc;
    content.joinLink = document.getElementById("joinLink").value || content.joinLink;
    content.festLink = document.getElementById("festLink").value || content.festLink;
    localStorage.setItem("ngdcscContent", JSON.stringify(content));
    saveAllToJSONBin().then(() => { loadFromJSONBin().then(() => { renderContent(content); alert("Saved!"); }); });
  });

  saveAbout?.addEventListener("click", function () {
    const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
    content.aboutDesc = document.getElementById("aboutDescription").value || content.aboutDesc;
    content.mission = document.getElementById("missionText").value || content.mission;
    content.vision = document.getElementById("visionText").value || content.vision;
    localStorage.setItem("ngdcscContent", JSON.stringify(content));
    saveAllToJSONBin().then(() => { loadFromJSONBin().then(() => { renderContent(content); alert("Saved!"); }); });
  });

  saveFooter?.addEventListener("click", function () {
    const content = JSON.parse(localStorage.getItem("ngdcscContent") || "{}");
    content.footerEmail = document.getElementById("footerEmail").value || content.footerEmail;
    content.facebookLink = document.getElementById("facebookLink").value || content.facebookLink;
    content.instagramLink = document.getElementById("instagramLink").value || content.instagramLink;
    localStorage.setItem("ngdcscContent", JSON.stringify(content));
    saveAllToJSONBin().then(() => { loadFromJSONBin().then(() => { renderContent(content); alert("Saved!"); }); });
  });
}
