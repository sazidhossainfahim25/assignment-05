let allIssues = []; 

// Display issues  length count hobe
const displayIssues = (issues) => {
  const container = document.getElementById("issuesContainer");
  container.innerHTML = "";

  // Show total count
  document.getElementById("issueLength").innerText = ` ${issues.length}`;

  issues.forEach(issue => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg transition mb-3";

    // Border  status color
    if(issue.status === "open"){
      card.classList.add("border-t-4","border-green-500");
    } else {
      card.classList.add("border-t-4","border-purple-500");
    }

    // Card content
    card.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <img src="assets/Open-Status.png" alt="">
        <button class="w-20 h-6 rounded-[100px] bg-[#FEECEC] text-[#EF4444] text-[12px] font-semibold">
          ${issue.priority}
        </button>
      </div>
      <h3 class="titel-text font-semibold text-gray-800 mb-2">${issue.title}</h3>
      <p class="pere-text text-[12px]">${issue.description}</p>
      <div class="flex gap-2 mb-3">
        ${issue.labels.map(label => `<span class="text-xs border px-2 py-1 rounded-2xl bg-[#FFF8DB] text-red-500 border-[#FECACA]">${label}</span>`).join('')}
      </div>
      <p class="pere-text text-[12px]">#${issue.id} by ${issue.author}</p>
      <p class="pere-text text-[12px]">${issue.createdAt}</p>
    `;
      card.addEventListener('click', () => openModal(issue));
    container.appendChild(card);
  });
};

// Tab highlight + filtered display
function setActiveTab(tabId) {
  // Highlight active tab
  document.querySelectorAll(".btntab").forEach(tab => tab.classList.remove("bg-blue-700", "text-white"));
  const tab = document.getElementById(tabId);
  tab.classList.add("bg-blue-700", "text-white");

  // Filter issues based on tab
  let filteredIssues;
  if(tabId === "allTab"){
    filteredIssues = allIssues;
  } else if(tabId === "openTab"){
    filteredIssues = allIssues.filter(issue => issue.status === "open");
  } else if(tabId === "closeTab"){
    filteredIssues = allIssues.filter(issue => issue.status === "closed");
  }

  displayIssues(filteredIssues);
}

// Load issues from API
const loadIssues = async () => {
    const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await response.json();
    allIssues = data.data;
    setActiveTab("allTab"); // Show all issues default
};

const openModal = (issue) => {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");

  // Dynamic mapping of selectors to values
  const fields = {
    "h2": issue.title,
    ".modal-desc": issue.description,
    ".modal-priority": issue.priority,
    ".assignee": issue.author,
    ".createdAt": issue.createdAt,
    ".status-span": issue.status
  };

  for (let selector in fields) {
    const el = modal.querySelector(selector);
    if (!el) continue;

    // For status, we need class + text
    if (selector === ".status-span") {
      el.innerText = fields[selector];
      el.className = `status-span text-xs px-2 py-1 rounded-full ${issue.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`;
    } 
    // For others, just innerText
    else {
      el.innerText = fields[selector];
    }
  }

  // Tags separately (HTML content)
  modal.querySelector(".tags-container").innerHTML = issue.labels
    .map(label => `<span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">${label}</span>`)
    .join('');
};

// Modal close button
document.querySelector('#modal .close-btn').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

// searchInput
document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allIssues.filter(issue =>
    issue.title.toLowerCase().includes(query) ||
    issue.description.toLowerCase().includes(query)
  );
  displayIssues(filtered);
});
// Initialize
loadIssues();